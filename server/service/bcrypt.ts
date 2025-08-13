import bcrypt from "bcrypt";

export const encrypt = (text: string): string => bcrypt.hashSync(text, 10);
export const compare = (text: string, hashed: string): boolean => bcrypt.compareSync(text, hashed);