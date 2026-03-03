export function validateKybEnv() {
  const key = process.env.KYB_ENCRYPTION_KEY;

  if (!key) {
    throw new Error('KYB_ENCRYPTION_KEY is missing in environment variables.');
  }

  if (key.length !== 32) {
    throw new Error('KYB_ENCRYPTION_KEY must be exactly 32 characters long.');
  }
}