import { EmailProvider } from './services/EmailProvider';
import { ExponentialBackoff } from './utils/ExponentialBackoff';
import { RateLimiter } from './utils/RateLimiter';
import { CircuitBreaker } from './utils/CircuitBreaker';

interface Email {
  to: string;
  subject: string;
  body: string;
  id: string;  // for idempotency
}

interface EmailStatus {
  id: string;
  status: 'sent' | 'failed' | 'retrying' | 'queued';
  attempts: number;
  lastError?: string;
}

export class EmailService {
  private providers: EmailProvider[];
  private retryCount: number;
  private rateLimiter: RateLimiter;
  private circuitBreaker: CircuitBreaker;
  private statusTracking: Map<string, EmailStatus>;

  constructor(providers: EmailProvider[], retryCount = 3) {
    this.providers = providers;
    this.retryCount = retryCount;
    this.rateLimiter = new RateLimiter(10); // Limit to 10 requests per minute
    this.circuitBreaker = new CircuitBreaker(5); // Allow 5 failures before tripping
    this.statusTracking = new Map();
  }

  async send(email: Email): Promise<EmailStatus> {
    if (this.statusTracking.has(email.id)) {
      return this.statusTracking.get(email.id)!;
    }

    let status: EmailStatus = {
      id: email.id,
      status: 'queued',
      attempts: 0,
    };
    this.statusTracking.set(email.id, status);

    for (let attempt = 0; attempt < this.retryCount; attempt++) {
      if (!this.rateLimiter.allow()) {
        await this.rateLimiter.wait();
      }

      for (const provider of this.providers) {
        try {
          status.attempts++;
          await this.circuitBreaker.run(async () => {
            await provider.send(email);
          });
          status.status = 'sent';
          this.statusTracking.set(email.id, status);
          return status;
        } catch (error) {
          status.lastError = error.message;
          status.status = 'retrying';
          await ExponentialBackoff(attempt);
        }
      }
    }

    status.status = 'failed';
    this.statusTracking.set(email.id, status);
    return status;
  }

  getStatus(id: string): EmailStatus | undefined {
    return this.statusTracking.get(id);
  }
}
