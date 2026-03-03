import { describe, it, expect, vi } from 'vitest';
import { getPolicyContent } from '@/lib/markdown';
import fs from 'fs';

describe('Markdown Policy Loader', () => {
  it('should load a French policy correctly', async () => {
    const data = await getPolicyContent('fr', 'privacy');
    expect(data).not.toBeNull();
    expect(data?.title).toBe('Politique de Confidentialité');
    expect(data?.slug).toBe('privacy');
    expect(data?.content).toContain('ARTICLE 1');
  });

  it('should load an English policy correctly', async () => {
    const data = await getPolicyContent('en', 'privacy');
    expect(data).not.toBeNull();
    expect(data?.title).toBe('Privacy Policy');
  });

  it('should return null if file does not exist', async () => {
    const data = await getPolicyContent('fr', 'non-existent');
    expect(data).toBeNull();
  });
});
