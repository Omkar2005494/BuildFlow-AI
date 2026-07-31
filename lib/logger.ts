import pino from "pino";

// Configure pino for structured JSON logging in production
// and pretty-printing in development if pino-pretty is installed
export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        }
      : undefined,
  base: {
    env: process.env.NODE_ENV,
  },
});
