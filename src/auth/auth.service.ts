import { BadRequest, NotFound, Unauthorized } from 'http-errors';
import { AuthRepository } from './auth.repository';
import { RedisService } from '../redis/redis.service';
import { comparePassword, regEx } from '../common/utils';
import { ICreateUserDto, ISignInDto } from './dto';
import { JwtService } from '../jwt/jwt.service';
import {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_TTL,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_TTL,
} from '../common/configs/keys';
import { TYPE } from '../common/libs';
import { IUpdatePassowrdDto } from './dto/updatePasswordDto';

export class AuthService {
  private readonly authRepository: AuthRepository;
  private readonly redisService: RedisService;
  private readonly jwtService: JwtService;
  constructor(
    authRepository: AuthRepository,
    redisService: RedisService,
    jwtService: JwtService,
  ) {
    this.authRepository = authRepository;
    this.redisService = redisService;
    this.jwtService = jwtService;
  }

  // 유저 생성
  signUp = async (dto: ICreateUserDto): Promise<void> => {
    const alreadyEmail = await this.authRepository.existEmail(dto.email);
    if (alreadyEmail) {
      throw new BadRequest('이미 존재하는 이메일 입니다.');
    }

    const alreadyUserId = await this.authRepository.existLoginId(dto.loginId);
    if (alreadyUserId) {
      throw new BadRequest('이미 존재하는 사용자 ID 입니다.');
    }

    const alreadyNickname = await this.authRepository.existNickname(
      dto.nickname,
    );
    if (alreadyNickname) {
      throw new BadRequest('이미 존재하는 닉네임 입니다.');
    }

    // 전화번호 입력 값이 존재할 경우, 중복 체크
    if (dto.phoneNumber) {
      const alreadyPhoneNumber = await this.authRepository.existPhoneNumber(
        dto.phoneNumber,
      );
      if (alreadyPhoneNumber) {
        throw new BadRequest('이미 존재하는 전화번호 입니다.');
      }
    }

    await this.authRepository.create(dto);
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
  reisSue = async (refreshToken: string) => {
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

  // // 패스워드 변경
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
}
