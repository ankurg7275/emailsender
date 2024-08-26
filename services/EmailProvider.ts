export interface EmailProvider {
    send(email: Email): Promise<void>;
  }
  
  export class MockEmailProvider1 implements EmailProvider {
    async send(email: Email): Promise<void> {
      // Mock implementation: throw an error sometimes to simulate failure
      if (Math.random() < 0.5) {
        throw new Error('MockEmailProvider1 failed');
      }
      console.log(`Email sent using MockEmailProvider1: ${email.subject}`);
    }
  }
  
  export class MockEmailProvider2 implements EmailProvider {
    async send(email: Email): Promise<void> {
      if (Math.random() < 0.5) {
        throw new Error('MockEmailProvider2 failed');
      }
      console.log(`Email sent using MockEmailProvider2: ${email.subject}`);
    }
  }
  