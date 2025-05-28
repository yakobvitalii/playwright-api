export function logInfo(message: string): void {
  console.info(`[INFO] ${new Date().toISOString()} - ${message}`);
};

export function logError(message: string, error?: unknown): void {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  if (error) {
    console.error(error);
  }
};
