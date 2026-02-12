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
      (error.message?.includes("identifiant") ||
        error.message?.includes("mot de passe") ||
        error.message?.includes("incorrect") ||
        error.message?.includes("Not authenticated") ||
        error.message?.includes("Enregistrement échoué") ||
        error.message?.match(/400|401|403|422/));

    if (!isBusinessError) {
      Sentry.captureException(error, {
        tags,
        extra,
      });
    }

    throw error;
  }
}
