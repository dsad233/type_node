import { BadRequest } from "http-errors";
import { Gender } from "../../../generated/prisma/enums";
import { regEx } from "../../common/utils";

export async function CreateUserDto(
  body: ICreateUserDto,
): Promise<ICreateUserDto> {
  const {
    email,
    loginId,
    password,
    name,
    nickname,
    image,
    gender,
    birthDay,
    phoneNumber,
  } = body;
  // 입력 유무 검증
  if (!email) {
    throw new BadRequest("이메일을 입력해 주세요.");
  }

  if (!loginId) {
    throw new BadRequest("ID를 입력해 주세요.");
  }

  if (!password) {
    throw new BadRequest("패스워드를 입력해 주세요.");
  }

  if (!name) {
    throw new BadRequest("이름을 입력해 주세요.");
  }

  if (!nickname) {
    throw new BadRequest("닉네임을 입력해 주세요.");
  }

  // 데이터 저장 길이 검증
  if (!email.trim().match(regEx.email) || email.trim().length > 254) {
    throw new BadRequest(
      "이메일 형식이 올바르지 않습니다. 다시 입력해 주세요.",
    );
  }

  if (loginId.trim().length < 1 && loginId.trim().length > 13) {
    throw new BadRequest("ID는 2자 이상 13자 이하로 입력해 주세요.");
  }

  if (name.trim().length < 1 && name.trim().length > 50) {
    throw new BadRequest("이름은 2자 이상 50자 이하로 입력해 주세요.");
  }

  if (!password.trim().match(regEx.password)) {
    throw new BadRequest(
      "패스워드는 대문자, 기호, 소문자, 숫자 등을 최소 2자 이상 입력해 주세요.",
    );
  }

  if (nickname.trim().length < 1 && nickname.trim().length > 32) {
    throw new BadRequest("닉네임은 2자 이상 32자 이하로 입력해 주세요.");
  }

  if (!gender.trim().includes(Gender.MALE || Gender.FEMALE)) {
    throw new BadRequest("성별은 남자, 여자를 입력해 주세요.");
  }

  if (birthDay && String(birthDay).trim().match(regEx.date)) {
    throw new BadRequest(
      "생년월일 형식이 올바르지 않습니다. 다시 입력해 주세요.",
    );
  }

  if (
    !phoneNumber?.trim().match(regEx.phoneNumber) ||
    (phoneNumber?.length && phoneNumber.trim().length > 15)
  ) {
    throw new BadRequest(
      "전화번호 형식이 올바르지 않습니다. 15자 이하로 입력해 주세요.",
    );
  }

  return {
    email: email.trim(),
    loginId: loginId.trim(),
    password: password.trim(),
    name: name.trim(),
    nickname: nickname.trim(),
    image: image ? image.trim() : null,
    gender: gender ?? Gender.MALE,
    birthDay: birthDay ? new Date(birthDay) : null,
    phoneNumber: phoneNumber ? phoneNumber.trim() : null,
  };
}

export type ICreateUserDto = {
  email: string;
  loginId: string;
  password: string;
  name: string;
  nickname: string;
  image: string | null;
  gender: Gender;
  birthDay: Date | null;
  phoneNumber: string | null;
};
