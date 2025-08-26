import bcrypt from 'bcrypt';

export const encrypt = (text: string): string => bcrypt.hash(text, 10);
export const compare = (text: string, hashed: string): boolean => bcrypt.compare(text, hashed);