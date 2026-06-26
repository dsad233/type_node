import { BadRequest } from 'http-errors';

export type TUpdateCommentDto = {
  context: string;
};

export async function UpdateCommentDto({
  context,
}: TUpdateCommentDto): Promise<TUpdateCommentDto> {
  if (!context) {
    throw new BadRequest('댓글 내용란을 입력해 주세요.');
  }

  return {
    context: context.trim(),
  };
}
