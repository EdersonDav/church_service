import { randomBytes } from 'crypto';

export const genToken = () => randomBytes(32).toString('hex');