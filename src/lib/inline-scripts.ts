// Inline scripts that run in <head> before first paint (plain strings, safe to import on the server).

/** Applies the saved or system theme so the page never flashes the wrong one. */
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;

/** Marks the first visit of a session so the intro animation shows only once. */
export const introScript = `(function(){try{if(!sessionStorage.getItem("intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.intro="1"}}catch(e){}})();`;
