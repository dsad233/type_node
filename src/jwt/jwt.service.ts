import jwt, { SignOptions } from "jsonwebtoken";
import {
  JWT_ACCESS_ALGORITHM,
  JWT_ACCESS_EXPIRES,
  JWT_REFRESH_ALGORITHM,
  JWT_REFRESH_EXPIRES,
} from "../common/configs/keys";
import { TokenType } from "../common/utils";

export class JwtService {
  // 토큰 생성
  async sign(payload: Object, secretKey: string, tokenType: string) {
    if (tokenType == TokenType.ACCESS) {
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
}
