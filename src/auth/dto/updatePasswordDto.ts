import { BadRequest } from 'http-errors';
import { regEx } from '../../common/utils';

export type IUpdatePassowrdDto = {
  oldPassword: string;
  newPassowrd: string;
  newConfirmPassword: string;
};

export async function UpdatePassowrdDto(
  body: IUpdatePassowrdDto,
): Promise<IUpdatePassowrdDto> {
  const { oldPassword, newPassowrd, newConfirmPassword } = body;

  if (!oldPassword) {
    throw new BadRequest('이전 패스워드를 입력해 주세요.');
  }

  if (!newPassowrd) {
    throw new BadRequest('변경 예정인 패스워드를 입력해 주세요.');
  }

  if (!newConfirmPassword) {
    throw new BadRequest('변경 예정인 패스워드를 한번 더 입력해 주세요.');
  }

  if (
    !oldPassword.trim().match(regEx.password) ||
    !newPassowrd.trim().match(regEx.password) ||
    !newConfirmPassword.trim().match(regEx.password)
  ) {
    throw new BadRequest(
      '패스워드는 대문자, 기호, 소문자, 숫자 등을 최소 8자 이상 입력해 주세요.',
    );
  }

  if (newPassowrd.trim() !== newConfirmPassword.trim()) {
    throw new BadRequest(
      '새로운 패스워드와 확인 패스워드가 일치하지 않습니다. 다시 입력해 주세요.',
    );
  }

  return {
    oldPassword: oldPassword.trim(),
    newPassowrd: newPassowrd.trim(),
    newConfirmPassword: newConfirmPassword.trim(),
  };
}
