import express from 'express';
import { prisma } from '../common/configs/prisma-client';
import { redis } from '../redis/redis.config';

import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import AsyncWrapper from '../common/middlewares/asyncWrapper';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '../jwt/jwt.service';
import AuthMiddleware from '../common/middlewares/auth.middleware';
import { MailerService } from '../mailer/mailer.service';

const router: express.Router = express.Router();

const redisService = new RedisService(redis);
const jwtService = new JwtService();
const mailerService = new MailerService();

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(
  authRepository,
  redisService,
  jwtService,
  mailerService,
);
const authController = new AuthController(authService);

// 회원가입
router.post('/signup', AsyncWrapper(authController.signUp));
// 유저 이메일 인증 여부 업데이트
router.get('/verify', AsyncWrapper(authController.verifyEmail));
// 로그인
router.post('/signin', AsyncWrapper(authController.signIn));
// 로그아웃
router.post('/signout', AuthMiddleware, AsyncWrapper(authController.signOut));
// 토큰 재발급
router.post('/reissue', AuthMiddleware, AsyncWrapper(authController.reissue));
// 패스워드 변경
router.patch('/update/password', AsyncWrapper(authController.updatePassword));
// 이메일 인증
router.post('/certification', AsyncWrapper(authController.certifiEmail));
// 이메일 인증 완료
router.post(
  '/authentication',
  AsyncWrapper(authController.authenticationEmail),
);

export default router;
