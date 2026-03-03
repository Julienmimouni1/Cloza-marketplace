import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DocumentUploadZone } from '../components/DocumentUploadZone';
import * as actions from '../actions/upload-kyb';

// Mock Server Actions
vi.mock('../actions/upload-kyb', () => ({
    uploadDocument: vi.fn(),
    deleteDocument: vi.fn(),
}));

describe('DocumentUploadZone', () => {
    const mockDocuments: any[] = [];
    const mockKybStatus = 'PENDING';

    it('renders upload sections', () => {
        render(<DocumentUploadZone documents={mockDocuments} kybStatus={mockKybStatus} />);
        expect(screen.getByText(/Company Registration/i)).toBeDefined();
        expect(screen.getByText(/Identity Proof/i)).toBeDefined();
    });

    // We could add more tests for interaction, but this ensures it renders.
});
