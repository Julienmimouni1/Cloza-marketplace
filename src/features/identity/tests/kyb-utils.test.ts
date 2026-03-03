import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { encryptFile, decryptFile } from '../utils/encryption';
import { validateMagicBytes } from '../utils/file-validation';
import { ensureStorageDirectory } from '../utils/storage';
import { validateKybEnv } from '@/lib/env';

// Mock process.env
const ORIGINAL_ENV = process.env;

describe('KYB Utilities', () => {
  describe('Environment Validation', () => {
    beforeEach(() => {
      vi.resetModules();
      process.env = { ...ORIGINAL_ENV };
    });

    afterEach(() => {
      process.env = ORIGINAL_ENV;
    });

    it('should throw if KYB_ENCRYPTION_KEY is missing', () => {
      delete process.env.KYB_ENCRYPTION_KEY;
      expect(() => validateKybEnv()).toThrow('KYB_ENCRYPTION_KEY');
    });

    it('should throw if KYB_ENCRYPTION_KEY is too short (32 chars required)', () => {
       process.env.KYB_ENCRYPTION_KEY = 'short';
       expect(() => validateKybEnv()).toThrow('32 characters');
    });

    it('should pass if KYB_ENCRYPTION_KEY is valid', () => {
      process.env.KYB_ENCRYPTION_KEY = '01234567890123456789012345678901'; // 32 chars
      expect(() => validateKybEnv()).not.toThrow();
    });
  });

  describe('Encryption', () => {
    // Need a valid key for these tests
    beforeEach(() => {
      process.env.KYB_ENCRYPTION_KEY = '01234567890123456789012345678901';
    });

    it('should encrypt and decrypt a buffer correctly', () => {
      const originalText = 'Hello World';
      const buffer = Buffer.from(originalText);

      const { encryptedBuffer, iv } = encryptFile(buffer);

      expect(encryptedBuffer).not.toEqual(buffer);
      expect(iv).toBeDefined();

      const decrypted = decryptFile(encryptedBuffer, iv);
      expect(decrypted.toString()).toBe(originalText);
    });
  });

  describe('File Validation (Magic Bytes)', () => {
    it('should validate PDF', () => {
      // %PDF
      const buffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2D]); 
      expect(validateMagicBytes(buffer)).toBe('application/pdf');
    });

    it('should validate JPG', () => {
      // FF D8 FF
      const buffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]);
      expect(validateMagicBytes(buffer)).toBe('image/jpeg');
    });

    it('should validate PNG', () => {
      // 89 50 4E 47
      const buffer = Buffer.from([0x89, 0x50, 0x4E, 0x47]);
      expect(validateMagicBytes(buffer)).toBe('image/png');
    });

    it('should return null for invalid types', () => {
      const buffer = Buffer.from([0x00, 0x00, 0x00]);
      expect(validateMagicBytes(buffer)).toBeNull();
    });
    
    it('should reject executable spoofed as pdf', () => {
        // MZ header for EXE
        const buffer = Buffer.from([0x4D, 0x5A]); 
        expect(validateMagicBytes(buffer)).toBeNull();
    });
  });

  describe('Storage', () => {
    it('should create directory if not exists', async () => {
      const testDir = path.join(process.cwd(), 'storage/kyb-documents/test-user');
      
      // Clean up before test
      if (fs.existsSync(testDir)) {
        fs.rmdirSync(testDir, { recursive: true });
      }

      const result = await ensureStorageDirectory('test-user');
      
      expect(fs.existsSync(result)).toBe(true);
      expect(result).toContain('test-user');

      // Cleanup
      if (fs.existsSync(testDir)) {
          fs.rmdirSync(testDir);
      }
    });
  });
});
