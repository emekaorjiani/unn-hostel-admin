# Environment Configuration Setup

## Overview

The application now uses a centralized environment configuration system with proper `.env` file management instead of hardcoded values.

## Environment Variables

### Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Backend API Configuration
BACKEND_API_URL=http://localhost:3001/api/v1

# Frontend Configuration
NEXT_PUBLIC_APP_NAME="UNN Hostel Admin"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# API Configuration
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=3

# Authentication Configuration
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=24h

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_DEBUG_MODE=true

# Dashboard Configuration
DASHBOARD_REFRESH_INTERVAL=30000
DASHBOARD_MAX_RETRIES=3
```

### Environment-Specific Configuration

#### Development Environment
```bash
NODE_ENV=development
BACKEND_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_DEBUG_MODE=true
```

#### Production Environment
```bash
NODE_ENV=production
BACKEND_API_URL=https://api.unnhostelportal.com/api/v1
NEXT_PUBLIC_DEBUG_MODE=false
```

#### Test Environment
```bash
NODE_ENV=test
BACKEND_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_DEBUG_MODE=true
```

## Configuration Management

### Centralized Configuration File

**File**: `src/lib/config.ts`

**Features**:
- ✅ **Type Safety**: Strong TypeScript types for all configuration
- ✅ **Environment Validation**: Validates required environment variables
- ✅ **Default Values**: Sensible defaults for all configuration options
- ✅ **Environment-Specific**: Different configs for dev/prod/test

### Configuration Structure

```typescript
export const config = {
  // Backend API Configuration
  backend: {
    baseUrl: process.env.BACKEND_API_URL || 'http://localhost:3001/api/v1',
    timeout: parseInt(process.env.API_TIMEOUT || '30000'),
    retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS || '3'),
  },

  // Frontend Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'UNN Hostel Admin',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  },

  // Authentication Configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-key-here',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // Dashboard Configuration
  dashboard: {
    refreshInterval: parseInt(process.env.DASHBOARD_REFRESH_INTERVAL || '30000'),
    maxRetries: parseInt(process.env.DASHBOARD_MAX_RETRIES || '3'),
  },

  // Environment
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
} as const;
```

## Usage in Code

### 1. **API Client Configuration**

**File**: `src/lib/api.ts`

```typescript
import { config } from "./config";

export const apiClient = axios.create({
  baseURL: config.backend.baseUrl,
  timeout: config.backend.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 2. **Dashboard API Configuration**

**File**: `src/app/api/v1/reports/dashboard/route.ts`

```typescript
import { config } from "../../../../../lib/config";

async function fetchLiveDashboardData(token: string, filters: Record<string, string>) {
  const baseUrl = config.backend.baseUrl;
  // ... rest of the function
}
```

### 3. **Dashboard Service Configuration**

**File**: `src/lib/dashboardService.ts`

```typescript
import { config } from "./config";

static startRealTimeUpdates(
  filters: DashboardFilters = {},
  callback: (data: DashboardMetrics) => void,
  interval: number = config.dashboard.refreshInterval
): () => void {
  // ... implementation
}
```

## Environment Variable Types

### 1. **Public Variables (NEXT_PUBLIC_*)**
- Accessible in both client and server code
- Exposed to the browser
- Used for frontend configuration

### 2. **Private Variables**
- Only accessible in server-side code
- Not exposed to the browser
- Used for sensitive configuration

### 3. **Required Variables**
- Must be set for the application to function properly
- Validation checks for missing variables
- Clear error messages when missing

## Setup Instructions

### 1. **Create Environment File**

Create a `.env.local` file in the root directory:

```bash
# Copy the example configuration above
cp .env.example .env.local
```

### 2. **Configure Environment Variables**

Edit `.env.local` with your specific values:

```bash
# Development
BACKEND_API_URL=http://localhost:3001/api/v1
NODE_ENV=development

# Production
BACKEND_API_URL=https://api.unnhostelportal.com/api/v1
NODE_ENV=production
```

### 3. **Validate Configuration**

The application will automatically validate environment variables on startup:

```typescript
// This runs automatically
validateEnvironment();
```

### 4. **Environment-Specific Configuration**

Use the `getEnvironmentConfig()` function for environment-specific settings:

```typescript
const envConfig = getEnvironmentConfig();
console.log(envConfig.backendUrl);
```

## Benefits of Environment Configuration

### 1. **Security**
- ✅ **Sensitive Data**: API keys and secrets kept secure
- ✅ **Environment Isolation**: Different configs for different environments
- ✅ **No Hardcoding**: No sensitive data in source code

### 2. **Flexibility**
- ✅ **Easy Configuration**: Simple .env file management
- ✅ **Environment Switching**: Easy to switch between environments
- ✅ **Deployment Ready**: Production-ready configuration management

### 3. **Maintainability**
- ✅ **Centralized Config**: All configuration in one place
- ✅ **Type Safety**: Strong TypeScript types for all config
- ✅ **Validation**: Automatic validation of required variables

### 4. **Development Experience**
- ✅ **Local Development**: Easy local environment setup
- ✅ **Team Collaboration**: Shared configuration templates
- ✅ **Debugging**: Environment-specific debug modes

## Best Practices

### 1. **Environment File Management**
- ✅ **Never Commit .env.local**: Add to .gitignore
- ✅ **Use .env.example**: Provide template for team
- ✅ **Document Variables**: Clear documentation of all variables

### 2. **Security**
- ✅ **Private Variables**: Use private variables for sensitive data
- ✅ **Secret Management**: Use proper secret management in production
- ✅ **Validation**: Validate all required variables

### 3. **Development**
- ✅ **Local Overrides**: Allow local environment overrides
- ✅ **Default Values**: Provide sensible defaults
- ✅ **Error Handling**: Clear error messages for missing variables

## Troubleshooting

### 1. **Missing Environment Variables**
```bash
# Check if .env.local exists
ls -la .env.local

# Validate environment variables
npm run dev
# Look for validation warnings in console
```

### 2. **Configuration Not Loading**
```bash
# Restart development server
npm run dev

# Check environment variable access
console.log(process.env.BACKEND_API_URL);
```

### 3. **Production Deployment**
```bash
# Set environment variables in production
export BACKEND_API_URL=https://api.unnhostelportal.com/api/v1
export NODE_ENV=production

# Or use deployment platform's environment variable system
```

## Conclusion

The environment configuration system provides:

- ✅ **Secure Configuration**: Proper management of sensitive data
- ✅ **Environment Flexibility**: Easy switching between environments
- ✅ **Type Safety**: Strong TypeScript support for all configuration
- ✅ **Validation**: Automatic validation of required variables
- ✅ **Maintainability**: Centralized configuration management

This setup ensures the application can be easily configured for different environments while maintaining security and type safety.

