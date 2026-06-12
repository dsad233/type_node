import { NextFunction, Request, Response } from 'express';
import { PostsService } from './posts.service';
import { StatusCodes } from 'http-status-codes';
import { CreatePostDto } from './dto/createPostDto';
import { TPaginationDto, PaginationDto } from '../common/dto/paginationDto';
import { RequestPostDto } from './dto/requestPostDto';
import { Category, State } from '../../generated/prisma/enums';
import { OrderBy } from '../common/libs/type';

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
    await this.postsService.create(req.user.id, await CreatePostDto(req.body));

    return res
      .status(StatusCodes.CREATED)
      .json({ message: '게시글 생성 완료.' });
  };

  // 카테고리 목록 조회
  findCategory = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: Array<string>;
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '카테고리 조회 완료.',
      data: await this.postsService.findCategory(),
    });
  };

  // 게시글 수 조회
  countPosts = async (
    req: Request,
    res: Response,
  ): Promise<Response<{ message: string; data: number }>> => {
    return res.status(StatusCodes.OK).json({
      message: '게시글 수 조회 완료.',
      count: await this.postsService.countPosts(),
    });
  };

  countByCategoryPost = async (req: Request, res: Response) => {
    return res.status(StatusCodes.OK).json({
      message: '카테고리별 게시글 수 조회 완료.',
      count: await this.postsService.countByCategoryPost(),
    });
  };

  // 게시글 전체 조회
  find = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: {
        posts: {
          id: string;
          title: string;
          context: string | null;
          category: string;
          createdAt: string;
          users: { nickname: string; image: string | null };
        }[];
        paginations: {
          page: string;
          pages: string;
        };
      };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '게시물 조회 완료.',
      data: await this.postsService.find(
        await PaginationDto({
          page: req.query.page as string,
          pages: req.query.pages as string,
        }),
        await RequestPostDto({
          search: req.query.search as string,
          category: req.query.category as string,
          isPublic: req.query.isPublic as string,
          orderby: req.query.orderby as string,
        }),
      ),
    });
  };

  // 게시글 상세 조회
  findOne = async (
    req: Request,
    res: Response,
  ): Promise<
    Response<{
      message: string;
      data: {
        id: string;
        title: string;
        context: string | null;
        category: Category;
        isPublic: State;
        createdAt: Date;
        users: { nickname: string; image: string | null };
      };
    }>
  > => {
    return res.status(StatusCodes.OK).json({
      message: '게시글 상세 조회 완료.',
      data: await this.postsService.findOne(req.params.id as string),
    });
  };
}
