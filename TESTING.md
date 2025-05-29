# Testing Guide

This document provides comprehensive testing instructions for the GDPR Consent Management System.

## Test Structure

### Backend Tests
- **Location**: `tests/` directory
- **Framework**: Jest with Supertest
- **Coverage**: Controllers, services, middleware, and utilities

### Frontend Tests
- **Location**: `frontend/src/test/` directory
- **Framework**: Vitest with React Testing Library
- **Coverage**: Components, hooks, and utilities

## Running Tests

### Backend Tests

```bash
# Run all backend tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/controllers/consent.controller.test.ts
```

### Frontend Tests

```bash
# Navigate to frontend directory
cd frontend

# Run all frontend tests
npm test

# Run tests in watch mode (interactive)
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/test/App.test.tsx
```

## Test Categories

### Unit Tests
- Individual component testing
- Service function testing
- Utility function testing
- Validation schema testing

### Integration Tests
- API endpoint testing
- Database interaction testing
- Authentication flow testing
- WebSocket connection testing

### End-to-End Tests
- Complete user workflows
- Admin dashboard functionality
- Form submission flows
- Error handling scenarios

## Test Data

### Mock Data
- Consent records
- User data
- Admin credentials
- System settings

### Test Environment
- In-memory database for backend tests
- Mocked API calls for frontend tests
- Isolated test environment

## Coverage Goals

- **Backend**: Minimum 80% code coverage
- **Frontend**: Minimum 75% code coverage
- **Critical paths**: 100% coverage for authentication and consent handling

## Writing New Tests

### Backend Test Example

```typescript
import request from 'supertest';
import app from '../src/app';

describe('Consent API', () => {
  it('should create new consent record', async () => {
    const consentData = {
      name: 'John Doe',
      email: 'john@example.com',
      consentOptions: [...]
    };

    const response = await request(app)
      .post('/api/consent')
      .send(consentData)
      .expect(200);

    expect(response.body).toHaveProperty('id');
  });
});
```

### Frontend Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import App from '../App';

describe('App Component', () => {
  it('should submit form with valid data', async () => {
    render(<App />);
    
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

## Continuous Integration

Tests are automatically run on:
- Pull requests
- Main branch commits
- Release builds

## Test Debugging

### Common Issues
1. **Database connection errors**: Ensure test database is properly configured
2. **Async test failures**: Use proper async/await patterns
3. **Mock issues**: Verify mocks are properly reset between tests

### Debugging Commands

```bash
# Run tests with verbose output
npm test -- --verbose

# Run tests with debugging
npm test -- --inspect-brk

# Run single test with debugging
npm test -- --testNamePattern="specific test name"
```

## Performance Testing

### Load Testing
- Use tools like Artillery or k6
- Test API endpoints under load
- Monitor response times and error rates

### Memory Testing
- Monitor memory usage during tests
- Check for memory leaks
- Validate garbage collection

## Security Testing

### Authentication Tests
- Invalid token handling
- Session timeout testing
- Permission validation

### Input Validation Tests
- SQL injection prevention
- XSS prevention
- CSRF protection

## Accessibility Testing

### Frontend Accessibility
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- ARIA labels and roles

## Browser Testing

### Supported Browsers
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Testing Tools
- Playwright for cross-browser testing
- BrowserStack for device testing
- Lighthouse for performance audits
