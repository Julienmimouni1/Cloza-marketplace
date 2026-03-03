'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { UploadKybFieldsSchema, MAX_FILE_SIZE, ACCEPTED_MIME_TYPES } from '../schemas';
import { validateMagicBytes } from '../utils/file-validation';
import { encryptFile } from '../utils/encryption';
import { ensureStorageDirectory } from '../utils/storage';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export type UploadResult = 
  | { success: true; message: string }
  | { success: false; error: { code: string; message: string } };

export async function uploadDocument(formData: FormData): Promise<UploadResult> {
  try {
    // 1. Validate Session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'You must be logged in to upload documents.' } };
    }
    const userId = session.user.id;

    // 2. Validate Fields
    const rawType = formData.get('type');
    const file = formData.get('file') as File | null;

    const validatedFields = UploadKybFieldsSchema.safeParse({ type: rawType });
    
    if (!validatedFields.success) {
      return { 
        success: false, 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: validatedFields.error.issues[0].message 
        } 
      };
    }

    // 3. Validate File Existence & Size
    if (!file) {
      return { success: false, error: { code: 'MISSING_FILE', message: 'No file provided.' } };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { success: false, error: { code: 'FILE_TOO_LARGE', message: 'File size must be under 5MB.' } };
    }

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        return { success: false, error: { code: 'INVALID_TYPE', message: 'Only PDF, JPG, and PNG are allowed.' } };
    }

    // 4. Validate Magic Bytes (Malware Protection)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const detectedMime = validateMagicBytes(buffer);
    if (!detectedMime || !ACCEPTED_MIME_TYPES.includes(detectedMime)) {
         return { success: false, error: { code: 'SECURITY_CHECK_FAILED', message: 'File content does not match extension (Magic Bytes failed).' } };
    }

    // 5. Encrypt & Save
    const { encryptedBuffer, iv } = encryptFile(buffer);
    const storageDir = await ensureStorageDirectory(userId);
    const fileName = `${randomUUID()}.enc`;
    const filePath = path.join(storageDir, fileName);

    await fs.writeFile(filePath, encryptedBuffer);

    // 6. DB Record
    const kybDoc = await prisma.kybDocument.create({
      data: {
        userId,
        type: validatedFields.data.type,
        status: 'PENDING',
        filePath: filePath, // Storing full absolute path for now, usually relative is better but MVP logic says 'storage/...'
        encryptionIv: iv,
        mimeType: detectedMime,
        originalName: file.name,
      }
    });

    // Check if we have both docs now? Logic says: "If both documents are uploaded, the User's global kybStatus updates to IN_REVIEW."
    // Let's check counts of distinct types for this user
    const userDocs = await prisma.kybDocument.findMany({
        where: { userId, status: 'PENDING' },
        select: { type: true }
    });

    const hasKbis = userDocs.some(d => d.type === 'KBIS');
    const hasIdentity = userDocs.some(d => d.type === 'IDENTITY');

    if (hasKbis && hasIdentity) {
        await prisma.user.update({
            where: { id: userId },
            data: { kybStatus: 'IN_REVIEW' }
        });
        
        // Update session? The next-auth session might be stale until refresh. 
        // We can't force update the client session from here easily without client help, 
        // but the DB is updated.
    }

    revalidatePath('/dashboard/kyb'); // Assuming this is the path
    
    return { success: true, message: 'Document uploaded successfully.' };

  } catch (error) {
    console.error('Upload KYB Error:', error);
    return { success: false, error: { code: 'INTERNAL_ERROR', message: 'Something went wrong during upload.' } };
  }
}

export async function deleteDocument(documentId: string): Promise<UploadResult> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
             return { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } };
        }

        const doc = await prisma.kybDocument.findUnique({
            where: { id: documentId }
        });

        if (!doc) {
             return { success: false, error: { code: 'NOT_FOUND', message: 'Document not found' } };
        }

        if (doc.userId !== session.user.id) {
             return { success: false, error: { code: 'FORBIDDEN', message: 'You do not own this document' } };
        }

        if (doc.status !== 'PENDING') {
             return { success: false, error: { code: 'IMMUTABLE', message: 'Only PENDING documents can be deleted' } };
        }

        // Delete file from disk
        try {
            await fs.unlink(doc.filePath);
        } catch (e) {
            console.error('Failed to delete file from disk', e);
            // Continue to delete from DB even if file missing (cleanup)
        }

        await prisma.kybDocument.delete({
            where: { id: documentId }
        });
        
        // Re-evaluate KYB status if needed? 
        // If they delete a doc, they might fall back from IN_REVIEW? 
        // Requirement didn't specify downgrade, but logic implies they are no longer ready.
        // Let's leave status as is or set back to PENDING if they remove one? 
        // Keep simple: if they delete, we don't auto-downgrade status unless requirement says so.
        // Actually, if they are IN_REVIEW, they shouldn't be able to delete? 
        // "Users can only view/delete their own "PENDING" documents." -> doc.status is checked above.
        // But user.kybStatus is different. 
        // If user is IN_REVIEW, can they delete a PENDING doc?
        // Usually yes, to replace it.
        
        revalidatePath('/dashboard/kyb');
        return { success: true, message: 'Document deleted.' };

    } catch (error) {
        console.error('Delete KYB Error:', error);
         return { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete document' } };
    }
}