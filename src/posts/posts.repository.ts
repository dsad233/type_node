import { Category, PrismaClient, State } from '../../generated/prisma/client';
import { TPaginationDto } from '../common/dto/paginationDto';
import { dateFormat } from '../common/utils';
import { TCreatePostDto, TRequestPostDto } from './dto';

export class PostsRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 게시글 생성
  create = async (userId: string, dto: TCreatePostDto): Promise<void> => {
    await this.prisma.post.create({
      data: {
        title: dto.title,
        context: dto.context ?? null,
        image: dto.image ?? null,
        isPublic: dto.isPublic,
        category: dto.category,
        userId: userId,
      },
    });
  };

  // 카테고리 목록 조회
  findCategory = async (): Promise<Array<string>> => {
    const categories: Array<string> = ['ALL'];

    for (let prop in Category) {
      categories.push(prop as Category);
    }

    return categories;
  };

  // 게시글 수 조회
  countPosts = async (): Promise<number> => {
    return await this.prisma.post.count({
      where: {
        deletedAt: 'FALSE',
      },
    });
  };

  // 카테고리별 게시글 수 조회
  countByCategoryPost = async () => {
    return await this.prisma.post.groupBy({
      where: {
        deletedAt: 'FALSE',
      },
      by: ['category'],
      _count: {
        _all: true,
      },
    });
  };

  // 게시글 전체 조회
  find = async (
    paginations: TPaginationDto,
    query: TRequestPostDto,
  ): Promise<
    {
      id: string;
      title: string;
      context: string | null;
      category: string;
      createdAt: string;
      users: { nickname: string; image: string | null };
    }[]
  > => {
    let where: any = { isPublic: 'TRUE', deletedAt: 'FALSE' };

    if (query.category) {
      where['category'] = query.category as Category;
    } else if (query.isPublic === 'PUBLIC') {
      where['isPublic'] = 'TRUE' as State;
    }

    let orderBy: any = {};

    if (query.orderby === 'NEW') {
      orderBy['createdAt'] = 'asc';
    } else if (query.orderby === 'COMMENTS') {
      // orderBy['createdAt'] = 'asc';
    } else if (query.orderby === 'VIEWS') {
      // orderBy['createdAt'] = 'asc';
    }

    return (
      await this.prisma.post.findMany({
        where,
        select: {
          id: true,
          title: true,
          context: true,
          category: true,
          createdAt: true,
          users: {
            select: {
              nickname: true,
              image: true,
            },
          },
        },
        orderBy,
        skip: (Number(paginations.page) - 1) * Number(paginations.pages),
        take: Number(paginations.pages),
      })
    ).map((post) => {
      return {
        id: post?.id,
        title: post?.title,
        context: post?.context,
        category: post?.category,
        createdAt: dateFormat(
          post?.createdAt.getFullYear(),
          post?.createdAt.getMonth(),
          post?.createdAt.getDate(),
        ),
        users: {
          nickname: post?.users.nickname,
          image: post?.users.image,
        },
      };
    });
  };

  // 게시글 상세 조회
  findOne = async (
    id: string,
  ): Promise<{
    id: string;
    title: string;
    context: string | null;
    category: Category;
    isPublic: State;
    createdAt: Date;
    users: { nickname: string; image: string | null };
  } | null> => {
    return await this.prisma.post.findFirst({
      where: { id: id, isPublic: 'TRUE', deletedAt: 'FALSE' },
      select: {
        id: true,
        title: true,
        context: true,
        category: true,
        isPublic: true,
        createdAt: true,
        users: {
          select: {
            nickname: true,
            image: true,
          },
        },
        //댓글 내용
      },
    });
  };
}
