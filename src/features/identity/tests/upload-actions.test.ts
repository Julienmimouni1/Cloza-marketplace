import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { uploadDocument, deleteDocument } from '../actions/upload-kyb';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as encryption from '../utils/encryption';
import * as validation from '../utils/file-validation';
import * as storage from '../utils/storage';
import fs from 'fs/promises';

// --- MOCK FormData ---
const mockFile = {
    name: 'doc.pdf',
    type: 'application/pdf',
    size: 12345,
    arrayBuffer: () => Promise.resolve(Buffer.from('fake-pdf-content').buffer),
};
const mockFormData = {
    get: vi.fn((key: string) => {
        if (key === 'file') return mockFile;
        if (key === 'type') return 'KBIS';
        return null;
    }),
    append: vi.fn(),
};

global.FormData = class {
    get = mockFormData.get;
    append = mockFormData.append;
} as any;


// Mock Dependencies
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));
vi.mock('@/lib/prisma', () => ({
  prisma: {
    kybDocument: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      update: vi.fn(),
    },
  },
}));
vi.mock('../utils/encryption');
vi.mock('../utils/file-validation');
vi.mock('../utils/storage');
vi.mock('fs/promises', () => ({
    default: {
        writeFile: vi.fn(),
        unlink: vi.fn(),
    }
}));
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

describe('KYB Upload Actions', () => {
    const mockUserId = 'user-123';
    
    beforeEach(() => {
        vi.clearAllMocks(); // Use clearAllMocks to reset FormData mock as well
        process.env.KYB_ENCRYPTION_KEY = '01234567890123456789012345678901';
        (auth as Mock).mockResolvedValue({ user: { id: mockUserId } });
        (storage.ensureStorageDirectory as Mock).mockResolvedValue('/tmp/storage');
        (encryption.encryptFile as Mock).mockReturnValue({ encryptedBuffer: Buffer.from('enc'), iv: 'iv' });
        (validation.validateMagicBytes as Mock).mockReturnValue('application/pdf');
    });

    describe('uploadDocument', () => {
        it('should fail if user is not authenticated', async () => {
            (auth as Mock).mockResolvedValue(null);
            const result = await uploadDocument(new FormData());
            expect(result.success).toBe(false);
            if (!result.success) expect(result.error.code).toBe('UNAUTHORIZED');
        });

        it('should fail if file is missing', async () => {
             mockFormData.get.mockReturnValueOnce('KBIS').mockReturnValueOnce(null);
             const result = await uploadDocument(new FormData());
             expect(result.success).toBe(false);
             if (!result.success) expect(result.error.code).toBe('MISSING_FILE');
        });

        it('should fail if magic byte check fails', async () => {
             (validation.validateMagicBytes as Mock).mockReturnValue(null);
             const result = await uploadDocument(new FormData());
             expect(result.success).toBe(false);
             if (!result.success) expect(result.error.code).toBe('SECURITY_CHECK_FAILED');
        });

        it('should success on valid upload', async () => {
             (prisma.kybDocument.create as Mock).mockResolvedValue({ id: 'doc-1' });
             (prisma.kybDocument.findMany as Mock).mockResolvedValue([]);

             const result = await uploadDocument(new FormData());
             
             expect(result.success).toBe(true);
             expect(encryption.encryptFile).toHaveBeenCalled();
             expect(fs.writeFile).toHaveBeenCalled();
             expect(prisma.kybDocument.create).toHaveBeenCalled();
        });

        it('should update user status if both docs present', async () => {
                          mockFormData.get.mockReturnValueOnce('IDENTITY' as any).mockReturnValueOnce(mockFile as any);             (prisma.kybDocument.create as Mock).mockResolvedValue({ id: 'doc-2' });
             (prisma.kybDocument.findMany as Mock).mockResolvedValue([
                 { type: 'KBIS' }, { type: 'IDENTITY' }
             ]);

             const result = await uploadDocument(new FormData());
             
             expect(result.success).toBe(true);
             expect(prisma.user.update).toHaveBeenCalledWith({
                 where: { id: mockUserId },
                 data: { kybStatus: 'IN_REVIEW' }
             });
        });
    });

    describe('deleteDocument', () => {
        it('should delete pending document owned by user', async () => {
             (prisma.kybDocument.findUnique as Mock).mockResolvedValue({ 
                 id: 'doc-1', 
                 userId: mockUserId, 
                 status: 'PENDING',
                 filePath: '/tmp/file.enc'
             });

             const result = await deleteDocument('doc-1');
             
             expect(fs.unlink).toHaveBeenCalledWith('/tmp/file.enc');
             expect(prisma.kybDocument.delete).toHaveBeenCalledWith({ where: { id: 'doc-1' } });
             expect(result.success).toBe(true);
        });

        it('should fail to delete approved document', async () => {
             (prisma.kybDocument.findUnique as Mock).mockResolvedValue({ 
                 id: 'doc-1', 
                 userId: mockUserId, 
                 status: 'APPROVED'
             });

             const result = await deleteDocument('doc-1');
             
             expect(result.success).toBe(false);
             if(!result.success) expect(result.error.code).toBe('IMMUTABLE');
        });
        
        it('should fail to delete others document', async () => {
             (prisma.kybDocument.findUnique as Mock).mockResolvedValue({ 
                 id: 'doc-1', 
                 userId: 'other-user', 
                 status: 'PENDING'
             });

             const result = await deleteDocument('doc-1');
             
             expect(result.success).toBe(false);
             if(!result.success) expect(result.error.code).toBe('FORBIDDEN');
        });
    });
});