import { PostsRepository } from "./posts.repository";

export class PostsService {
  private readonly postsRepository: PostsRepository;
  constructor(postsRepository: PostsRepository) {
    this.postsRepository = postsRepository;
  }

  // 게시물 전체 조회
  find = async () => {
    return await this.postsRepository.find();
  };
}
