import { BadRequest, NotFound, Unauthorized, Conflict } from 'http-errors';
import { AuthRepository } from './auth.repository';
import { RedisService } from '../redis/redis.service';
import { comparePassword, randomConst, regEx } from '../common/utils';
import { ICreateUserDto, ISignInDto, IUpdatePassowrdDto } from './dto';
import { JwtService } from '../jwt/jwt.service';
import {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_TTL,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_TTL,
} from '../common/configs/keys';
import { TYPE } from '../common/libs';
import { MailerService } from '../mailer/mailer.service';
import { State } from '../../generated/prisma/enums';

export class AuthService {
  private readonly authRepository: AuthRepository;
  private readonly redisService: RedisService;
  private readonly jwtService: JwtService;
  private readonly mailerService: MailerService;
  constructor(
    authRepository: AuthRepository,
    redisService: RedisService,
    jwtService: JwtService,
    mailerService: MailerService,
  ) {
    this.authRepository = authRepository;
    this.redisService = redisService;
    this.jwtService = jwtService;
    this.mailerService = mailerService;
  }

  // 유저 생성
  signUp = async (dto: ICreateUserDto): Promise<void> => {
    const alreadyEmail = await this.authRepository.existEmail(dto.email);
    if (alreadyEmail) {
      throw new Conflict('이미 존재하는 이메일 입니다.');
    }

    const alreadyUserId = await this.authRepository.existLoginId(dto.loginId);
    if (alreadyUserId) {
      throw new Conflict('이미 존재하는 사용자 ID 입니다.');
    }

    const alreadyNickname = await this.authRepository.existNickname(
      dto.nickname,
    );
    if (alreadyNickname) {
      throw new Conflict('이미 존재하는 닉네임 입니다.');
    }

    // 전화번호 입력 값이 존재할 경우, 중복 체크
    if (dto.phoneNumber) {
      const alreadyPhoneNumber = await this.authRepository.existPhoneNumber(
        dto.phoneNumber,
      );
      if (alreadyPhoneNumber) {
        throw new Conflict('이미 존재하는 전화번호 입니다.');
      }
    }

    await this.authRepository.create(dto);

    // 인증 이메일 전송
    await this.mailerService.send(dto.email, null);
  };

  // 유저 이메일 인증 여부 업데이트
  verifyEmail = async (email: string) => {
    const user = await this.authRepository.verifyEmail(email);

    if (!user) {
      throw new NotFound('존재하지 않는 유저 입니다.');
    }

    if (user.verify === State.TRUE) {
      throw new BadRequest('이미 이메일 인증이 완료된 유저 입니다.');
    }

    await this.authRepository.updateVerify(email);
  };

  // 로그인
  signIn = async (
    dto: ISignInDto,
  ): Promise<{ access_token: string; refresh_token: string }> => {
    // 입력 받은 값이 이메일 이라면,
    if (dto.loginId?.match(regEx.email)) {
      const user = await this.authRepository.emailSigIn(dto.loginId);

      if (!user) {
        throw new NotFound('존재하지 않는 유저 입니다.');
      }

      if (!(await comparePassword(dto.password, user.password))) {
        throw new BadRequest(
          '패스워드가 일치하지 않습니다. 다시 시도해 주세요.',
        );
      }

      if (user.verify === State.FALSE) {
        throw new BadRequest(
          '이메일 인증이 완료되지 않은 유저입니다. 이메일 인증을 완료 해주세요.',
        );
      }

      const accessToken = await this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT_ACCESS_SECRET_KEY,
        TYPE.TokenType.ACCESS,
      );
      const refreshToken = await this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT_REFRESH_SECRET_KEY,
        TYPE.TokenType.REFRESH,
      );

      // access 토큰 설정
      await this.redisService.setex(
        `${TYPE.PrefixType.USERS}:${TYPE.TokenType.ACCESS}:id=${user.id}`,
        JWT_ACCESS_TTL,
        accessToken,
      );
      // refresh 토큰 설정
      await this.redisService.setex(
        `${TYPE.PrefixType.USERS}:${TYPE.TokenType.REFRESH}:id=${user.id}`,
        JWT_REFRESH_TTL,
        refreshToken,
      );

