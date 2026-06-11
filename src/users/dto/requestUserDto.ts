import { BadRequest, NotFound } from 'http-errors';
import { regEx } from '../../common/utils';

export type IRequestUserDto = {
  id: string;
};

export async function RequestUserDto(
  reqUser: IRequestUserDto,
): Promise<IRequestUserDto> {
  if (!reqUser?.id) {
    throw new NotFound('파라미터가 존재하지 않습니다. 다시 요청해 주세요.');
  }

  if (!reqUser.id.trim().match(regEx.uuidv4)) {
    throw new BadRequest('유효하지 않은 ID 형식입니다.');
  }

  return {
    id: reqUser.id.trim(),
  };
}
