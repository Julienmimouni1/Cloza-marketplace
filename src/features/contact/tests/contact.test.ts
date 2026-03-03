import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendContactEmail } from '../actions/send-contact-email';

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock('resend', () => {
  return {
    Resend: class MockResend {
      emails = {
        send: mockSend
      }
    }
  };
});

describe('sendContactEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 're_123';
  });

  it('should validate input and return error if invalid', async () => {
    const invalidData = {
      name: 'A', // too short
      email: 'not-an-email',
      subject: 'Hi', // too short
      message: 'Short' // too short
    };

    const result = await sendContactEmail(invalidData);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('should send email via Resend when input is valid', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello there',
      message: 'This is a valid message for testing.'
    };

    mockSend.mockResolvedValueOnce({ data: { id: 'email_123' }, error: null });

    const result = await sendContactEmail(validData);
    
    expect(result.success).toBe(true);
    expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
      from: expect.stringContaining('onboarding@resend.dev'), // Default for Resend testing
      to: 'julien@example.com', // Assuming hardcoded for now or env var
      subject: expect.stringContaining('Hello there'),
      html: expect.stringContaining('This is a valid message')
    }));
  });

  it('should handle Resend errors', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hello there',
      message: 'This is a valid message for testing.'
    };

    mockSend.mockResolvedValueOnce({ data: null, error: { message: 'Resend Error' } });

    const result = await sendContactEmail(validData);
    
    expect(result.success).toBe(false);
    expect(result.error).toEqual('Resend Error');
  });
});
