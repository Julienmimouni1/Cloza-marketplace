import crypto from 'crypto';
import { validateKybEnv } from '@/lib/env';

const ALGORITHM = 'aes-256-gcm';

export function encryptFile(buffer: Buffer): { encryptedBuffer: Buffer; iv: string } {
  validateKybEnv();
  const key = process.env.KYB_ENCRYPTION_KEY as string;
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  // Append auth tag to the end of the encrypted buffer
  const finalBuffer = Buffer.concat([encrypted, authTag]);
  
  return {
    encryptedBuffer: finalBuffer,
    iv: iv.toString('hex'),
  };
}

export function decryptFile(encryptedBuffer: Buffer, ivHex: string): Buffer {
  validateKybEnv();
  const key = process.env.KYB_ENCRYPTION_KEY as string;
  const iv = Buffer.from(ivHex, 'hex');
  
  // Extract auth tag (last 16 bytes)
  const authTagLength = 16;
  const authTag = encryptedBuffer.subarray(encryptedBuffer.length - authTagLength);
  const encryptedContent = encryptedBuffer.subarray(0, encryptedBuffer.length - authTagLength);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);
  decipher.setAuthTag(authTag);
  
  return Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
}