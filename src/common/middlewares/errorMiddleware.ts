import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { StatusCodes } from "http-status-codes";
export const ErrorMiddleware = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res
    .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({
      error: error.message || "서버 내부 오류가 발생했습니다.",
    });
};
