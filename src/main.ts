import express, { Express, Request, Response, NextFunction } from 'express';
import AuthRouter from './auth/auth.router';
import UsersRouter from './users/users.router';

import ErrorMiddleware from './common/middlewares/errorMiddleware';

import { HttpError } from 'http-errors';
import { prisma } from './common/configs/prisma-client';
import { redisCondition } from './redis/redis.config';
import cookieParser from 'cookie-parser';
import Cors from './common/middlewares/core';

const app: Express = express();
const port: number = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(Cors());

// Redis 상태 체크
redisCondition();

app.use("/auth", AuthRouter);

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) =>
  ErrorMiddleware(error, req, res, next),
);

app.listen(port, () => {
  prisma.$connect();
  console.log(port, '실행중...');
});

// 종료 이벤트
process.on('exit', () => {
  console.log('애플리케이션 종료중...');

  setTimeout(() => {
    prisma.$disconnect();

    process.exit();
  }, 2000);
});
