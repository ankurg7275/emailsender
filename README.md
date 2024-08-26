# emailsender

Requirements:
1. Create an EmailService class that works with two mock email providers.
2. Implement retry logic with exponential backoff.
3. Add a fallback mechanism to switch providers on failure.
4. Ensure idempotency to prevent duplicate sends.
5. Implement basic rate limiting.
6. Provide status tracking for email sending attempts.

Key Features:
- Retry mechanism
- Fallback between providers
- Idempotency
- Rate limiting
- Status tracking

Bonus:
- Circuit breaker pattern
- Simple logging
- Basic queue system
