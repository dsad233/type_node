import express from 'express';
import { prisma } from '../common/configs/prisma-client';

import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import AsyncWrapper from '../common/middlewares/asyncWrapper';
import AuthMiddleware from '../common/middlewares/auth.middleware';

const router: express.Router = express.Router();

const commentsRepository = new CommentsRepository(prisma);
const commentsService = new CommentsService(commentsRepository);
const commentsController = new CommentsController(commentsService);

// 댓글 생성
router.post(
  '/:id/comments',
  AuthMiddleware,
  AsyncWrapper(commentsController.create),
);
// 대댓글 생성
router.post(
  '/:id/comments/:commentId',
  AuthMiddleware,
  AsyncWrapper(commentsController.replyCreate),
);
// 댓글 수정
router.patch(
  '/:id/comments/:commentId',
  AuthMiddleware,
  AsyncWrapper(commentsController.update),
);
// 대댓글 수정
router.patch(
  '/:id/comments/:commentId/replies/:replyId',
  AuthMiddleware,
  AsyncWrapper(commentsController.replyUpdate),
);
// 댓글 삭제
router.patch(
  '/:id/comments/:commentId/remove',
  AuthMiddleware,
  AsyncWrapper(commentsController.remove),
);
// 대댓글 수정
router.patch(
  '/:id/comments/:commentId/replies/:replyId/remove',
  AuthMiddleware,
  AsyncWrapper(commentsController.replyRemove),
);

export default router;
