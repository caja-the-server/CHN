import { z } from "zod";

export type SelfIssue = {
  errorMessage: string;
};

export type ChildrenIssue<T> = {
  fieldErrors: {
    [K in keyof T]: IssueDetails<T[K]>;
  };
};

export type IssueDetails<T> =
  | SelfIssue
  | ChildrenIssue<T>
  | (SelfIssue & ChildrenIssue<T>);

export function extractIssue<T>(
  error: z.ZodError<T>
): IssueDetails<T> | undefined {
  const issues = error.issues;
  if (issues.length === 0) {
    return undefined;
  }

  let details: any = {};
  for (const issue of error.issues) {
    let current = details;
    for (const key of issue.path) {
      current.fieldErrors ??= {};
      if (!(key in current.fieldErrors)) {
        current.fieldErrors[key] = {};
      }
      current = current.fieldErrors[key];
    }
    current.errorMessage ??= issue.message;
  }
  return details;
}
