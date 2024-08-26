import { EmailService } from './services/EmailService';
import { MockEmailProvider1, MockEmailProvider2 } from './services/EmailProvider';

const providers = [new MockEmailProvider1(), new MockEmailProvider2()];
const emailService = new EmailService(providers);

const email = { to: 'user@example.com', subject: 'Welcome', body: 'Welcome to our service', id: '123' };

emailService.send(email).then(status => {
  console.log('Email Status:', status);
});
