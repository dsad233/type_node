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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');

  return (
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  );
}
