/**
 * Application Configuration
 * Centralized environment variable management
 */

export const config = {
  // Backend API Configuration
  backend: {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://api.unnaccomodation.com/api/v1',
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

/**
 * Validate required environment variables
 */
export function validateEnvironment(): void {
  const requiredVars = [
    'BACKEND_API_URL',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Using default values. Please set these variables in your .env file.');
  }
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
  return {
    development: {
      backendUrl: 'https://api.unnaccomodation.com/api/v1',
      debugMode: true,
      logLevel: 'debug',
    },
    production: {
      backendUrl: process.env.BACKEND_API_URL || 'https://api.unnaccomodation.com/api/v1',
      debugMode: false,
      logLevel: 'error',
    },
    test: {
      backendUrl: 'https://api.unnaccomodation.com/api/v1',
      debugMode: true,
      logLevel: 'debug',
    },
  }[config.env.isDevelopment ? 'development' : config.env.isProduction ? 'production' : 'test'];
}
