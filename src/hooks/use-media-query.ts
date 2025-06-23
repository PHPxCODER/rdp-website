import { useEffect, useState } from "react";

/**
 * useMediaQuery - React hook to listen for CSS media query changes.
 * @param query - Media query string (e.g., "(min-width: 768px)")
 * @returns boolean - Whether the query currently matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== "undefined" && "matchMedia" in window) {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) {
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    // Handler for change events
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Listen for changes
    mediaQueryList.addEventListener("change", listener);

    // Set initial value in case it changed before effect ran
    setMatches(mediaQueryList.matches);

    // Cleanup
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}