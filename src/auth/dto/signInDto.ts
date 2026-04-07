import { BadRequest } from "http-errors";
import { regEx } from "../../common/utils";

export async function SignInDto(body: ISignInDto): Promise<ISignInDto> {
  const { loginId, password } = body;
  // 입력 유무 검증
  if (!loginId) {
    throw new BadRequest("이메일이나 아이디를 입력해 주세요.");
  }

  if (!password) {
    throw new BadRequest("패스워드를 입력해 주세요.");
  }

  // 데이터 저장 길이 검증
  if (!password.trim().match(regEx.password)) {
    throw new BadRequest(
      "패스워드는 대문자, 기호, 소문자, 숫자 등을 최소 2자 이상 입력해 주세요.",
    );
  }

  return {
    loginId: loginId.trim(),
    password: password,
  };
}

export type ISignInDto = {
  loginId: string;
  password: string;
};
