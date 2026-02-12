"use client";

import * as Sentry from "@sentry/nextjs";

type CatchAsyncOptions = {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  ignoreBusinessErrors?: boolean;
};

export async function catchAsync<T>(
  fn: () => Promise<T>,
  options: CatchAsyncOptions = {}
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const { tags = {}, extra = {}, ignoreBusinessErrors = true } = options;

    const isBusinessError =
      ignoreBusinessErrors &&
      error instanceof Error &&
      error.message?.includes("400|401");

    if (!isBusinessError) {
      Sentry.captureException(error, {
        tags,
        extra,
      });
    }

    throw error;
  }
}
