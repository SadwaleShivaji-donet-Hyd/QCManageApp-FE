/**
 * Logger Service for Production Readiness
 * Handles console logs with proper formatting and levels
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

class Logger {
  private isDevelopment = import.meta.env.MODE === "development";

  private log(level: LogLevel, message: string, data?: unknown) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    switch (level) {
      case "DEBUG":
        if (this.isDevelopment) console.debug(logMessage, data);
        break;
      case "INFO":
        console.info(logMessage, data);
        break;
      case "WARN":
        console.warn(logMessage, data);
        break;
      case "ERROR":
        console.error(logMessage, data);
        break;
    }
  }

  debug(message: string, data?: unknown) {
    this.log("DEBUG", message, data);
  }

  info(message: string, data?: unknown) {
    this.log("INFO", message, data);
  }

  warn(message: string, data?: unknown) {
    this.log("WARN", message, data);
  }

  error(message: string, data?: unknown) {
    this.log("ERROR", message, data);
  }
}

export const logger = new Logger();
