import { PrismaClient, Type } from '../../generated/prisma/client';
import { TRequestCommentLikeDto, TRequestReplyLikeDto } from './dto';

export class LikesRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 게시글 좋아요 생성
  create = async (id: string, userId: string): Promise<void> => {
    await this.prisma.like.create({
      data: {
        postId: id,
        userId: userId,
      },
    });
  };

  // 댓글 좋아요 생성
  createComment = async (
    params: TRequestCommentLikeDto,
    userId: string,
  ): Promise<void> => {
    await this.prisma.like.create({
      data: {
        postId: params.id,
        commentId: params.commentId,
        userId: userId,
        type: Type.COMMENT,
      },
    });
  };

  // 대댓글 좋아요 생성
  createReply = async (
    params: TRequestReplyLikeDto,
    userId: string,
  ): Promise<void> => {
    await this.prisma.like.create({
      data: {
        postId: params.id,
        commentId: params.commentId,
        replyId: params.replyId,
        userId: userId,
        type: Type.REPLY,
      },
    });
  };

  // 좋아요 ID 조회
  findById = async (
    params: {
      id: string;
      commentId: string;
      replyId: string;
    },
    type: Type,
    userId: string,
  ): Promise<{ id: string } | null> => {
    return await this.prisma.like.findFirst({
      where: {
        postId: params.id,
        commentId: params.commentId ?? undefined,
        replyId: params.replyId ?? undefined,
        type: type,
        userId: userId,
      },
      select: {
        id: true,
      },
    });
  };

  // 게시글 ID 존재 유무 조회
  findByPostId = async (
    id: string,
  ): Promise<{
    id: string;
  } | null> => {
    return await this.prisma.post.findFirst({
      where: {
        id: id,
        deletedAt: 'FALSE',
      },
      select: {
        id: true,
      },
    });
  };

  // 댓글 ID 존재 유무 조회
  findByCommentId = async (
    params: TRequestCommentLikeDto,
  ): Promise<{ id: string } | null> => {
    return await this.prisma.comment.findFirst({
      where: {
        postId: params.id,
        id: params.commentId,
        deletedAt: 'FALSE',
      },
      select: {
        id: true,
      },
    });
  };

  // 대댓글 ID 존재 유무 조회
  findByReplyId = async (
    params: TRequestReplyLikeDto,
  ): Promise<{ id: string } | null> => {
    return await this.prisma.comment.findFirst({
      where: {
        postId: params.id,
        id: params.replyId,
        parentId: params.commentId,
        deletedAt: 'FALSE',
      },
      select: {
        id: true,
      },
    });
  };

  // 게시글 좋아요 삭제
  delete = async (
    id: string,
    likeId: string,
    userId: string,
  ): Promise<void> => {
    await this.prisma.like.delete({
      where: {
        postId: id,
        id: likeId,
        userId: userId,
      },
    });
  };

  // 댓글 좋아요 삭제
  deleteComment = async (
    params: TRequestCommentLikeDto,
    likeId: string,
    userId: string,
  ): Promise<void> => {
    await this.prisma.like.delete({
      where: {
        postId: params.id,
        commentId: params.commentId,
        id: likeId,
        userId: userId,
      },
    });
  };

  // 대댓글 좋아요 삭제
  deleteReply = async (
    params: TRequestReplyLikeDto,
    likeId: string,
    userId: string,
  ): Promise<void> => {
    await this.prisma.like.delete({
      where: {
        postId: params.id,
        commentId: params.commentId,
        replyId: params.replyId,
        id: likeId,
        userId: userId,
      },
    });
  };
}
