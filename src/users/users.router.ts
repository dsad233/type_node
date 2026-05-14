import express from 'express';
import { prisma } from '../common/configs/prisma-client';

import AuthMiddleware from '../common/middlewares/auth.middleware';
import AsyncWrapper from '../common/middlewares/asyncWrapper';
import GuestMiddleware from '../common/middlewares/guest.middleware';

import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

const router: express.Router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

router.get(
  '',
  async (req, res, next) => {
    if (!req.headers.authorization) {
      return await GuestMiddleware(req, res, next);
    }

    return await AuthMiddleware(req, res, next);
  },
  AsyncWrapper(usersController.find),
);

export default router;
