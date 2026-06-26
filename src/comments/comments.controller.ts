import { Request, Response, NextFunction } from 'express';
import { CommentsService } from './comments.service';
import { StatusCodes } from 'http-status-codes';
import {
  CreateCommentDto,
  RequestReplyCommentCreateDto,
  RequestReplyCommentUpdateDto,
  RequestCommentCreateDto,
  RequestCommentUpdateDto,
  TRequestReplyCommentCreateDto,
  TRequestReplyCommentUpdateDto,
  TRequestCommentUpdateDto,
  TUpdateCommentDto,
  UpdateCommentDto,
} from './dto';

export class CommentsController {
  private readonly commentsService: CommentsService;
  constructor(commentsService: CommentsService) {
    this.commentsService = commentsService;
  }

  // 댓글 생성
  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.commentsService.create(
      await RequestCommentCreateDto(req.params.id as string),
      req.user.id as string,
      await CreateCommentDto(req.body),
    );
    return res.status(StatusCodes.CREATED).json({
      message: '댓글 생성 완료.',
    });
  };

  // 대댓글 생성
  replyCreate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.commentsService.replyCreate(
      await RequestReplyCommentCreateDto(
        req.params as TRequestReplyCommentCreateDto,
      ),
      req.user.id as string,
      await CreateCommentDto(req.body),
    );
    return res.status(StatusCodes.CREATED).json({
      message: '대댓글 생성 완료.',
    });
  };

  // 게시글 댓글 수 조회
  countPostComment = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string; count: number }>> => {
    return res.status(StatusCodes.OK).json({
      message: '게시글 댓글 수 조회 완료.',
      count: await this.commentsService.countPostComment(
        await RequestCommentCreateDto(req.params.id as string),
      ),
    });
  };

  // 댓글 수정
  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.commentsService.update(
      await RequestCommentUpdateDto(req.params as TRequestCommentUpdateDto),
      req.user.id as string,
      await UpdateCommentDto(req.body as TUpdateCommentDto),
    );
    return res.status(StatusCodes.OK).json({
      message: '댓글 수정 완료.',
    });
  };

  // 대댓글 수정
  replyUpdate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.commentsService.replyUpdate(
      await RequestReplyCommentUpdateDto(
        req.params as TRequestReplyCommentUpdateDto,
      ),
      req.user.id as string,
      await UpdateCommentDto(req.body as TUpdateCommentDto),
    );
    return res.status(StatusCodes.OK).json({
      message: '대댓글 수정 완료.',
    });
  };

  // 댓글 삭제
  remove = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.commentsService.remove(
      await RequestCommentUpdateDto(req.params as TRequestCommentUpdateDto),
      req.user.id as string,
    );
    return res.status(StatusCodes.OK).json({
      message: '댓글 삭제 완료.',
    });
  };

  // 대댓글 삭제
  replyRemove = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.commentsService.replyRemove(
      await RequestReplyCommentUpdateDto(
        req.params as TRequestReplyCommentUpdateDto,
      ),
      req.user.id as string,
    );
    return res.status(StatusCodes.OK).json({
      message: '대댓글 삭제 완료.',
    });
  };
}
