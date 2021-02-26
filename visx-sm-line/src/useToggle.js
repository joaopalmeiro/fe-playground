import { useState, useCallback } from 'react';

// Source: https://www.joshwcomeau.com/snippets/react-hooks/use-toggle/
export default function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  // `useCallback()` in order to preserve the reference to the setter function.
  // Without this wrapper, the toggle function would be recreated on every render.
  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  return [value, toggle];
}
