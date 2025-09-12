/**
 * Logger utility for consistent logging across the application
 */
export class Logger {
  private static formatMessage(level: string, message: string, data?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  static info(message: string, data?: Record<string, unknown>): void {
    console.log(this.formatMessage('INFO', message, data));
  }

  static warn(message: string, data?: Record<string, unknown>): void {
    console.warn(this.formatMessage('WARN', message, data));
  }

  static error(message: string, error?: unknown): void {
    const errorData = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : { error: String(error) };
    console.error(this.formatMessage('ERROR', message, errorData));
  }

  static debug(message: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message, data));
    }
  }
}

/**
 * Generic error handler for API routes
 */
export function handleApiError(error: unknown, context: string = 'API'): {
  message: string;
  statusCode: number;
} {
  Logger.error(`${context} Error`, error);

  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: error.message.includes('required') || error.message.includes('must be') ? 400 : 500
    };
  }

  return {
    message: 'An unknown error occurred',
    statusCode: 500
  };
}

/**
 * Retry utility for network operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      Logger.warn(`Operation failed, attempt ${attempt}/${maxRetries}`, { error });

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError;
}
