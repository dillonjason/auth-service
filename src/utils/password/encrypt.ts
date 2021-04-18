import bcrypt from "bcrypt";

export async function encrypt(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}
