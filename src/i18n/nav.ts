export type NavLink = { href: string; label: string; desc?: string };

/** A plain link, or a group that opens a dropdown (desktop) / expands inline (mobile, footer). */
export type NavItem =
  | (NavLink & { children?: undefined })
  | { label: string; href?: undefined; children: (NavLink & { desc: string })[] };

/** Every link of the nav, with groups expanded. */
export const flattenNav = (items: NavItem[]): NavLink[] => items.flatMap<NavLink>((i) => (i.children ? i.children : [i]));
