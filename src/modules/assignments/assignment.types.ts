export const ASSIGNMENT_FUNCTIONS = [
  "Pflegeleitung",
  "Hausverantwortung",
  "Tagesverantwortung",
  "Pflegedienst",
  "Springer",
  "Lernende",
  "Externe",
  "Andere",
] as const;

export type AssignedFunction = (typeof ASSIGNMENT_FUNCTIONS)[number];
