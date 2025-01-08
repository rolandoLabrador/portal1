import bcrypt from 'bcryptjs';

async function verifyPassword(plainPassword: string, hash: string) {
  const isMatch = await bcrypt.compare(plainPassword, hash);
  return isMatch;
}

// Example usage
const plainPassword = 'Test6200';
const hash = '$2a$10$vLm1jP20i7Tw.jQEBXhx3Ofb4TqlQhWEV7dCGQx..7/QQn4p8rIFa'; // Example hash
verifyPassword(plainPassword, hash).then(isMatch => {
  console.log(isMatch); // true or false
});