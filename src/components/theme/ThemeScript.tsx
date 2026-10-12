/**
 * Applies the stored theme before first paint to avoid a flash.
 * Stored value: localStorage "wmn-theme" = "light" | "dark"; otherwise system.
 * The footer toggle (ThemeToggle) writes the same key.
 */
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('wmn-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
