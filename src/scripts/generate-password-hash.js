/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = process.argv?.[2];
  
  if (!password) {
    console.error('Usage: node generate-password-hash.js <password>');
    process.exit(1);
  }

  try {
    const hash = await bcrypt?.hash(password, 10);
    console.log('\nGenerated password hash:');
    console.log(hash);
    console.log('\nAdd this to your .env file as ADMIN_PASSWORD_HASH');
  } catch (error) {
    console.error('Error generating hash:', error);
    process.exit(1);
  }
}

generateHash();