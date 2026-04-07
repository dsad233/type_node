import { BadRequest, NotFound } from "http-errors";
import { AuthRepository } from "./auth.repository";
import { RedisService } from "../redis/redis.service";
import { comparePassword, regEx, TokenType } from "../common/utils";
import { ICreateUserDto, ISignInDto } from "./dto";
import { JwtService } from "../jwt/jwt.service";
import {
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
} from "../common/configs/keys";

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
      throw new BadRequest("이미 존재하는 이메일 입니다.");
    }

    const alreadyUserId = await this.authRepository.existUserId(dto.loginId);
    if (alreadyUserId) {
      throw new BadRequest("이미 존재하는 사용자 ID 입니다.");
    }

    const alreadyNickname = await this.authRepository.existNickname(
      dto.nickname,
    );
    if (alreadyNickname) {
      throw new BadRequest("이미 존재하는 닉네임 입니다.");
    }

    // 전화번호 입력 값이 존재할 경우, 중복 체크
    if (dto.phoneNumber) {
      const alreadyPhoneNumber = await this.authRepository.existPhoneNumber(
        dto.phoneNumber,
      );
      if (alreadyPhoneNumber) {
        throw new BadRequest("이미 존재하는 전화번호 입니다.");
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
        throw new NotFound("존재하지 않는 유저 입니다.");
      }

      if (!(await comparePassword(dto.password, user.password))) {
        throw new BadRequest(
          "패스워드가 일치하지 않습니다. 다시 시도해 주세요.",
        );
      }

      const accessToken = await this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          gender: user.gender,
        },
        JWT_ACCESS_SECRET_KEY,
        TokenType.ACCESS,
      );
      const refreshToken = await this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          gender: user.gender,
        },
        JWT_REFRESH_SECRET_KEY,
        TokenType.REFRESH,
      );

      return { access_token: accessToken, refresh_token: refreshToken };
    }

    const user = await this.authRepository.loginIdSigIn(dto.loginId);

    if (!user) {
      throw new NotFound("존재하지 않는 유저 입니다.");
    }

    if (!(await comparePassword(dto.password, user.password))) {
      throw new BadRequest("패스워드가 일치하지 않습니다. 다시 시도해 주세요.");
    }

    const accessToken = await this.jwtService.sign(
      {
        id: user.id,
        loginId: user.loginId,
        name: user.name,
        nickname: user.nickname,
        gender: user.gender,
      },
      JWT_ACCESS_SECRET_KEY,
      TokenType.ACCESS,
    );
    const refreshToken = await this.jwtService.sign(
      {
        id: user.id,
        loginId: user.loginId,
        name: user.name,
        nickname: user.nickname,
        gender: user.gender,
      },
      JWT_REFRESH_SECRET_KEY,
      TokenType.REFRESH,
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  };
}
