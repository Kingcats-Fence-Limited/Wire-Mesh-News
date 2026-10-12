import type { StandardStatus } from "./content/types";

export const STATUS_TONE: Record<StandardStatus, "current" | "review" | "withdrawn" | "draft"> = { current: "current", under_review: "review", withdrawn: "withdrawn", draft: "draft" };
export const STATUS_LABEL: Record<StandardStatus, string> = { current: "Current", under_review: "Under review", withdrawn: "Withdrawn", draft: "Draft" };
