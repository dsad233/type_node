import { BadRequest } from 'http-errors';
import { regEx } from '../../common/utils';

export type TUpdatePasswordRequestDto = {
  email: string;
  token: string;
};

export async function UpdatePasswordRequestDto(
  query: TUpdatePasswordRequestDto,
) {
  const { email, token } = query;

  if (!email) {
    throw new BadRequest('이메일 데이터가 누락되었습니다. 다시 요청해 주세요.');
  }

  if (!token) {
    throw new BadRequest('토큰 데이터가 누락되었습니다. 다시 요청해 주세요.');
  }

  if (!email.trim().match(regEx.email)) {
    throw new BadRequest(
      '이메일 형식이 올바르지 않습니다. 다시 입력해 주세요.',
    );
  }

  return {
    email: email.trim(),
    token: token.trim(),
  };
}
