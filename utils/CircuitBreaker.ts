export class CircuitBreaker {
    private failureThreshold: number;
    private failures: number = 0;
    private state: 'closed' | 'open' = 'closed';
  
    constructor(failureThreshold: number) {
      this.failureThreshold = failureThreshold;
    }
  
    async run(action: () => Promise<void>): Promise<void> {
      if (this.state === 'open') {
        throw new Error('Circuit breaker is open');
      }
  
      try {
        await action();
        this.failures = 0;
      } catch (error) {
        this.failures++;
        if (this.failures >= this.failureThreshold) {
          this.state = 'open';
        }
        throw error;
      }
    }
  
    reset(): void {
      this.failures = 0;
      this.state = 'closed';
    }
  }
  