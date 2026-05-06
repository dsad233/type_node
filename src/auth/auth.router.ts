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

const router: express.Router = express.Router();

const redisService = new RedisService(redis);
const jwtService = new JwtService();

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository, redisService, jwtService);
const authController = new AuthController(authService);

// 회원가입
router.post('/signup', AsyncWrapper(authController.signUp));
// 로그인
router.post('/signin', AsyncWrapper(authController.signIn));
// 로그아웃
router.post('/signout', AuthMiddleware, AsyncWrapper(authController.signOut));
// 토큰 재발급
router.post('/reissue', AuthMiddleware, AsyncWrapper(authController.reissue));
// 패스워드 변경
router.patch(
  '/update/password',
  AuthMiddleware,
  AsyncWrapper(authController.updatePassword),
);

export default router;
