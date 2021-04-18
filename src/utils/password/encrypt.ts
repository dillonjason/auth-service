import bcrypt from "bcrypt";

export function encrypt(password: string): string {
  return bcrypt.hashSync(password, 10);
}
