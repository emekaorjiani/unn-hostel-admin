import { NextResponse } from 'next/server';

/**
 * Health check endpoint for Docker container monitoring
 * This endpoint is used by Docker's health check feature to verify the application is running
 */
export async function GET() {
  try {
    // Basic health check - you can add more sophisticated checks here
    // such as database connectivity, external service availability, etc.
    
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.1.0',
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    // If there's an error, return unhealthy status
    const errorData = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    return NextResponse.json(errorData, { status: 503 });
  }
}
