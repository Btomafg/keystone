// hooks/use-on-click-outside.ts
import { RefObject, useEffect } from 'react';

type Event = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void,
  triggerRef?: RefObject<HTMLElement>, // Optional: Ref for the element that triggers the popover
): void {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      const triggerEl = triggerRef?.current;

      // Do nothing if clicking ref's element or descendent elements
      // Also do nothing if clicking the trigger element or its descendents
      if (!el || el.contains(event.target as Node) || (triggerEl && triggerEl.contains(event.target as Node))) {
        return;
      }

      handler(event); // Call the handler only if the click is outside
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
    // Add ref and handler to effect dependencies
    // It's generally safe to omit function handlers if declared outside the effect
    // or memoized, but including it ensures correctness if it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, handler, triggerRef]);
}
