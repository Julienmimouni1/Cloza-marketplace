import { describe, it, expect } from 'vitest';

describe('Infrastructure', () => {
  it('should have framer-motion installed', async () => {
    try {
      await import('framer-motion');
      expect(true).toBe(true);
    } catch (e) {
       // If import fails, test fails
       expect.fail('framer-motion is not installed');
    }
  });
});
