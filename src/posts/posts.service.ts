import { NotFound } from 'http-errors';
import { TCreatePostDto } from './dto/createPostDto';
import { PostsRepository } from './posts.repository';
import { TPaginationDto } from '../common/dto/paginationDto';
import { TRequestPostDto } from './dto/requestPostDto';
import { Category, State } from '../../generated/prisma/enums';
import { TUpdatePostDto } from './dto/updatePostDto';
import { dateFormat, timeFormat } from '../common/utils';

export class PostsService {
  private readonly postsRepository: PostsRepository;
  constructor(postsRepository: PostsRepository) {
    this.postsRepository = postsRepository;
  }

  // 게시글 생성
  create = async (userId: string, dto: TCreatePostDto): Promise<void> => {
    await this.postsRepository.create(userId, dto);
  };

  // 카테고리 목록 조회
  findCategory = async () => {
    return await this.postsRepository.findCategory();
  };

  // 게시글 수 조회
  countPosts = async (): Promise<number> => {
    return await this.postsRepository.countPosts();
  };

  // 카테고리별 게시글 수 조회
  countByCategoryPost = async (): Promise<
    {
      key: string;
      name: string;
      count: number;
    }[]
  > => {
    const categoryMap: Record<string, string> = {
      FREE: '자유',
      SPORTS: '스포츠',
      GAME: '게임',
    };

    const result = [];

    const counts = await this.postsRepository.countByCategoryPost();

    if (counts.length) {
      for (let i = 0; i < counts.length; i++) {
        for (let [key, value] of Object.entries(categoryMap)) {
          if (counts[i]?.category === key) {
            result.push({
              key: key,
              name: value,
              count: counts[i]?._count?._all ?? 0,
            });
          }
        }
      }
    }

    return result;
  };

  // 게시글 전체 조회
  find = async (
    paginations: TPaginationDto,
    query: TRequestPostDto,
  ): Promise<{
    posts: {
      id: string;
      title: string;
      context: string | null;
      category: string;
      createdAt: string;
      users: { nickname: string; image: string | null };
      comments: number;
    }[];
    paginations: {
      page: string;
      pages: string;
    };
  }> => {
    return {
      posts: await this.postsRepository.find(paginations, query),
      paginations: {
        page: paginations.page,
        pages: paginations.pages,
      },
    };
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
    createdAt: string;
    users: { nickname: string; image: string | null };
    comments: {
      id: string;
      context: string;
      createdAt: string;
      author: { nickname: string; image: string | null };
    }[];
  }> => {
    const post = await this.postsRepository.findOne(id);

    if (!post) {
      throw new NotFound('게시글을 찾을 수 없습니다.');
    }

    return {
      id: post.id,
      title: post.title,
      context: post.context,
      category: post.category,
      isPublic: post.isPublic,
      createdAt:
        dateFormat(
          post.createdAt.getFullYear(),
          post.createdAt.getMonth(),
          post.createdAt.getDate(),
        ) +
        ' ' +
        timeFormat(post.createdAt.getHours(), post.createdAt.getMinutes()),
      users: {
        nickname: post.users.nickname,
        image: post.users.image,
      },
      comments: post.comments.map((comment) => {
        return {
          id: comment?.id,
          context: comment?.context,
          createdAt: dateFormat(
            comment?.createdAt.getFullYear(),
            comment?.createdAt.getMonth(),
            comment?.createdAt.getDate(),
          ),
          author: {
            nickname: comment?.users?.nickname,
            image: comment?.users?.image,
          },
        };
      }),
    };
  };

  // 게시글 수정
  update = async (
    id: string,
    userId: string,
    body: TUpdatePostDto,
  ): Promise<void> => {
    const post = await this.postsRepository.findByPostId(id);

    if (!post || post.userId !== userId) {
      throw new NotFound('게시글을 찾을 수 없습니다.');
    }

    await this.postsRepository.update(userId, id, body);
  };

  // 게시글 삭제 (소프트 삭제)
  remove = async (id: string, userId: string): Promise<void> => {
    await this.postsRepository.remove(id, userId);
  };
}
