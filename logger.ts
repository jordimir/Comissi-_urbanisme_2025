
type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogContext {
  [key: string]: any;
}

const log = (level: LogLevel, message: string, context: LogContext = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };

  const output = JSON.stringify(logEntry);

  switch (level) {
    case 'INFO':
      console.info(output);
      break;
    case 'WARN':
      console.warn(output);
      break;
    case 'ERROR':
      // Log the structured JSON but also the original error for better dev console experience
      console.error(output);
      if (context.error instanceof Error) {
        console.error(context.error);
      }
      break;
    case 'DEBUG':
      console.debug(output);
      break;
  }
};

export const logger = {
  info: (message: string, context?: LogContext) => log('INFO', message, context),
  warn: (message: string, context?: LogContext) => log('WARN', message, context),
  error: (message: string, context?: LogContext) => log('ERROR', message, context),
  debug: (message: string, context?: LogContext) => log('DEBUG', message, context),
};
