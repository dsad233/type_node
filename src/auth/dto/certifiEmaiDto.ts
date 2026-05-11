import { BadRequest } from 'http-errors';
import { regEx } from '../../common/utils';

export async function CertifiEmailDto(
  email: string,
): Promise<{ email: string }> {
  // 입력 유무 검증
  if (!email) {
    throw new BadRequest('이메일을 입력해 주세요.');
  }

  // 데이터 저장 길이 검증
  if (!email.trim().match(regEx.email) || email.trim().length > 254) {
    throw new BadRequest(
      '이메일 형식이 올바르지 않습니다. 다시 입력해 주세요.',
    );
  }

  return {
    email: email.trim(),
  };
}
