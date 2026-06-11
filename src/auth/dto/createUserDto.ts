import { BadRequest } from 'http-errors';
import { Gender, State } from '../../../generated/prisma/enums';
import { regEx } from '../../common/utils';

type TCreateUserDto = {
  email: string;
  loginId: string;
  password: string;
  confirmPassword: string;
  name: string;
  nickname: string;
  image?: string | undefined;
  gender?: Gender | undefined;
  birthDay?: Date | undefined;
  phoneNumber?: string | undefined;
  isPublic: State;
};

export type OmitTCreateUserDto = Omit<TCreateUserDto, 'confirmPassword'>;

export async function CreateUserDto(
  body: TCreateUserDto,
): Promise<OmitTCreateUserDto> {
  const {
    email,
    loginId,
    password,
    confirmPassword,
    name,
    nickname,
    image,
    gender,
    birthDay,
    phoneNumber,
    isPublic,
  } = body;
  // 입력 유무 검증
  if (!email) {
    throw new BadRequest('이메일을 입력해 주세요.');
  }

  if (!loginId) {
    throw new BadRequest('ID를 입력해 주세요.');
  }

  if (!password) {
    throw new BadRequest('패스워드를 입력해 주세요.');
  }

  if (!confirmPassword) {
    throw new BadRequest('패스워드 확인란을 입력해 주세요.');
  }

  if (!name) {
    throw new BadRequest('이름을 입력해 주세요.');
  }

  if (!nickname) {
    throw new BadRequest('닉네임을 입력해 주세요.');
  }

  if (isPublic) {
    if (!Object.values(State).includes(isPublic)) {
      throw new BadRequest(
        '공개, 비공개 여부가 올바르지 않은 값 입니다. 다시 입력해 주세요.',
      );
    }
  }

  // 데이터 저장 길이 검증
  if (!email.trim().match(regEx.email) || email.trim().length > 254) {
    throw new BadRequest(
      '이메일 형식이 올바르지 않습니다. 다시 입력해 주세요.',
    );
  }

  if (loginId.trim().length < 1 || loginId.trim().length > 13) {
    throw new BadRequest('ID는 2자 이상 13자 이하로 입력해 주세요.');
  }

  if (name.trim().length < 1 || name.trim().length > 50) {
    throw new BadRequest('이름은 2자 이상 50자 이하로 입력해 주세요.');
  }

  if (!password.trim().match(regEx.password)) {
    throw new BadRequest(
      '패스워드는 대문자, 기호, 소문자, 숫자 등을 최소 8자 이상 입력해 주세요.',
    );
  }

  if (!confirmPassword.trim().match(regEx.password)) {
    throw new BadRequest(
      '패스워드 확인란은 대문자, 기호, 소문자, 숫자 등을 최소 8자 이상 입력해 주세요.',
    );
  }

  if (password.trim() !== confirmPassword.trim()) {
    throw new BadRequest(
      '패스워드와 패스워드 확인란이 일치하지 않습니다. 다시 입력해 주세요.',
    );
  }

  if (nickname.trim().length < 1 || nickname.trim().length > 32) {
    throw new BadRequest('닉네임은 2자 이상 32자 이하로 입력해 주세요.');
  }

  if (gender && ![Gender.MALE, Gender.FEMALE].includes(gender as Gender)) {
    throw new BadRequest('성별은 남자, 여자를 입력해 주세요.');
  }

  if (birthDay && !String(birthDay).trim().match(regEx.date)) {
    throw new BadRequest(
      '생년월일 형식이 올바르지 않습니다. 다시 입력해 주세요.',
    );
  }

  if (
    !phoneNumber?.trim().match(regEx.phoneNumber) &&
    phoneNumber?.length &&
    phoneNumber.trim().length > 15
  ) {
    throw new BadRequest(
      '전화번호 형식이 올바르지 않습니다. 15자 이하로 입력해 주세요.',
    );
  }

  return {
    email: email.trim(),
    loginId: loginId.trim(),
    password: password.trim(),
    name: name.trim(),
    nickname: nickname.trim(),
    image: image?.trim(),
    gender: gender,
    birthDay: birthDay ? new Date(birthDay) : undefined,
    phoneNumber: phoneNumber?.trim(),
    isPublic: isPublic,
  };
}
