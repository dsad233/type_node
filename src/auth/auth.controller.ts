import { AuthService } from './auth.service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  CertifiEmailDto,
  CreateUserDto,
  TUpdatePasswordRequestDto,
  SignInDto,
  UpdatePassowrdDto,
  UpdatePasswordRequestDto,
} from './dto';

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  // 유저 생성
  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.signUp(await CreateUserDto(req.body));

    return res.status(StatusCodes.CREATED).json({ message: '회원 가입 완료.' });
  };

  // 유저 이메일 인증 여부 업데이트
  verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.verifyEmail(
      (await CertifiEmailDto(req.query.email as string)).email,
    );

    return res.status(StatusCodes.OK).json({ message: '이메일 인증 완료.' });
  };

  // 로그인
  signIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<
    Response<{
      message: string;
      data: { access_token: string; refresh_token: string };
    }>
  > => {
    const tokens = await this.authService.signIn(await SignInDto(req.body));

    return res.status(StatusCodes.OK).json({
      message: '로그인 완료.',
      data: tokens,
    });
  };

  // 로그아웃
  signOut = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.signOut(req.user.id);
    return res.status(StatusCodes.OK).json({ message: '로그아웃 완료.' });
  };

  // 토큰 재발급
  reissue = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    const { refreshToken } = req.body;

    const tokens = await this.authService.reissue(refreshToken);

    return res
      .status(StatusCodes.OK)
      .json({ message: '토큰 재발급 완료.', data: tokens });
  };

  // 패스워드 변경
  updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.updatePassword(
      await UpdatePasswordRequestDto(req.query as TUpdatePasswordRequestDto),
      (await UpdatePassowrdDto(req.body)).newPassowrd,
    );

    return res.status(StatusCodes.OK).json({ message: '비밀번호 변경 완료.' });
  };

  // 패스워드 변경 이메일 인증
  certifiEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    await this.authService.certifiEmail(
      (await CertifiEmailDto(req.body.email)).email,
    );

    return res.status(StatusCodes.OK).json({ message: '이메일 전송 완료.' });
  };

  // 패스워드 변경 이메일 인증 완료
  authenticationEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    const token = await this.authService.authenticationEmail(
      (await CertifiEmailDto(req.body.email)).email,
      req.body.code,
    );

    return res
      .status(StatusCodes.OK)
      .json({ message: '이메일 인증 완료.', token: token });
  };
}
