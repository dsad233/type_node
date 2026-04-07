import { PrismaClient } from "../../generated/prisma/client";
import { hashPassword } from "../common/utils";
import { ICreateUserDto } from "./dto/createUserDto";

export class AuthRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 중복 이메일 유무 체크
  existEmail = async (email: string): Promise<Object | null> => {
    return await this.prisma.user.findUnique({
      where: { email: email },
      select: { email: true },
    });
  };

  // 중복 아이디 유무 체크
  existUserId = async (loginId: string): Promise<Object | null> => {
    return await this.prisma.user.findUnique({
      where: { loginId: loginId },
      select: { loginId: true },
    });
  };

  // 중복 닉네임 유무 체크
  existNickname = async (nickname: string): Promise<Object | null> => {
    return await this.prisma.user.findUnique({
      where: { nickname: nickname },
      select: { nickname: true },
    });
  };

  // 중복 전화번호 유무 체크
  existPhoneNumber = async (phoneNumber: string): Promise<Object | null> => {
    return await this.prisma.user.findUnique({
      where: { phoneNumber: phoneNumber },
      select: { phoneNumber: true },
    });
  };

  // 유저 생성
  create = async (dto: ICreateUserDto): Promise<void> => {
    await this.prisma.user.create({
      data: {
        email: dto.email,
        loginId: dto.loginId,
        password: await hashPassword(dto.password),
        name: dto.name,
        nickname: dto.nickname,
        image: dto.image,
        gender: dto.gender,
        birthDay: dto.birthDay ?? null,
        phoneNumber: dto.phoneNumber ?? null,
      },
    });
  };

  // 이메일 로그인
  emailSigIn = async (email: string): Promise<{ password: string } | null> => {
    return await this.prisma.user.findFirst({
      where: { email: email },
      select: {
        password: true,
      },
    });
  };

  // 아이디 로그인
  loginIdSigIn = async (
    loginId: string,
  ): Promise<{ password: string } | null> => {
    return await this.prisma.user.findFirst({
      where: {
        loginId: loginId,
      },
      select: {
        password: true,
      },
    });
  };
}
