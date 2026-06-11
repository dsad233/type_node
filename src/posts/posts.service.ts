import { NotFound } from 'http-errors';
import { TCreatePostDto } from './dto/createPostDto';
import { PostsRepository } from './posts.repository';
import { TPaginationDto } from '../common/dto/paginationDto';
import { TRequestPostDto } from './dto/requestPostDto';
import { Category, State } from '../../generated/prisma/enums';

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
    createdAt: Date;
    users: { nickname: string; image: string | null };
  }> => {
    const post = await this.postsRepository.findOne(id);

    if (!post) {
      throw new NotFound('게시글을 찾을 수 없습니다.');
    }

    return post;
  };
}
