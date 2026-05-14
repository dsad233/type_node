import { NextFunction, Request, Response } from 'express';
import { PostsService } from './posts.service';
import { StatusCodes } from 'http-status-codes';
import { CreatePostDto } from './dto/createPostDto';

export class PostsController {
  private readonly postsService: PostsService;
  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  // 게시글 생성
  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<{ message: string }>> => {
    const dto = await CreatePostDto(req.body);

    await this.postsService.create(req.user.id, dto);

    return res
      .status(StatusCodes.CREATED)
      .json({ message: '게시글 생성 완료.' });
  };

  // 게시글 전체 조회
  find = async (req: Request, res: Response) => {
    const posts = await this.postsService.find();

    return res
      .status(StatusCodes.OK)
      .json({ message: '게시물 조회 완료', data: posts });
  };
}
