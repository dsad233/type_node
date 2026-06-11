import {
  Authority,
  Category,
  PrismaClient,
  State,
} from '../../generated/prisma/client';

export class UsersRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 유저 전체 조회
  find = async (): Promise<Array<Object>> => {
    return await this.prisma.user.findMany();
  };

  // 유저 상세 조회
  findOne = async (
    id: string,
  ): Promise<{
    id: string;
    email: string;
    nickname: string;
    verify: State;
    isPublic: State;
    createdAt: Date;
    roles: Array<{ authority: Authority }>;
    posts: Array<{
      id: string;
      title: string;
      category: Category;
      createdAt: Date;
    }>;
    _count: {
      posts: number;
      comments: number;
    };
  } | null> => {
    return await this.prisma.user.findFirst({
      where: { id: id },
      select: {
        id: true,
        email: true,
        nickname: true,
        verify: true,
        isPublic: true,
        createdAt: true,
        roles: {
          select: {
            authority: true,
          },
        },
        posts: {
          select: {
            id: true,
            title: true,
            category: true,
            createdAt: true,
          },
        },
        // 댓글 수
        // 좋아요 받은 수
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });
  };
}
