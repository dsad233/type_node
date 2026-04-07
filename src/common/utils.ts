import bcrypt from "bcrypt";
import { BCYPT_PASSWORD_SALT } from "./configs/keys";

/**
 * 패스워드 관련
 */

// 패스워드 해쉬화
export const hashPassword = async (password: string) => {
  const hashPassword = await bcrypt.hash(password, BCYPT_PASSWORD_SALT);
  return hashPassword;
};

// 패스워드 복호화
export const comparePassword = async (
  bodyPassword: string,
  hashPassword: string,
) => {
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
  date: /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/g,
  phoneNumber:
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
};
