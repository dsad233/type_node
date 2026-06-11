import fs from 'fs';
import winston from 'winston';
import 'winston-daily-rotate-file';

const logDir = `${process.cwd()}/logs`;

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const infoTransport = new winston.transports.DailyRotateFile({
  filename: 'info.log',
  dirname: logDir,
  level: 'info',
  maxFiles: '15d', // 15일치 저장
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: 'error.log',
  dirname: logDir,
  level: 'error',
  maxFiles: '15d', // 15일치 저장
});

const logger = winston.createLogger({
  transports: [infoTransport, errorTransport],
});

const stream = {
  write: (message: string) => {
    logger.info(`${dateFormat(new Date())} ${message}`);
  },
};

export { logger, stream };

function dateFormat(date: Date): string {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  month = month >= 10 ? month : '0' + month;
  day = day >= 10 ? day : '0' + day;
  hour = hour >= 10 ? hour : '0' + hour;
  minute = minute >= 10 ? minute : '0' + minute;
  second = second >= 10 ? second : '0' + second;

  return (
    date.getFullYear() +
    '-' +
    month +
    '-' +
    day +
    ' ' +
    hour +
    ':' +
    minute +
    ':' +
    second
  );
}
