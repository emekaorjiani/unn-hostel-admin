# UNN Hostel Management System

A comprehensive, enterprise-grade hostel management system designed specifically for the University of Nigeria, Nsukka. This modern web application provides seamless accommodation management for both administrators and students.

![UNN Hostel Management System](https://img.shields.io/badge/UNN-Hostel%20Management-blue?style=for-the-badge&logo=university)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 Features

### 🏢 Administrative Portal
- **Comprehensive Dashboard**: Real-time analytics, performance metrics, and system health monitoring
- **Application Management**: Advanced filtering, bulk actions, and streamlined approval workflows
- **Student Management**: Complete student profiles, academic records, and accommodation history
- **Hostel Administration**: Room allocation, facility management, and occupancy tracking
- **Payment Processing**: Secure payment gateway integration with multiple payment options
- **Reporting & Analytics**: Detailed reports, revenue tracking, and performance insights
- **Maintenance Management**: Ticket tracking, automated assignment, and resolution workflows
- **Notification System**: Real-time alerts, email notifications, and system announcements

### 🎓 Student Portal
- **Personal Dashboard**: Student-specific overview with academic and accommodation information
- **Application System**: User-friendly hostel application process with real-time status tracking
- **Payment Management**: Secure online payments with receipt generation and transaction history
- **Room Selection**: Interactive room selection with live availability updates
- **Maintenance Requests**: Easy issue reporting and ticket tracking
- **Document Management**: Upload and access hostel-related documents
- **Notifications**: Personalized alerts and important updates

### 🔧 Technical Features
- **Modern UI/UX**: Professional design with responsive layouts and intuitive navigation
- **Real-time Updates**: Live data synchronization and instant notifications
- **Advanced Search**: Powerful filtering and search capabilities
- **Bulk Operations**: Efficient batch processing for administrative tasks
- **Export Functionality**: PDF and CSV export for reports and data
- **Mobile Responsive**: Optimized for all device sizes
- **Performance Optimized**: Fast loading times and efficient data handling

## 🛠 Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library

### State Management & Data
- **React Query (TanStack Query)**: Server state management
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **Axios**: HTTP client

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing
- **Yarn**: Package management

## 📁 Project Structure

```yar
unn-hostel-admin/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Admin dashboard
│   │   ├── applications/      # Application management
│   │   ├── student/           # Student portal pages
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   └── layout/           # Layout components
│   └── lib/                  # Utilities and services
│       ├── api.ts            # API client configuration
│       ├── auth.ts           # Authentication services
│       ├── services.ts       # API service functions
│       ├── types.ts          # TypeScript type definitions
│       └── utils.ts          # Utility functions
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/unn-hostel-admin.git
   cd unn-hostel-admin
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_API_URL=https://api.unnaccomodation.com/api
NEXT_PUBLIC_ADMIN_API_URL=https://api.unnaccomodation.com/api
NEXT_PUBLIC_STUDENT_API_URL=http://localhost:3034/api
   ```

4. **Run the development server**
   ```bash
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

### Demo Credentials

#### Admin Portal
- **Email**: `admin@unn.edu.ng`
- **Password**: `admin123`
- **Access**: [http://localhost:3000/auth/login](http://localhost:3000/auth/login)

#### Student Portal
- **Matric Number**: `2021/123456`
- **Password**: `student123`
- **Access**: [http://localhost:3000/student/auth/login](http://localhost:3000/student/auth/login)

## 📊 System Architecture

### Portal Separation
The system implements a clear separation between administrative and student portals:

- **Admin Portal**: Comprehensive management interface for university staff
- **Student Portal**: User-friendly interface for student services
- **Shared Backend**: Centralized API with role-based access control

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - User profile

#### Applications
- `GET /api/admin/dashboard/applications` - List applications
- `POST /api/admin/dashboard/applications` - Create application
- `PUT /api/admin/dashboard/applications/:id` - Update application
- `DELETE /api/admin/dashboard/applications/:id` - Delete application

#### Hostels
- `GET /api/admin/dashboard/hostels` - List hostels
- `POST /api/admin/dashboard/hostels` - Create hostel
- `PUT /api/admin/dashboard/hostels/:id` - Update hostel
- `DELETE /api/admin/dashboard/hostels/:id` - Delete hostel

#### Payments
- `GET /api/admin/dashboard/payments` - List payments
- `POST /api/admin/dashboard/payments` - Process payment
- `GET /api/admin/dashboard/payments/:id` - Payment details

#### Reports
- `GET /api/admin/dashboard/overview` - Dashboard statistics
- `GET /api/admin/dashboard/reports` - Application reports
- `GET /api/admin/dashboard/reports` - Revenue reports

## 🎨 UI Components

The system uses a comprehensive set of reusable UI components:

### Base Components
- `Button` - Various button styles and states
- `Input` - Form input fields
- `Card` - Content containers
- `Badge` - Status indicators
- `Modal` - Dialog overlays

### Layout Components
- `DashboardLayout` - Main admin layout
- `Sidebar` - Navigation sidebar
- `Header` - Top navigation bar

### Form Components
- `Form` - Form wrapper with validation
- `Select` - Dropdown selections
- `Checkbox` - Checkbox inputs
- `RadioGroup` - Radio button groups

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable and function names
- Add comprehensive comments for complex logic

### Component Structure
```typescript
// Component template
'use client'

import { useState, useEffect } from 'react'
import { ComponentProps } from '@/lib/types'

interface ComponentNameProps {
  // Define props
}

export default function ComponentName({ props }: ComponentNameProps) {
  // Component logic
  return (
    // JSX
  )
}
```

### API Integration
```typescript
// Service function template
export const serviceName = {
  async getData(params?: QueryParams): Promise<ApiResponse<DataType>> {
    try {
      const response = await apiClient.get('/endpoint', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for admin and student users
- **Input Validation**: Comprehensive form validation using Zod
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: HTTP security headers configuration

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with advanced capabilities
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface for small screens

## 🚀 Deployment

### Production Build
```bash
yarn build
yarn start
```

### Environment Configuration
```env
# Production environment variables
NEXT_PUBLIC_API_URL=https://api.unn.edu.ng/api
NODE_ENV=production
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment option
- **AWS**: Enterprise deployment solution

## 📈 Performance

### Optimization Features
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js built-in image optimization
- **Caching**: React Query caching for API responses
- **Bundle Analysis**: Webpack bundle analyzer integration

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end user flow testing

### Running Tests
```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Coverage report
yarn test:coverage
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Review Process
- All changes require code review
- Automated tests must pass
- Code style guidelines must be followed
- Documentation must be updated

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Contact
- **Email**: support@unn.edu.ng
- **Phone**: +234 123 456 7890
- **Office**: University of Nigeria, Nsukka

### Issue Reporting
Please report bugs and feature requests through the [GitHub Issues](https://github.com/your-username/unn-hostel-admin/issues) page.

## 🙏 Acknowledgments

- University of Nigeria, Nsukka for the project requirements
- Next.js team for the excellent framework
- Tailwind CSS for the utility-first styling approach
- All contributors and maintainers

---

**Built with ❤️ for UNN Students and Staff**

*Version 2.1.0 - Last updated: January 2024*
