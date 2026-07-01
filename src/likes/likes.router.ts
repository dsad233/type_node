import express from 'express';
import { prisma } from '../common/configs/prisma-client';

import { LikesRepository } from './likes.repository';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import AuthMiddleware from '../common/middlewares/auth.middleware';
import AsyncWrapper from '../common/middlewares/asyncWrapper';

const router: express.Router = express.Router();

const likesRepository = new LikesRepository(prisma);
const likesService = new LikesService(likesRepository);
const likesController = new LikesController(likesService);

// 게시글 좋아요 생성 및 삭제
router.post(
  '/:id/likes',
  AuthMiddleware,
  AsyncWrapper(likesController.createAndDelete),
);
// 댓글 좋아요 생성 및 삭제
router.post(
  '/:id/comments/:commentId/likes',
  AuthMiddleware,
  AsyncWrapper(likesController.createCommentAndDelete),
);
// 대댓글 좋아요 생성 및 삭제
router.post(
  '/:id/comments/:commentId/replies/:replyId/likes',
  AuthMiddleware,
  AsyncWrapper(likesController.createReplyAndDelete),
);

export default router;
