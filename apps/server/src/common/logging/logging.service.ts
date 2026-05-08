import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggingService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const consoleFormat = winston.format.printf(
      ({ level, message, timestamp, context }) => {
        const colors = {
          error: '\x1b[31m',
          warn: '\x1b[33m',
          info: '\x1b[36m',
          debug: '\x1b[35m',
          verbose: '\x1b[90m',
        };

        const reset = '\x1b[0m';
        const color = colors[level] || '';

        const levelLabel = level.toUpperCase().padEnd(7);

        return `${timestamp as string} ${color}${levelLabel}${reset} [${
          (context || 'App') as string
        }] ${
          typeof message === 'object'
            ? JSON.stringify(message, null, 2)
            : (message as string)
        }`;
      },
    );

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'HH:mm:ss',
            }),
            consoleFormat,
          ),
        }),

        new DailyRotateFile({
          dirname: 'logs',
          filename: 'app-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: process.env.LOG_MAX_SIZE || '100k',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    });
  }

  log(message: any, context?: string) {
    this.logger.info(message as string, { context });
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error(message as string, { trace, context });
  }

  warn(message: any, context?: string) {
    this.logger.warn(message as string, { context });
  }

  debug(message: any, context?: string) {
    this.logger.debug(message as string, { context });
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message as string, { context });
  }
}
