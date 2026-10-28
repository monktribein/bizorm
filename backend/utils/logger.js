export const sanitizeData = (data) => {
  if (!data) return data;
  if (typeof data === "string") {
    // Scrub sensitive tokens/passwords
    return data.replace(/(password|token|secret|actKey)=([^\s&]+)/gi, "$1=[REDACTED]");
  }
  if (typeof data === "object") {
    const copy = Array.isArray(data) ? [...data] : { ...data };
    for (const key of Object.keys(copy)) {
      if (/password|secret|token|actKey|cardId/i.test(key)) {
        copy[key] = "[REDACTED]";
      } else if (typeof copy[key] === "object") {
        copy[key] = sanitizeData(copy[key]);
      }
    }
    return copy;
  }
  return data;
};

export const logger = {
  info: (msg, meta = "") => {
    console.log(`[INFO] [${new Date().toISOString()}] ${msg}`, meta ? sanitizeData(meta) : "");
  },
  warn: (msg, meta = "") => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${msg}`, meta ? sanitizeData(meta) : "");
  },
  error: (msg, meta = "") => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${msg}`, meta ? sanitizeData(meta) : "");
  },
};
