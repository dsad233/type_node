import { Request, Response } from "express";
import { PostsService } from "./posts.service";
import { StatusCodes } from "http-status-codes";

export class PostsController {
  private readonly postsService: PostsService;
  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  // 게시물 전체 조회
  find = async (req: Request, res: Response) => {
    const posts = await this.postsService.find();

    return res
      .status(StatusCodes.OK)
      .json({ message: "게시물 조회 완료", data: posts });
  };
}
