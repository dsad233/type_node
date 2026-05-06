import { AuthService } from './auth.service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CreateUserDto, ICreateUserDto } from './dto/createUserDto';
import { SignInDto } from './dto/signInDto';
import { UpdatePassowrdDto } from './dto/updatePasswordDto';

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
    const dto = await CreateUserDto(req.body);

    await this.authService.signUp(dto);

    return res.status(StatusCodes.CREATED).json({ message: '회원 가입 완료.' });
  };

  // 로그인
  signIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string; data: string }>> => {
    const dto = await SignInDto(req.body);

    const tokens = await this.authService.signIn(dto);

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
  reisSue = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    const { refreshToken } = req.body;

    const tokens = await this.authService.reisSue(refreshToken);

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
    const dto = await UpdatePassowrdDto(req.body);

    await this.authService.updatePassword(req.user.email, dto);

    return res.status(StatusCodes.OK).json({ message: '비밀번호 변경 완료.' });
  };
}
