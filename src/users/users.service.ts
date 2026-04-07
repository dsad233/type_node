import { UsersRepository } from "./users.repository";

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
  findOne = async (id: string) => {
    return await this.usersRepository.findOne(id);
  };
}
