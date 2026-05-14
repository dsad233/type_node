import { BadRequest } from 'http-errors';
import { UsersRepository } from './users.repository';
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
  ): Promise<{ id: string; email: string; name: string }> => {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new BadRequest('유저 항목이 존재하지 않습니다.');
    }

    return user;
  };
}
