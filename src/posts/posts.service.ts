import { ICreatePostDto } from './dto/createPostDto';
import { PostsRepository } from './posts.repository';

export class PostsService {
  private readonly postsRepository: PostsRepository;
  constructor(postsRepository: PostsRepository) {
    this.postsRepository = postsRepository;
  }

  // 게시글 생성
  create = async (userId: string, dto: ICreatePostDto) => {
    await this.postsRepository.create(userId, dto);
  };

  // 게시글 전체 조회
  find = async () => {
    return await this.postsRepository.find();
  };
}
