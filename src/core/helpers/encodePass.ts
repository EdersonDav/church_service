import bcrypt from 'bcrypt'
import { env } from '../../config';

export const encodePass = (pass: string): string => {
    const hash = bcrypt.hashSync(pass, env.bcrypt.saltRounds);
    return hash
}