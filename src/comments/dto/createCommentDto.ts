import { BadRequest } from 'http-errors';
import { Type } from '../../../generated/prisma/enums';

export type TCreateCommentDto = {
  context: string;
  type: Type;
};

export async function CreateCommentDto({
  context,
  type,
}: TCreateCommentDto): Promise<TCreateCommentDto> {
  if (!context) {
    throw new BadRequest('댓글 내용란을 입력해 주세요.');
  }

  if (!Object.values(Type).includes(type)) {
    throw new BadRequest('일치하지 않는 타입입니다. 다시 시도해주세요.');
  }

  return {
    context: context.trim(),
    type: type,
  };
}
