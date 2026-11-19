// Language-independent data. All translatable copy lives in src/i18n/dictionaries.
/** School photo from /public/images/school ("m8.JPG" -> "/images/school/m8.jpg"). */
export const img = (file: string) => `/images/school/${file.toLowerCase().replace(/\.(jpe?g)$/, "")}.jpg`;

/**
 * Stock photo from Unsplash (free licence, https://unsplash.com/license).
 * Used only for generic visuals; every photo of the school itself comes from img().
 */
export const stock = {
  reading: "photo-1632215861513-130b66fe97f4", // Emmanuel Ikwuegbu
  writing: "photo-1744809495173-217ca4faa8bc", // David Geneugelijk
  teacher: "photo-1744809482817-9a9d4fc280af", // David Geneugelijk
  graduate: "photo-1789699374188-95f08e9dd363", // Version Lens
  microscope: "photo-1766297248084-b32bacb4a1e4", // Chidera Faustina Okeke
  library: "photo-1524995997946-a1c2e315a42f", // Susan Q Yin
  student: "photo-1536337005238-94b997371b40", // Ben White
  classroom: "photo-1473649085228-583485e6e4d7", // Doug Linstedt
} as const;
export const stockUrl = (key: keyof typeof stock, w = 1600) =>
  `https://images.unsplash.com/${stock[key]}?auto=format&fit=crop&w=${w}&q=80`;

export const site = {
  name: "B&A Institute",
  fullName: "B & A Institute Education",
  founded: 2008,
  phones: {
    secondary: "+237 678 95 36 34",
    administration: "+237 699 94 41 35",
  },
  emails: {
    general: "info@ba-institute.edu",
    admissions: "admissions@ba-institute.edu",
    primary: "primary@ba-institute.edu",
    secondary: "secondary@ba-institute.edu",
    accounts: "accounts@ba-institute.edu",
  },
};

export type EmailKey = keyof typeof site.emails;

export const tel = (p: string) => `tel:${p.replace(/\s/g, "")}`;

export type SchoolEvent = {
  title: string;
  date: string; // ISO date
  start: string; // HH:MM
  end: string;
  place: string;
  category: string;
  body: string;
  image: string;
};

export type GalleryItem = { src: string; title: string; tag: string };
