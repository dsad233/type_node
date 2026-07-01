import { NotFound, BadRequest } from 'http-errors';
import { regEx } from '../../common/utils';

export type TRequestPostLikeDto = {
  id: string;
};

export async function RequestPostLikeDto({
  id,
}: TRequestPostLikeDto): Promise<TRequestPostLikeDto> {
  if (!id) {
    throw new NotFound('게시글 ID가 존재하지 않습니다. 다시 시도 해주세요.');
  }

  if (!id.trim().match(regEx.uuidv4)) {
    throw new BadRequest('유효하지 않은 게시글 ID 형식입니다.');
  }

  return {
    id: id.trim(),
  };
}