      return { access_token: accessToken, refresh_token: refreshToken };
    }

    const user = await this.authRepository.loginIdSigIn(dto.loginId);

    if (!user) {
      throw new NotFound('존재하지 않는 유저 입니다.');
    }

    if (!(await comparePassword(dto.password, user.password))) {
      throw new BadRequest('패스워드가 일치하지 않습니다. 다시 시도해 주세요.');
    }

    if (user.verify === State.FALSE) {
      throw new BadRequest(
        '이메일 인증이 완료되지 않은 유저입니다. 이메일 인증을 완료 해주세요.',
      );
    }

    const accessToken = await this.jwtService.sign(
      {
        id: user.id,
        loginId: user.loginId,
      },
      JWT_ACCESS_SECRET_KEY,
      TYPE.TokenType.ACCESS,
    );
    const refreshToken = await this.jwtService.sign(
      {
        id: user.id,
        loginId: user.loginId,
      },
      JWT_REFRESH_SECRET_KEY,
      TYPE.TokenType.REFRESH,
    );

    // access 토큰 설정
    await this.redisService.setex(
      `${TYPE.PrefixType.USERS}:${TYPE.TokenType.ACCESS}:id=${user.id}`,
      JWT_ACCESS_TTL,
      accessToken,
    );
    // refresh 토큰 설정
    await this.redisService.setex(
      `${TYPE.PrefixType.USERS}:${TYPE.TokenType.REFRESH}:id=${user.id}`,
      JWT_REFRESH_TTL,
      refreshToken,
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  };

  // 로그아웃
  signOut = async (userId: string): Promise<void> => {
    await this.redisService.delete(
      `${TYPE.PrefixType.USERS}:${TYPE.TokenType.ACCESS}:id=${userId}`,
    );
    await this.redisService.delete(
      `${TYPE.PrefixType.USERS}:${TYPE.TokenType.REFRESH}:id=${userId}`,
    );
    await this.redisService.delete(
      `${TYPE.PrefixType.USERS}:REQUEST:id=${userId}`,
    );
  };

  // 토큰 재발급
  reissue = async (refreshToken: string) => {
    const payload = await this.jwtService.verify(
      refreshToken,
      TYPE.TokenType.REFRESH,
    );

    if (!payload.email && !payload.loginId) {
      throw new Unauthorized(
        '토큰 정보가 일치하지 않습니다. 다시 로그인 해주세요.',
      );
    }

    // 이메일 로그인 처리
    if (payload.email && payload.email.match(regEx.email)) {
      const user = await this.authRepository.verifyEmailPayload(
        payload.id,
        payload.email,
      );

      if (!user) {
        throw new NotFound('존재하지 않는 유저 입니다.');
      }

      // Access 토큰 생성
      const accessToken = await this.jwtService.sign(
        user,
        JWT_ACCESS_SECRET_KEY,
        TYPE.TokenType.ACCESS,
      );

      // RefreshToken 생성
      const refreshToken = await this.jwtService.sign(
        user,
        JWT_REFRESH_SECRET_KEY,
        TYPE.TokenType.REFRESH,
      );

      await this.redisService.setex(
        `${TYPE.PrefixType.USERS}:${TYPE.TokenType.ACCESS}:id=${user.id}`,
        JWT_ACCESS_TTL,
        accessToken,
      );

      await this.redisService.setex(
        `${TYPE.PrefixType.USERS}:${TYPE.TokenType.REFRESH}:id=${user.id}`,
        JWT_REFRESH_TTL,
        refreshToken,
      );

      return { access_token: accessToken, refresh_token: refreshToken };
    } else if (payload.loginId) {
      const user = await this.authRepository.verifyLoginIdPayload(
        payload.id,
        payload.loginId,
      );

      if (!user) {
        throw new NotFound('존재하지 않는 유저 입니다.');
      }

      // Access 토큰 생성
      const newAccessToken = await this.jwtService.sign(
        user,
        JWT_ACCESS_SECRET_KEY,
        TYPE.TokenType.ACCESS,
      );

      // RefreshToken 생성
      const newRefreshToken = await this.jwtService.sign(
        user,
        JWT_REFRESH_SECRET_KEY,
        TYPE.TokenType.REFRESH,
      );

      await this.redisService.setex(
        `${TYPE.PrefixType.USERS}:${TYPE.TokenType.ACCESS}:id=${user.id}`,
        JWT_ACCESS_TTL,
        newAccessToken,
      );

      await this.redisService.setex(
        `${TYPE.PrefixType.USERS}:${TYPE.TokenType.REFRESH}:id=${user.id}`,
        JWT_REFRESH_TTL,
        newRefreshToken,
      );

      return { access_token: newAccessToken, refresh_token: newRefreshToken };
    }
  };

  // 패스워드 변경
  updatePassword = async (
    userEmail: string,
    dto: IUpdatePassowrdDto,
  ): Promise<void> => {
    const user = await this.authRepository.emailSigIn(userEmail);

    if (!user) {
      throw new NotFound('존재하지 않는 유저 입니다.');
    }

    if (!(await comparePassword(dto.oldPassword, user.password))) {
      throw new BadRequest('패스워드가 일치하지 않습니다. 다시 시도해 주세요.');
    }

    await this.authRepository.updatePassword(user.id, dto.newPassowrd);
  };

  // 패스워드 변경 이메일 인증
  certifiEmail = async (email: string): Promise<void> => {
    // 랜덤 상수
    const random = randomConst();

    await this.redisService.setex(
      `${TYPE.PrefixType.USERS}:CERTIFI:email=${email}`,
      // 3분
      300,
      String(random),
    );

    // 이메일 전송
    await this.mailerService.send(email, random);
  };

  // 패스워드 변경 이메일 인증 완료
  authenticationEmail = async (email: string, code: string): Promise<void> => {
    const authCode = await this.redisService.get(
      `${TYPE.PrefixType.USERS}:CERTIFI:email=${email}`,
    );

    if (!authCode) {
      throw new NotFound('인증 코드가 만료되었습니다. 다시 요청해 주세요.');
    }

    if (authCode !== code) {
      throw new Unauthorized(
        '인증 번호가 일치하지 않습니다. 다시 시도해주세요.',
      );
    }
  };
}
