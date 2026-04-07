import { AuthService } from "./auth.service";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateUserDto, ICreateUserDto } from "./dto/createUserDto";
import { SignInDto } from "./dto/signInDto";

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
  ): Promise<Response<Object>> => {
    const dto = await CreateUserDto(req.body);

    await this.authService.signUp(dto);

    return res.status(StatusCodes.CREATED).json({ message: "회원 가입 완료." });
  };

  signIn = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<Object>> => {
    const dto = await SignInDto(req.body);

    const tokens = await this.authService.signIn(dto);

    return res.status(StatusCodes.OK).json({
      message: "로그인 완료.",
      data: tokens,
    });
  };
}
