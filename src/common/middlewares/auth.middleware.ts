import { Request, Response, NextFunction } from 'express';
import { Unauthorized, NotFound } from 'http-errors';
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';
import { prisma } from '../configs/prisma-client';
import { redis } from '../../redis/redis.config';
import { JWT_ACCESS_SECRET_KEY } from '../configs/keys';
import { StatusCodes } from 'http-status-codes';
import { Gender, State } from '../../../generated/prisma/enums';
import { TYPE } from '../libs';
import { JwtPayload } from '../../jwt/jwt.service';

export default async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | Response<{ message: string }>> {
  if (!req.headers.authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '사용자 정보가 존재하지 않습니다.',
    });
  }

  const token = checkTokenTypeRef(req.headers.authorization?.split(' ') ?? []);

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '토큰이 존재하지 않습니다. 다시 로그인 해주세요.',
    });
  }

  try {
    const decodePayload = jwt.verify(
      token,
      JWT_ACCESS_SECRET_KEY,
    ) as JwtPayload;

    if (!decodePayload) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '토큰 정보가 올바르지 않습니다. 다시 로그인 해주세요.',
      });
    }

    // redis에서 토큰 데이터 조회
    const accessToken = await redis.get(
      `${TYPE.PrefixType.USERS}:${TYPE.TokenType.ACCESS}:id=${decodePayload.id}`,
    );

    if (!accessToken) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: '로그인 해주세요.',
      });
    }

    if (token !== accessToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '토큰 정보가 일치하지 않습니다. 다시 로그인 해주세요.',
      });
    }

    if (!req.user) {
      const cachedUser = await redis.get(
        `${TYPE.PrefixType.USERS}:REQUEST:id=${decodePayload.id}`,
      );

      if (cachedUser) {
        req.user = JSON.parse(cachedUser);
        return next();
      } else {
        const user = await getUser(decodePayload);

        if (!user) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: '존재하지 않는 유저입니다. 다시 요청해 주세요.',
          });
        }

        req.user = user;

        await redis.setex(
          `${TYPE.PrefixType.USERS}:REQUEST:id=${decodePayload.id}`,
          1800,
          JSON.stringify(user),
        );
      }
    }

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '잘못된 토큰 입니다. 다시 로그인 해주세요.' });
    } else if (error instanceof TokenExpiredError) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: '이미 만료된 토큰 입니다. 다시 로그인 해주세요.' });
    } else if (error instanceof NotBeforeError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: '토큰 발급 시기가 일치하지 않습니다. 다시 로그인 해주세요.',
      });
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: '사용자 인증 오류가 발생하였습니다. 다시 로그인 해주세요.',
    });
  }
}

// 토큰 타입 검증
function checkTokenTypeRef(token: string[]): string | undefined {
  if (token[0]?.toLowerCase() !== 'bearer') {
    throw new Unauthorized('토큰 타입이 변질되었습니다. 다시 로그인 해주세요.');
  }

  return token[1];
}

// 유저 정보 반환
async function getUser(payload: JwtPayload): Promise<{
  id: string;
  email: string;
  loginId: string;
  name: string;
  nickname: string;
  image: string | null;
  gender: Gender | null;
  birthDay: Date | null;
  phoneNumber: string | null;
  isPublic: State;
} | null> {
  const prop = payload.email ? payload.email : payload.loginId;

  if (!payload || !prop) {
    throw new NotFound('토큰 정보가 올바르지 않습니다. 다시 로그인 해주세요.');
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: payload.id, email: prop },
        { id: payload.id, loginId: prop },
      ],
    },
    select: {
      id: true,
      email: true,
      loginId: true,
      name: true,
      nickname: true,
      image: true,
      gender: true,
      birthDay: true,
      phoneNumber: true,
      isPublic: true,
    },
  });

  return user;
}
