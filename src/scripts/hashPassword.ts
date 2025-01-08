// scripts/hashPassword.ts
import bcrypt from 'bcryptjs';

async function generateHashedPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
}

generateHashedPassword('Test6200');