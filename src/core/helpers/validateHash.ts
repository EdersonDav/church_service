import bcrypt from 'bcrypt'
export const validateHash = async ({ hash, value }: { value: string, hash: string }): Promise<boolean> => await bcrypt.compare(value, hash);