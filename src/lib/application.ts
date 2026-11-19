// Shared by the application wizard (client) and the submit action (server).

export const SECTIONS = ["anglophone", "francophone"] as const;
export type Section = (typeof SECTIONS)[number];

/** Class names are proper names in each sub-system, so they are not translated. */
export const LEVELS: Record<Section, { value: string; secondary: boolean }[]> = {
  anglophone: [
    ...["Day Care", "Pre-Nursery", "Nursery 1", "Nursery 2", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"].map(
      (value) => ({ value, secondary: false }),
    ),
    ...["Form 1", "Form 2", "Form 3", "Form 4", "Form 5", "Lower Sixth", "Upper Sixth"].map((value) => ({ value, secondary: true })),
  ],
  francophone: [
    ...["Crèche", "Pré-maternelle", "Petite section", "Grande section", "SIL", "CP", "CE1", "CE2", "CM1", "CM2"].map((value) => ({
      value,
      secondary: false,
    })),
    ...["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"].map((value) => ({ value, secondary: true })),
  ],
};

export const PATHWAYS = ["general", "technical", "commercial"] as const;
export const TERMS = ["2026-09", "2027-01", "2027-04"] as const;
export const GENDERS = ["female", "male"] as const;
export const RELATIONSHIPS = ["mother", "father", "guardian", "other"] as const;

export const DOCUMENTS = [
  { key: "birthCertificate", required: true },
  { key: "reportCard", required: false },
  { key: "photo", required: false },
] as const;
export type DocumentKey = (typeof DOCUMENTS)[number]["key"];

export const MAX_FILE_BYTES = 3 * 1024 * 1024;
export const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export type ApplicationData = {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  nationality: string;
  currentSchool: string;
  currentClass: string;
  section: string;
  level: string;
  pathway: string;
  term: string;
  guardianName: string;
  relationship: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  notes: string;
  consent: string;
};

export const emptyApplication: ApplicationData = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  nationality: "",
  currentSchool: "",
  currentClass: "",
  section: "",
  level: "",
  pathway: "",
  term: "",
  guardianName: "",
  relationship: "",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  notes: "",
  consent: "",
};

export type ErrorCode = "required" | "email" | "phone" | "date" | "file" | "fileSize" | "fileType";
export type Errors = Partial<Record<keyof ApplicationData | DocumentKey, ErrorCode>>;

export const STEP_FIELDS: (keyof ApplicationData | DocumentKey)[][] = [
  ["firstName", "lastName", "dob", "gender", "nationality", "currentSchool", "currentClass"],
  ["section", "level", "pathway", "term"],
  ["guardianName", "relationship", "phone", "whatsapp", "email", "address", "notes"],
  ["birthCertificate", "reportCard", "photo"],
  ["consent"],
];

export const isSecondary = (section: string, level: string) =>
  LEVELS[section as Section]?.find((l) => l.value === level)?.secondary ?? false;

type FileLike = { size: number; type: string } | null | undefined;

/** Validates every field (or only those of one step). Returns an empty object when valid. */
export function validate(
  d: ApplicationData,
  files: Partial<Record<DocumentKey, FileLike>>,
  only?: (keyof ApplicationData | DocumentKey)[],
): Errors {
  const e: Errors = {};
  const need = (k: keyof ApplicationData) => {
    if (!d[k]?.trim()) e[k] = "required";
  };
  ["firstName", "lastName", "dob", "gender", "section", "level", "term", "guardianName", "relationship", "phone", "email", "address"].forEach(
    (k) => need(k as keyof ApplicationData),
  );

  if (d.dob) {
    const date = new Date(d.dob);
    const age = (Date.UTC(2026, 8, 1) - date.getTime()) / 3.15576e10;
    if (Number.isNaN(date.getTime()) || age < 0.5 || age > 25) e.dob = "date";
  }
  if (d.section && !SECTIONS.includes(d.section as Section)) e.section = "required";
  if (d.section && d.level && !LEVELS[d.section as Section]?.some((l) => l.value === d.level)) e.level = "required";
  if (isSecondary(d.section, d.level) && !PATHWAYS.includes(d.pathway as (typeof PATHWAYS)[number])) e.pathway = "required";
  if (d.term && !TERMS.includes(d.term as (typeof TERMS)[number])) e.term = "required";
  if (d.gender && !GENDERS.includes(d.gender as (typeof GENDERS)[number])) e.gender = "required";
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = "email";
  for (const k of ["phone", "whatsapp"] as const) {
    if (d[k] && d[k].replace(/\D/g, "").length < 8) e[k] = "phone";
  }
  if (d.consent !== "yes") e.consent = "required";

  for (const doc of DOCUMENTS) {
    const f = files[doc.key];
    if (!f || f.size === 0) {
      if (doc.required) e[doc.key] = "file";
    } else if (f.size > MAX_FILE_BYTES) e[doc.key] = "fileSize";
    else if (!ACCEPTED_TYPES.includes(f.type)) e[doc.key] = "fileType";
  }

  if (!only) return e;
  return Object.fromEntries(Object.entries(e).filter(([k]) => only.includes(k as keyof ApplicationData))) as Errors;
}
