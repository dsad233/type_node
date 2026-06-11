import morgan from 'morgan';
import { stream } from '../configs/winston';
import { NODE_ENV } from '../configs/keys';

export function MorganMiddleware() {
  return NODE_ENV === 'prod' ? morgan('combined', { stream }) : morgan('dev');
}
