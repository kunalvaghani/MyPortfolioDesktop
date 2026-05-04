import { useEffect, useState } from 'react';

/**
 * A small hook that synchronises a piece of state with
 * sessionStorage. When a component mounts, it will attempt to read
 * the initial value from the browser's sessionStorage. On every
 * subsequent update, the new value will be serialised back to
 * sessionStorage. If sessionStorage is unavailable (e.g. during
 * server‑side rendering), the default value will be returned.
 *
 * @param key The key under which to persist the value
 * @param defaultValue The value used if nothing is stored yet
 */
export function useSessionStorage<T>(
  key: string,
  defaultValue?: T,
): [T | undefined, (value: T | undefined) => void] {
  const [value, setValue] = useState<T | undefined>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = window.sessionStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (value === undefined) {
        window.sessionStorage.removeItem(key);
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // Ignore write errors (e.g. quota exceeded)
    }
  }, [key, value]);

  return [value, setValue];
}