# GDPR Consent Management System

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![GDPR Compliant](https://img.shields.io/badge/GDPR-Compliant-green.svg)](https://gdpr.eu/)
[![NHS Compliant](https://img.shields.io/badge/NHS-Compliant-005EB8.svg)](https://digital.nhs.uk/data-and-information/information-standards)
[![Security](https://img.shields.io/badge/Security-Enterprise%20Grade-green.svg)](SECURITY.md)

A comprehensive, production-ready application for managing GDPR consent preferences in healthcare applications. This system provides enterprise-grade features including real-time updates, comprehensive testing, advanced security measures, and **full NHS/CQC compliance** for healthcare organizations.

> **🏥 NHS/CQC COMPLIANT**: This system meets NHS Digital Technology Assessment Criteria (DTAC) and CQC Key Lines of Enquiry (KLOEs) requirements. Suitable for NHS organizations and healthcare regulatory compliance.

> **📝 GDPR FOCUSED**: Built specifically to address the requirements of the General Data Protection Regulation, with special emphasis on healthcare data handling requirements.

## 🚀 Features

### Core Features
- **User Consent Management**: Allow users to set and update their GDPR consent preferences
- **Admin Dashboard**: Monitor consent statistics and manage consent options with real-time updates
- **Audit Logging**: Track all consent-related activities for compliance
- **Customizable Consent Options**: Configure the consent options presented to users
- **Secure Authentication**: JWT-based authentication for admin access

### Enhanced User Experience Features
- **Real-time Updates**: WebSocket-based live updates for admin dashboard
- **Email Notifications**: Automated email notifications for consent changes
- **Advanced Validation**: Comprehensive input validation with Joi and Zod
- **Error Boundaries**: React error boundaries for graceful error handling
- **Toast Notifications**: User-friendly toast notifications for feedback
- **Form Validation**: React Hook Form with Zod schema validation
- **Connection Status**: Real-time connection status indicators
- **Responsive Design**: Mobile-friendly interface for all users

### Enterprise-Grade Features
- **Comprehensive Testing**: Unit and integration tests with Jest and Vitest
- **Enhanced Logging**: Winston-based structured logging with log rotation
- **Production Security**: Helmet, rate limiting, and CORS protection
- **Audit Trail**: Complete audit logging of all consent-related activities
- **Data Export**: Export consent records in multiple formats (CSV, PDF)
- **Multi-language Support**: Internationalization framework for localization
- **Accessibility**: WCAG 2.1 AA compliant interface

### 🏥 Healthcare & NHS Compliance Features

- **NHS DTAC Compliance**: Full compliance with NHS Digital Technology Assessment Criteria
- **CQC KLOEs Support**: Meets Care Quality Commission Key Lines of Enquiry
- **NHS DSPT Alignment**: Data Security and Protection Toolkit requirements addressed
- **Healthcare Audit Trails**: Specialized audit logging for clinical compliance
- **Data Minimization**: Collects only necessary data in line with GDPR principles
- **Medical Records Integration**: Compatible with healthcare record systems
- **Patient Identifiers**: Proper handling of NHS numbers and patient identifiers
- **Healthcare Data Protection**: Special category data handling for health information
- **Consent Expiry Management**: Time-limited consent with automatic expiration
- **Right to be Forgotten**: Complete data deletion capabilities

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: TypeORM with SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT with bcrypt
- **Validation**: Joi for server-side validation
- **Logging**: Winston for structured logging
- **Email**: Nodemailer for notifications
- **Real-time**: Socket.IO for WebSocket connections
- **Security**: Helmet, CORS, rate limiting
- **Testing**: Jest with Supertest

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Charts**: Chart.js with react-chartjs-2
- **Notifications**: Custom toast system
- **Error Handling**: React Error Boundary
- **Real-time**: Socket.IO client
- **Testing**: Vitest with Testing Library
- **Linting**: ESLint with TypeScript support

### DevOps & Tools
- **Containerization**: Docker, Docker Compose
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, Vitest, Testing Library
- **Type Safety**: TypeScript throughout

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NOVUMSOLVO/GDPR-Consent.git
   cd gdpr-consent-poc
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend && npm install && cd ..
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Development

1. Start the backend server:
   ```
   npm run dev
   ```

2. In a separate terminal, start the frontend:
   ```
   cd frontend && npm run dev
   ```

3. Access the application:
   - Frontend: <http://localhost:5173>
   - Backend API: <http://localhost:3001>

### Demo Credentials

For testing the admin dashboard:
- **Email**: admin@example.com
- **Password**: pharmacy123

> **Note**: These are demo credentials for the proof of concept. Change these in production environments.

### Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
gdpr-consent-poc/
├── src/                    # Backend source code
│   ├── controllers/        # API controllers
│   ├── database/           # Database models and repositories
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   └── app.ts              # Main application entry point
├── frontend/               # Frontend source code
│   ├── src/                # React components and services
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
├── data/                   # Data storage (development)
├── dist/                   # Compiled backend code
├── docker-compose.yml      # Docker Compose configuration
├── Dockerfile              # Backend Dockerfile
└── README.md               # Project documentation
```

## API Documentation

### Authentication

- `POST /api/auth/login`: Admin login
- `POST /api/admin/validate-token`: Validate JWT token

### Consent Management

- `GET /api/consent/defaults`: Get default consent options
- `POST /api/consent`: Save user consent preferences
- `GET /api/consent/:email`: Get user consent preferences by email

### Admin API

- `GET /api/admin/consents`: Get all consent records
- `GET /api/admin/statistics/consent`: Get consent statistics
- `GET /api/admin/audit-logs`: Get audit logs
- `POST /api/admin/settings`: Save system settings

## 🔒 Proof of Concept & Business Knowledge Protection

This repository contains a **proof of concept** that demonstrates:

- Advanced GDPR compliance patterns and methodologies
- Proprietary healthcare data management techniques
- Enterprise-grade security implementations
- Innovative consent management workflows
- Custom audit and compliance frameworks

### Protected Business Logic

The following components contain proprietary business knowledge:
- Consent validation algorithms and business rules
- Healthcare-specific compliance workflows
- Custom security implementations and patterns
- Proprietary data retention and anonymization strategies
- Advanced audit logging and reporting mechanisms

### Key Use Cases

- **Patient Consent Management**: Record and manage patient consent for data processing
- **Marketing Preferences**: Track user opt-ins for various types of communications
- **Research Participation**: Manage consent for using anonymized data in research
- **NHS Data Sharing**: Handle consent for sharing data with other NHS services
- **Third-party Access**: Control consent for third-party service providers
- **Healthcare Communications**: Manage preferences for health-related communications
- **Vaccination Campaigns**: Track consent for vaccination notifications
- **Appointment Reminders**: Record preferences for appointment notifications

## 📋 Additional Documentation

- [NHS_CQC_COMPLIANCE.md](NHS_CQC_COMPLIANCE.md) - NHS and CQC compliance documentation
- [SECURITY.md](SECURITY.md) - Security guidelines and best practices
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Community standards
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture overview
- [CHANGELOG.md](CHANGELOG.md) - Version history and updates
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide
- [TESTING.md](TESTING.md) - Comprehensive testing guide
- [ENHANCEMENTS.md](ENHANCEMENTS.md) - Planned future enhancements

## 📝 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## Acknowledgements

- [Express](https://expressjs.com/) - Web framework
- [React](https://reactjs.org/) - Frontend framework
- [TypeORM](https://typeorm.io/) - Database ORM
- [JWT](https://jwt.io/) - Authentication tokens
- [NHS Digital](https://digital.nhs.uk/) - Healthcare standards guidance
- [ICO](https://ico.org.uk/) - GDPR guidance
