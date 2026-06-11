import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UsersService } from './users.service';
import { RequestUserDto, IRequestUserDto } from './dto';

export class UsersController {
  private usersService: UsersService;
  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  // 유저 전체 조회
  find = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string }>> => {
    const users = await this.usersService.find();
    return res
      .status(StatusCodes.OK)
      .json({ message: '조회 완료', data: users });
  };

  // 유저 상세 조회
  findOne = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string; data: string }>> => {
    const user = await this.usersService.findOne(
      (await RequestUserDto(req.user as IRequestUserDto)).id,
    );
    return res
      .status(StatusCodes.OK)
      .json({ message: '조회 완료', data: user });
  };
}
