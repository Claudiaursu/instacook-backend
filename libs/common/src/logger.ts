import { HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestContext } from 'nestjs-request-context';

import winston = require('winston');
//require('winston-postgres');

const transports = [new winston.transports.Console()];

// if (process.env['NODE_ENV'] !== 'local') {
//   if (process.env['POSTGRES_LOGS']) {
//     try {
//       const postgresTransport = new winston.transports.Postgres({
//         db: process.env.MONGO_LOGS,
//         collection: process.env.MONGO_LOGS_COLLECTION,
//         options: {
//           useUnifiedTopology: true,
//           retryWrites: false,
//         },
//       });

//       transports.push(mongoTransport);
//     } catch (e) {
//       console.warn(e);
//     }
//   }
// }
const _logger = winston.createLogger({
  defaultMeta: { metadata: null },
  transports,
});

const jwt = new JwtService({});

export class WinstonLogger implements LoggerService {
  getUserEmail() {
    try {
      const req = RequestContext?.currentContext?.req;
      const token = req?.headers?.authorization?.replace('Bearer ', '');
      if (token) {
        const decodedToken = jwt.decode(token);
        return decodedToken;
      }
    } catch (error) {
      return '';
    }
    return '';
  }

  log(errorId: string, message: string, rest?: any) {
    const user = this.getUserEmail();
    _logger.info(message + ' ' + errorId, { metadata: { ...rest, errorId, user } });
  }

  info(errorId: string, message: string, rest?: any) {
    const user = this.getUserEmail();
    _logger.info(message + ' ' + errorId, { metadata: { ...rest, errorId, user } });
  }

  error(errorId: string, errorMessage: string, errorObject = {}) {
    const user = this.getUserEmail();
    _logger.error(errorMessage + ' ' + errorId, { metadata: { ...errorObject, errorId, user } });
  }

  warn(errorId: string, message: string, rest?: any) {
    const user = this.getUserEmail();
    _logger.warn(message + ' ' + errorId, { metadata: { ...rest, errorId, user } });
  }

  debug(errorId: string, message: string, rest?: any) {
    const user = this.getUserEmail();
    _logger.debug(message + ' ' + errorId, { metadata: { ...rest, errorId, user } });
  }

  verbose(errorId: string, message: string, rest?: any) {
    const user = this.getUserEmail();
    _logger.verbose(message + ' ' + errorId, { metadata: { ...rest, errorId, user } });
  }

  throw(errorId: string, errorMessage: string, errorObject = {}) {
    const user = this.getUserEmail();
    _logger.error(errorMessage + ' ' + errorId, { metadata: { ...errorObject, errorId, user } });
    throw new HttpException(errorMessage + ' ' + errorId, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
const logger = new WinstonLogger();

export { logger };
