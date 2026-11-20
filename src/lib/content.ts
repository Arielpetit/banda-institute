// Language-independent data. All translatable copy lives in src/i18n/dictionaries.
/** School photo from /public/images/school ("m8.JPG" -> "/images/school/m8.jpg"). */
export const img = (file: string) => `/images/school/${file.toLowerCase().replace(/\.(jpe?g)$/, "")}.jpg`;

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
