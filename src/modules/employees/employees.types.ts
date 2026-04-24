export const BASE_QUALIFICATIONS = [
  "DIPL_PFLEGE",
  "FAGE",
  "AGS",
  "PFLEGEHILFE",
  "LEARNER",
  "EXTERNAL",
  "OTHER",
] as const;

export type BaseQualification = (typeof BASE_QUALIFICATIONS)[number];
