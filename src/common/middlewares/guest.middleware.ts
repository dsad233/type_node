import { Request, Response, NextFunction } from 'express';
import { redis } from '../../redis/redis.config';
import { Authority } from '../../../generated/prisma/enums';
import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import {
  JWT_GUEST_ACCESS_ALGORITHM,
  JWT_GUEST_ACCESS_EXPIRES,
  JWT_GUEST_ACCESS_SECRET_KEY,
  JWT_GUEST_ACCESS_TTL,
} from '../configs/keys';

export default async function GuestMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // 로그인 세션이 존재할 때, 통과 처리
  if (req.headers.authorization || req.user) {
    return next();
  }

  // 기존 guest 세션 조회
  const guestSession = await redis.get(
    `${Authority.GUEST}:guestId=${req.cookies.guestId}`,
  );

  // 기존 guest 세션이 있다면 통과 처리
  if (guestSession) {
    return next();
  }

  // 임시 id
  const guestId = crypto.randomUUID();
  // 비로그인 유저 세션 데이터
  const session = {
    id: guestId,
    user_ip: req.ip?.length ? req.ip : req.ips,
    user_agent: req.headers['user-agent'],
    // 요청한 url
    request_path: req.originalUrl,
    createdAt: new Date(),
  };

  // 비로그인 유저 토큰 발급
  const token = jwt.sign(session, JWT_GUEST_ACCESS_SECRET_KEY, {
    algorithm: JWT_GUEST_ACCESS_ALGORITHM,
    expiresIn: JWT_GUEST_ACCESS_EXPIRES,
  } as SignOptions);

  // redis에 guest 토큰 저장
  await redis.setex(
    `${Authority.GUEST}:guestId=${guestId}`,
    JWT_GUEST_ACCESS_TTL,
    token,
  );

  res.cookie('guestId', guestId, {
    maxAge: 3600000,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  req.guest = session;

  next();
}
