import { PrismaClient } from '../../generated/prisma/client';
import {
  TCreateCommentDto,
  TRequestReplyCommentCreateDto,
  TRequestReplyCommentUpdateDto,
  TRequestCommentUpdateDto,
  TUpdateCommentDto,
} from './dto';

export class CommentsRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 댓글 생성
  create = async (
    id: string,
    userId: string,
    body: TCreateCommentDto,
  ): Promise<void> => {
    await this.prisma.comment.create({
      data: {
        context: body.context,
        type: body.type,
        postId: id,
        userId: userId,
      },
    });
  };

  // 대댓글 생성
  replyCreate = async (
    params: TRequestReplyCommentCreateDto,
    userId: string,
    body: TCreateCommentDto,
  ): Promise<void> => {
    await this.prisma.comment.create({
      data: {
        postId: params.id,
        userId: userId,
        context: body.context,
        parentId: params.commentId,
      },
    });
  };

  // 게시글 유무 조회
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

  // 게시글 댓글 존재 유무 조회
  findByCommentId = async (
    id: string,
    commentId: string,
  ): Promise<{
    id: string;
  } | null> => {
    return await this.prisma.comment.findFirst({
      where: {
        postId: id,
        id: commentId,
        parentId: null,
        deletedAt: 'FALSE',
      },
      select: {
        id: true,
      },
    });
  };

  // 댓글 소유 유무 확인
  checkUseComment = async (
    params: TRequestCommentUpdateDto,
    userId: string,
  ): Promise<{
    id: string;
  } | null> => {
    return await this.prisma.comment.findFirst({
      where: {
        postId: params.id,
        id: params.commentId,
        userId: userId,
        parentId: null,
        deletedAt: 'FALSE',
      },
      select: {
        id: true,
      },
    });
  };

  // 댓글 소유 유무 확인
  checkUseReplyComment = async (
    params: TRequestReplyCommentUpdateDto,
    userId: string,
  ): Promise<{
    id: string;
  } | null> => {
    return await this.prisma.comment.findFirst({
      where: {
        postId: params.id,
        id: params.commentId,
        parentId: params.replyId,
        userId: userId,
        deletedAt: 'FALSE',
      },
      select: {
        id: true,
      },
    });
  };

  // 댓글 수정
  update = async (
    params: TRequestCommentUpdateDto,
    userId: string,
    body: TUpdateCommentDto,
  ): Promise<void> => {
    await this.prisma.comment.update({
      where: {
        postId: params.id,
        id: params.commentId,
        userId: userId,
        parentId: null,
        deletedAt: 'FALSE',
      },
      data: {
        context: body.context,
      },
    });
  };

  // 대댓글 수정
  replyUpdate = async (
    params: TRequestReplyCommentUpdateDto,
    userId: string,
    body: any,
  ): Promise<void> => {
    await this.prisma.comment.update({
      where: {
        postId: params.id,
        id: params.commentId,
        parentId: params.replyId,
        userId: userId,
        deletedAt: 'FALSE',
      },
      data: {
        context: body.context,
      },
    });
  };

  // 댓글 삭제
  remove = async (
    params: TRequestCommentUpdateDto,
    userId: string,
  ): Promise<void> => {
    await this.prisma.comment.update({
      where: {
        postId: params.id,
        id: params.commentId,
        userId: userId,
        parentId: null,
        deletedAt: 'FALSE',
      },
      data: {
        deletedAt: 'TRUE',
      },
    });
  };

  // 대댓글 삭제
  replyRemove = async (
    params: TRequestReplyCommentUpdateDto,
    userId: string,
  ): Promise<void> => {
    await this.prisma.comment.update({
      where: {
        postId: params.id,
        id: params.commentId,
        parentId: params.replyId,
        userId: userId,
        deletedAt: 'FALSE',
      },
      data: {
        deletedAt: 'TRUE',
      },
    });
  };
}
