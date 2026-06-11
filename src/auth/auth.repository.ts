import { PrismaClient, State } from '../../generated/prisma/client';
import { hashPassword } from '../common/utils';
import { OmitTCreateUserDto } from './dto/createUserDto';

export class AuthRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // 중복 이메일 유무 체크
  existEmail = async (email: string): Promise<{ email: string } | null> => {
    return await this.prisma.user.findUnique({
      where: { email: email },
      select: { email: true },
    });
  };

  // 중복 아이디 유무 체크
  existLoginId = async (
    loginId: string,
  ): Promise<{ loginId: string } | null> => {
    return await this.prisma.user.findUnique({
      where: { loginId: loginId },
      select: { loginId: true },
    });
  };

  // 중복 닉네임 유무 체크
  existNickname = async (
    nickname: string,
  ): Promise<{ nickname: string } | null> => {
    return await this.prisma.user.findUnique({
      where: { nickname: nickname },
      select: { nickname: true },
    });
  };

  // 중복 전화번호 유무 체크
  existPhoneNumber = async (
    phoneNumber: string,
  ): Promise<{ phoneNumber: string | null } | null> => {
    return await this.prisma.user.findUnique({
      where: { phoneNumber: phoneNumber },
      select: { phoneNumber: true },
    });
  };

  // 유저 생성
  create = async (dto: OmitTCreateUserDto): Promise<void> => {
    await this.prisma.user.create({
      data: {
        email: dto.email,
        loginId: dto.loginId,
        password: await hashPassword(dto.password),
        name: dto.name,
        nickname: dto.nickname,
        image: dto.image ?? null,
        gender: dto.gender ?? null,
        birthDay: dto.birthDay ?? null,
        phoneNumber: dto.phoneNumber ?? null,
        isPublic: dto.isPublic,
        roles: {
          create: {},
        },
      },
    });
  };

  // 유저 이메일 인증 유무 조회
  verifyEmail = async (email: string): Promise<{ verify: State } | null> => {
    return await this.prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        verify: true,
      },
    });
  };

  // 이메일 로그인
  emailSigIn = async (
    email: string,
  ): Promise<{
    id: string;
    email: string;
    password: string;
    verify: State;
  } | null> => {
    return await this.prisma.user.findFirst({
      where: { email: email },
      select: {
        id: true,
        email: true,
        password: true,
        verify: true,
      },
    });
  };

  // 아이디 로그인
  loginIdSigIn = async (
    loginId: string,
  ): Promise<{
    id: string;
    loginId: string;
    password: string;
    verify: State;
  } | null> => {
    return await this.prisma.user.findFirst({
      where: {
        loginId: loginId,
      },
      select: {
        id: true,
        loginId: true,
        password: true,
        verify: true,
      },
    });
  };

  // 이메일 유저 페이로드 검증
  verifyEmailPayload = async (
    id: string,
    email: string,
  ): Promise<{ id: string; email: string } | null> => {
    return await this.prisma.user.findFirst({
      where: {
        id: id,
        email: email,
      },
      select: {
        id: true,
        email: true,
      },
    });
  };

  // loginId 유저 페이로드 검증
  verifyLoginIdPayload = async (
    id: string,
    loginId: string,
  ): Promise<{ id: string; loginId: string } | null> => {
    return await this.prisma.user.findFirst({
      where: {
        id: id,
        email: loginId,
      },
      select: {
        id: true,
        loginId: true,
      },
    });
  };

  // 이메일 인증 완료 여부 업데이트
  updateVerify = async (email: string): Promise<void> => {
    await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        verify: State.TRUE,
      },
    });
  };

  // 패스워드 변경
  updatePassword = async (
    email: string,
    newPassword: string,
  ): Promise<void> => {
    await this.prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: await hashPassword(newPassword),
      },
    });
  };
}
