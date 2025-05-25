import bcrypt from 'bcrypt'
export const validateHash = async (hash: string, value: string): Promise<boolean> => await bcrypt.compare(value, hash);