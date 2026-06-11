import bcrypt from 'bcrypt';
import { BCYPT_PASSWORD_SALT } from './configs/keys';

/**
 * 패스워드 관련
 */

// 패스워드 해쉬화
export const hashPassword = async (password: string): Promise<string> => {
  const hashPassword = await bcrypt.hash(password, BCYPT_PASSWORD_SALT);
  return hashPassword;
};

// 패스워드 복호화
export const comparePassword = async (
  bodyPassword: string,
  hashPassword: string,
): Promise<boolean> => {
  const compare = await bcrypt.compare(bodyPassword, hashPassword);
  if (!compare) {
    return false;
  }

  return true;
};

// 정규식
export const regEx = {
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
  date: /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
  phoneNumber:
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
  uuidv4:
    /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,
};

// 랜덤 상수 함수
export function randomConst(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

// 날짜 포맷팅 함수
export function dateFormat(year: number, month: number, day: number): string {
  const formatterMonth = month + 1 < 10 ? '0' + (month + 1) : month + 1;
  const formatterDay = day < 10 ? '0' + (day + 1) : day + 1;

  return year + '-' + formatterMonth + '-' + formatterDay;
}

// 시간 포맷팅 함수
export function timeFormat(hour: number, minute: number) {}
