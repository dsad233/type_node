import { Request, Response, NextFunction } from 'express';
import { LikesService } from './likes.service';
import { StatusCodes } from 'http-status-codes';
import {
  RequestCommentLikeDto,
  RequestPostLikeDto,
  RequestReplyLikeDto,
  TRequestCommentLikeDto,
  TRequestPostLikeDto,
  TRequestReplyLikeDto,
} from './dto';

export class LikesController {
  private readonly likesService: LikesService;
  constructor(likesService: LikesService) {
    this.likesService = likesService;
  }

  // 게시글 좋아요 생성 및 삭제
  createAndDelete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    const like = await this.likesService.createAndDelete(
      await RequestPostLikeDto(req.params as TRequestPostLikeDto),
      req.user.id as string,
    );

    if (!like) {
      return res
        .status(StatusCodes.OK)
        .json({ message: '게시글 좋아요 삭제 완료.' });
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ message: '게시글 좋아요 생성 완료.' });
  };

  // 댓글 좋아요 생성 및 삭제
  createCommentAndDelete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    const like = await this.likesService.createCommentAndDelete(
      await RequestCommentLikeDto(req.params as TRequestCommentLikeDto),
      req.user.id as string,
    );

    if (!like) {
      return res
        .status(StatusCodes.OK)
        .json({ message: '댓글 좋아요 삭제 완료.' });
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ message: '댓글 좋아요 생성 완료.' });
  };

  // 대댓글 좋아요 생성 및 삭제
  createReplyAndDelete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    const like = await this.likesService.createReplyAndDelete(
      await RequestReplyLikeDto(req.params as TRequestReplyLikeDto),
      req.user.id as string,
    );

    if (!like) {
      return res
        .status(StatusCodes.OK)
        .json({ message: '대댓글 좋아요 삭제 완료.' });
    }

    return res
      .status(StatusCodes.CREATED)
      .json({ message: '대댓글 좋아요 생성 완료.' });
  };
}
