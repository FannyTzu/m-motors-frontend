"use client";

import * as Sentry from "@sentry/nextjs";

type SentryContext = {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

export function useSentry() {
  const { logger } = Sentry;

  const captureException = (error: Error, context?: SentryContext) => {
    Sentry.captureException(error, {
      tags: context?.tags || {},
      extra: context?.extra || {},
    });
  };

  const captureMessage = (
    message: string,
    level?: "fatal" | "error" | "warning" | "info" | "debug"
  ) => {
    Sentry.captureMessage(message, level || "info");
  };

  const addBreadcrumb = (message: string, category?: string) => {
    Sentry.addBreadcrumb({
      message,
      category: category || "navigation",
      level: "info",
    });
  };

  const traceUIAction = <T>(
    name: string,
    fn: (span: ReturnType<typeof Sentry.startSpan>) => T
  ): T => {
    return Sentry.startSpan(
      {
        op: "ui.action",
        name,
      },
      fn
    );
  };

  const traceAPICall = async <T>(
    method: string,
    url: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    return Sentry.startSpan(
      {
        op: "http.client",
        name: `${method} ${url}`,
      },
      fn
    );
  };

  return {
    captureException,
    captureMessage,
    addBreadcrumb,
    traceUIAction,
    traceAPICall,
    logger,
  };
}
