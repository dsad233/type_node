import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '../common/configs/prisma-client';

import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import AsyncWrapper from '../common/middlewares/asyncWrapper';
import AuthMiddleware from '../common/middlewares/auth.middleware';
import GuestMiddleware from '../common/middlewares/guest.middleware';

const router: express.Router = express.Router();

const postsRepository = new PostsRepository(prisma);
const postsService = new PostsService(postsRepository);
const postsController = new PostsController(postsService);

// 게시글 생성
router.post('', AuthMiddleware, AsyncWrapper(postsController.create));
// 카테고리 목록 조회
router.get('/categories', AsyncWrapper(postsController.findCategory));
// 게시글 수 조회
router.get('/count', AsyncWrapper(postsController.countPosts));
// 카테고리별 게시글 수 조회
router.get(
  '/count/category',
  AsyncWrapper(postsController.countByCategoryPost),
);
// 게시글 목록 조회
router.get(
  '',
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.headers.authorization) {
      return await GuestMiddleware(req, res, next);
    }

    return await AuthMiddleware(req, res, next);
  },
  AsyncWrapper(postsController.find),
);
// 게시글 상세 조회
router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.headers.authorization) {
      return await GuestMiddleware(req, res, next);
    }

    return await AuthMiddleware(req, res, next);
  },
  AsyncWrapper(postsController.findOne),
);

export default router;
