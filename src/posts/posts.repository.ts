import { PrismaClient } from "../../generated/prisma/client";

export class PostsRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 게시물 전체 조회
  find = async () => {
    return await this.prisma.post.findMany();
  };
}
