export class RateLimiter {
    private maxRequests: number;
    private timeFrame: number;
    private requests: number[] = [];
  
    constructor(maxRequests: number, timeFrame = 60000) {
      this.maxRequests = maxRequests;
      this.timeFrame = timeFrame;
    }
  
    allow(): boolean {
      const now = Date.now();
      this.requests = this.requests.filter(timestamp => now - timestamp < this.timeFrame);
      if (this.requests.length < this.maxRequests) {
        this.requests.push(now);
        return true;
      }
      return false;
    }
  
    async wait(): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, this.timeFrame / this.maxRequests));
    }
  }
  