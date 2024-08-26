import { EmailService } from '../services/EmailService';
import { MockEmailProvider1, MockEmailProvider2 } from '../services/EmailProvider';

describe('EmailService', () => {
  const providers = [new MockEmailProvider1(), new MockEmailProvider2()];
  const emailService = new EmailService(providers);

  test('should send an email using one of the providers', async () => {
    const email = { to: 'test@example.com', subject: 'Test', body: 'Test body', id: '1' };
    const status = await emailService.send(email);

    expect(status.status).toBe('sent');
    expect(status.attempts).toBeGreaterThan(0);
  });

  test('should handle retries and failover between providers', async () => {
    const email = { to: 'test@example.com', subject: 'Retry Test', body: 'Test body', id: '2' };
    const status = await emailService.send(email);

    expect(status.status).toBeOneOf(['sent', 'failed']);
  });

  test('should track the status of an email', async () => {
    const email = { to: 'test@example.com', subject: 'Status Test', body: 'Test body', id: '3' };
    await emailService.send(email);
    const status = emailService.getStatus('3');

    expect(status).toBeDefined();
    expect(status?.id).toBe('3');
  });
});
