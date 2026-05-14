import { PrismaClient } from '../../generated/prisma/client';
import { ICreatePostDto } from './dto/createPostDto';

export class PostsRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 게시글 생성
  create = async (userId: string, dto: ICreatePostDto) => {
    await this.prisma.post.create({
      data: {
        title: dto.title,
        context: dto.context,
        image: dto.image,
        isPublic: dto.isPublic,
        category: dto.category,
        userId: userId,
      },
    });
  };

  // 게시글 전체 조회
  find = async () => {
    return await this.prisma.post.findMany();
  };
}
