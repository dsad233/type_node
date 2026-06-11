import express from 'express';
import { prisma } from '../common/configs/prisma-client';

import AuthMiddleware from '../common/middlewares/auth.middleware';
import AsyncWrapper from '../common/middlewares/asyncWrapper';

import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

const router: express.Router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

router.get('', AuthMiddleware, AsyncWrapper(usersController.find));
// 유저 상세 조회
router.get('/info', AuthMiddleware, AsyncWrapper(usersController.findOne));

export default router;
