import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  SignOptions,
  TokenExpiredError,
} from 'jsonwebtoken';
import { BadRequest, Unauthorized } from 'http-errors';
import {
  JWT_ACCESS_ALGORITHM,
  JWT_ACCESS_EXPIRES,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_ALGORITHM,
  JWT_REFRESH_EXPIRES,
  JWT_REFRESH_SECRET_KEY,
} from '../common/configs/keys';
import { TYPE } from '../common/libs';
import { redis } from '../redis/redis.config';

export type JwtPayload = {
  id: string;
  email: string | null;
  loginId: string | null;
  iat: number;
  exp: number;
};

export class JwtService {
  // 토큰 생성
  async sign(
    payload: Object,
    secretKey: string,
    tokenType: string,
  ): Promise<string> {
    if (tokenType === TYPE.TokenType.ACCESS) {
      return jwt.sign(payload, secretKey, {
        algorithm: JWT_ACCESS_ALGORITHM,
        expiresIn: JWT_ACCESS_EXPIRES,
      } as SignOptions);
    }

    return jwt.sign(payload, secretKey, {
      algorithm: JWT_REFRESH_ALGORITHM,
      expiresIn: JWT_REFRESH_EXPIRES,
    } as SignOptions);
  }

  // 토큰 복호화
  async verify(token: string, tokenType: string): Promise<JwtPayload> {
    try {
      if (tokenType === TYPE.TokenType.ACCESS) {
        const payload = jwt.verify(token, JWT_ACCESS_SECRET_KEY) as JwtPayload;

        const session = await redis.get(
          `${TYPE.PrefixType.USERS}:${TYPE.TokenType.REFRESH}:id=${payload.id}`,
        );

        if (token !== session) {
          throw new Unauthorized(
            '올바르지 않는 액세스 토큰 입니다. 다시 로그인 해주세요.',
          );
        }

        return payload;
      }

      const payload = jwt.verify(token, JWT_REFRESH_SECRET_KEY) as JwtPayload;

      const session = await redis.get(
        `${TYPE.PrefixType.USERS}:${TYPE.TokenType.REFRESH}:id=${payload.id}`,
      );

      if (token !== session) {
        throw new Unauthorized(
          '올바르지 않는 리프래쉬 토큰 입니다. 다시 로그인 해주세요.',
        );
      }

      return payload;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new BadRequest('잘못된 토큰 입니다. 다시 로그인 해주세요.');
      } else if (error instanceof TokenExpiredError) {
        throw new Unauthorized(
          '이미 만료된 토큰 입니다. 다시 로그인 해주세요.',
        );
      } else if (error instanceof NotBeforeError) {
        throw new Unauthorized(
          '토큰 발급 시기가 일치하지 않습니다. 다시 로그인 해주세요.',
        );
      }

      throw new Unauthorized(
        '사용자 인증 오류가 발생하였습니다. 다시 로그인 해주세요.',
      );
    }
  }
}
