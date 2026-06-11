import { BadRequest } from 'http-errors';
import { UsersRepository } from './users.repository';
import { State } from '../../generated/prisma/enums';
import { dateFormat } from '../common/utils';
export class UsersService {
  private readonly usersRepository: UsersRepository;
  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  // 유저 전체 조회
  find = async (): Promise<Array<Object>> => {
    return await this.usersRepository.find();
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
    createdAt: string;
    roles: Array<{ authority: string }>;
    posts: Array<{
      id: string;
      title: string;
      category: string;
      createdAt: string;
    }>;
    count: {
      posts: number;
      comments: number;
    };
  }> => {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new BadRequest('유저 항목이 존재하지 않습니다.');
    }

    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      verify: user.verify,
      isPublic: user.isPublic,
      createdAt: dateFormat(
        user.createdAt.getFullYear(),
        user.createdAt.getMonth(),
        user.createdAt.getDate(),
      ),
      roles: user.roles,
      posts: user.posts.map((post) => {
        return {
          id: post?.id,
          title: post?.title,
          category: post?.category,
          createdAt: dateFormat(
            post?.createdAt.getFullYear(),
            post?.createdAt.getMonth(),
            post?.createdAt.getDate(),
          ),
        };
      }),
      count: user._count,
    };
  };
}
