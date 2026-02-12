import * as Sentry from "@sentry/nextjs";

export function addBreadcrumb(
  message: string,
  category: string = "navigation"
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level: "info",
  });
}
