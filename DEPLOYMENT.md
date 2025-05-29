# GDPR Consent Application Deployment Guide

This document provides instructions for deploying the GDPR Consent application to various environments.

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- PostgreSQL 13.x or higher (for production)

## Environment Setup

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT_START=3001
PORT_MAX=3020
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/gdpr_consent

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-key
JWT_EXPIRY=30m

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com

# Data Storage
DATA_DIR=./data
```

## Development Deployment

1. Clone the repository:
   ```
   git clone https://github.com/your-org/gdpr-consent-poc.git
   cd gdpr-consent-poc
   ```

2. Install dependencies:
   ```
   npm install
   cd frontend && npm install && cd ..
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. In a separate terminal, start the frontend:
   ```
   cd frontend && npm run dev
   ```

## Production Deployment

### Backend Deployment

1. Build the application:
   ```
   npm run build
   ```

2. Set up the database:
   ```
   npm run db:migrate
   ```

3. Start the application:
   ```
   npm start
   ```

### Frontend Deployment

1. Build the frontend:
   ```
   cd frontend && npm run build
   ```

2. Deploy the built files (in `frontend/dist`) to your web server or CDN.

## Docker Deployment

A Docker Compose setup is provided for easy deployment:

1. Make sure Docker and Docker Compose are installed.

2. Build and start the containers:
   ```
   docker-compose up -d
   ```

3. The application will be available at http://localhost:3001 (API) and http://localhost:8080 (frontend).

## Security Considerations

1. **JWT Secret**: Use a strong, unique JWT secret in production.
2. **HTTPS**: Always use HTTPS in production.
3. **Database**: Use a secure database connection with proper credentials.
4. **Rate Limiting**: The application includes rate limiting for sensitive endpoints.
5. **CORS**: Configure CORS to allow only trusted origins.

## Monitoring and Maintenance

1. **Logs**: Application logs are written to stdout/stderr and can be captured by your logging system.
2. **Health Check**: A health check endpoint is available at `/health`.
3. **Database Backups**: Set up regular backups of your database.

## Troubleshooting

### Common Issues

1. **Port Already in Use**: The application will try ports from `PORT_START` to `PORT_MAX` until it finds an available one.
2. **Database Connection Issues**: Verify your database credentials and connection string.
3. **CORS Errors**: Ensure the `CORS_ORIGIN` is correctly set to your frontend domain.

### Support

For additional support, please contact the development team or open an issue in the repository.
