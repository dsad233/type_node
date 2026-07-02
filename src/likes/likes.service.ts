import { Type } from '../../generated/prisma/enums';
import {
  TRequestCommentLikeDto,
  TRequestPostLikeDto,
  TRequestReplyLikeDto,
} from './dto';
import { LikesRepository } from './likes.repository';
import { NotFound } from 'http-errors';

export class LikesService {
  private readonly likesRepository: LikesRepository;
  constructor(likesRepository: LikesRepository) {
    this.likesRepository = likesRepository;
  }

  // 게시글 좋아요 생성 및 삭제
  createAndDelete = async (
    params: TRequestPostLikeDto,
    userId: string,
  ): Promise<boolean> => {
    const post = await this.likesRepository.findByPostId(params.id);

    if (!post) {
      throw new NotFound('게시글을 찾을 수 없습니다.');
    }

    const like = await this.likesRepository.findById(params, Type.POST, userId);

    if (like) {
      // 게시글 좋아요가 존재한다면, 기존 좋아요 삭제처리
      await this.likesRepository.delete(params.id, like.id, userId);
      return false;
    }

    // 좋아요가 존재하지 않을 때, 좋아요 생성
    await this.likesRepository.create(params.id, userId);
    return true;
  };

  // 댓글 좋아요 생성 및 삭제
  createCommentAndDelete = async (
    params: TRequestCommentLikeDto,
    userId: string,
  ): Promise<boolean> => {
    const comment = await this.likesRepository.findByCommentId(params);

    if (!comment) {
      throw new NotFound('해당 댓글을 찾을 수 없습니다.');
    }

    const commentLike = await this.likesRepository.findById(
      params,
      Type.COMMENT,
      userId,
    );

    if (commentLike) {
      // 댓글 좋아요가 존재한다면, 기존 좋아요 삭제처리
      await this.likesRepository.deleteComment(params, commentLike.id, userId);
      return false;
    }

    // 좋아요가 존재하지 않을 때, 좋아요 생성
    await this.likesRepository.createComment(params, userId);
    return true;
  };

  // 대댓글 좋아요 생성 및 삭제
  createReplyAndDelete = async (
    params: TRequestReplyLikeDto,
    userId: string,
  ): Promise<boolean> => {
    const reply = await this.likesRepository.findByReplyId(params);

    if (!reply) {
      throw new NotFound('해당 대댓글을 찾을 수 없습니다.');
    }

    const replyLike = await this.likesRepository.findById(
      params,
      Type.REPLY,
      userId,
    );

    if (replyLike) {
      // 대댓글 좋아요가 존재한다면, 기존 좋아요 삭제처리
      await this.likesRepository.deleteReply(params, replyLike.id, userId);
      return false;
    }
    // 좋아요가 존재하지 않을 때, 좋아요 생성
    await this.likesRepository.createReply(params, userId);
    return true;
  };
}
