import { NotFound } from 'http-errors';
import { CommentsRepository } from './commnets.repository';
import {
  TCreateCommentDto,
  TRequestReplyCommentCreateDto,
  TRequestReplyCommentUpdateDto,
  TRequestCommentCreateDto,
  TRequestCommentUpdateDto,
  TUpdateCommentDto,
} from './dto';

export class CommentsService {
  private readonly commentsRepository: CommentsRepository;
  constructor(commentsRepository: CommentsRepository) {
    this.commentsRepository = commentsRepository;
  }

  // 댓글 생성
  create = async (
    params: TRequestCommentCreateDto,
    userId: string,
    body: TCreateCommentDto,
  ): Promise<void> => {
    const post = await this.commentsRepository.findByPostId(params.id);

    if (!post) {
      throw new NotFound('게시글을 찾을 수 없습니다.');
    }

    await this.commentsRepository.create(params.id, userId, body);
  };

  // 대댓글 생성
  replyCreate = async (
    params: TRequestReplyCommentCreateDto,
    userId: string,
    body: TCreateCommentDto,
  ): Promise<void> => {
    const post = await this.commentsRepository.findByPostId(params.id);

    if (!post) {
      throw new NotFound('게시글을 찾을 수 없습니다.');
    }

    const comment = await this.commentsRepository.findByCommentId(
      params.commentId,
    );

    if (!comment) {
      throw new NotFound('해당 댓글을 찾을 수 없습니다.');
    }

    await this.commentsRepository.replyCreate(params, userId, body);
  };

  // 게시글 댓글 수 조회
  countPostComment = async ({
    id,
  }: TRequestCommentCreateDto): Promise<number> => {
    const post = await this.commentsRepository.findByPostId(id);

    if (!post) {
      throw new NotFound('게시글을 찾을 수 없습니다.');
    }

    const comment = await this.commentsRepository.findByCommentId(id);

    if (!comment) {
      throw new NotFound('해당 댓글을 찾을 수 없습니다.');
    }

    return await this.commentsRepository.countPostComment(id);
  };

  // 댓글 수정
  update = async (
    params: TRequestCommentUpdateDto,
    userId: string,
    body: TUpdateCommentDto,
  ): Promise<void> => {
    const comment = await this.commentsRepository.checkUseComment(
      params,
      userId,
    );

    if (!comment) {
      throw new NotFound('해당 댓글을 찾을 수 없습니다.');
    }

    await this.commentsRepository.update(params, userId, body);
  };

  // 대댓글 수정
  replyUpdate = async (
    params: TRequestReplyCommentUpdateDto,
    userId: string,
    body: TUpdateCommentDto,
  ): Promise<void> => {
    const post = await this.commentsRepository.findByPostId(params.id);

    if (!post) {
      throw new NotFound('게시글을 찾을 수 없습니다.');
    }

    const comment = await this.commentsRepository.checkUseReplyComment(
      params,
      userId,
    );

    if (!comment) {
      throw new NotFound('해당 대댓글을 찾을 수 없습니다.');
    }

    await this.commentsRepository.replyUpdate(params, userId, body);
  };

  // 댓글 삭제
  remove = async (
    params: TRequestCommentUpdateDto,
    userId: string,
  ): Promise<void> => {
    const comment = await this.commentsRepository.checkUseComment(
      params,
      userId,
    );

    if (!comment) {
      throw new NotFound('해당 댓글을 찾을 수 없습니다.');
    }

    await this.commentsRepository.remove(params, userId);
  };

  // 대댓글 삭제
  replyRemove = async (
    params: TRequestReplyCommentUpdateDto,
    userId: string,
  ): Promise<void> => {
    const post = await this.commentsRepository.findByPostId(params.id);

    if (!post) {
      throw new NotFound('게시글을 찾을 수 없습니다.');
    }

    const comment = await this.commentsRepository.checkUseReplyComment(
      params,
      userId,
    );

    if (!comment) {
      throw new NotFound('해당 대댓글을 찾을 수 없습니다.');
    }

    await this.commentsRepository.replyRemove(params, userId);
  };
}
