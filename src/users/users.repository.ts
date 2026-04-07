import { PrismaClient } from "../../generated/prisma/client";

export class UsersRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 유저 전체 조회
  find = async (): Promise<Array<Object>> => {
    return await this.prisma.user.findMany();
  };

  // 유저 상세 조회
  findOne = async (id: string): Promise<Object | null> => {
    return await this.prisma.user.findFirst({
      where: { id: id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  };
}
