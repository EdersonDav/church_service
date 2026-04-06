import * as bcrypt from 'bcryptjs'
import { env } from '../../config';

export const hashString = (text: string): string => {
    const hash = bcrypt.hashSync(text, env.bcrypt.saltRounds);
    return hash
}