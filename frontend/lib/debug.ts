const isProduction = process.env.NODE_ENV === "production";

export const isDebugLoggingEnabled = () =>
  !isProduction || process.env.NEXT_PUBLIC_DEBUG_LOGS === "true";

export const debugLog = (...args: unknown[]) => {
  if (isDebugLoggingEnabled()) {
    console.log(...args);
  }
};

export const debugError = (...args: unknown[]) => {
  if (isDebugLoggingEnabled()) {
    console.error(...args);
  }
};
