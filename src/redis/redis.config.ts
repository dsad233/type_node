import { Redis } from "ioredis";
import {
  REDIS_DB,
  REDIS_HOST,
  REDIS_PASS,
  REDIS_PORT,
} from "../common/configs/keys";

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASS,
  db: REDIS_DB,
});

// Redis 상태 체크
export function redisCondition() {
  redis.on("connect", () => {
    console.log("Redis 연결 완료.");
  });

  redis.on("error", (error) => {
    console.error("Redis 연결 에러 발생: ", error);
  });

  redis.on("close", () => {
    console.log("Redis 연결 종료.");
  });
}
