import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Prisma Schema', () => {
  it('should have a schema file', () => {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    expect(fs.existsSync(schemaPath)).toBe(true);
  });

  it('should define Vendor model', () => {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    const content = fs.readFileSync(schemaPath, 'utf-8');
    expect(content).toContain('model Vendor');
    expect(content).toContain('id');
    expect(content).toContain('name');
    expect(content).toContain('slug');
    expect(content).toContain('logoUrl');
  });

  it('should define Product model', () => {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    const content = fs.readFileSync(schemaPath, 'utf-8');
    expect(content).toContain('model Product');
    expect(content).toContain('priceHt');
    expect(content).toContain('vendorId');
  });
});
