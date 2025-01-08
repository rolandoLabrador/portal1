import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to the database...');
  await prisma.$connect();
  console.log('Connected to the database.');

  const hashedPassword = await bcrypt.hash('Test6200', 10);
  console.log('Password hashed:', hashedPassword);

  const user = await prisma.user.create({
    data: {
      name: 'Rolando',
      email: 'rolando1515@hotmail.com',
      password: hashedPassword, 
    },
  });

  console.log('User created:', user);

  await prisma.$disconnect();
  console.log('Disconnected from the database.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });