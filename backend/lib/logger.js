const redact = (value) => {
  if (!value || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    return value.map(redact);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => {
      if (/(password|token|secret|authorization|signature|email|phone)/i.test(key)) {
        return [key, '[redacted]'];
      }
      return [key, redact(entry)];
    })
  );
};

export const logInfo = (event, context = {}) => {
  console.info(JSON.stringify({
    level: 'info',
    event,
    timestamp: new Date().toISOString(),
    ...redact(context),
  }));
};

export const logError = (event, error, context = {}) => {
  console.error(JSON.stringify({
    level: 'error',
    event,
    timestamp: new Date().toISOString(),
    message: error?.message,
    stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    ...redact(context),
  }));
};
