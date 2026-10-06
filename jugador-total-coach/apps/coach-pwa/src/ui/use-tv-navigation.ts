import { useEffect } from 'react';
import type { RefObject } from 'react';

/** Ordered remote navigation; editing and native media retain their own arrow behavior. */
export function useTvNavigation(
  root: RefObject<HTMLElement | null>,
  enabled: boolean,
  exit: () => void,
) {
  useEffect(() => {
    const host = root.current;
    if (!host || !enabled) return;
    function keydown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (target && target !== document.body && !host!.contains(target)) return;
      const editing =
        !!target &&
        (target.matches('input, select, textarea, video, audio, iframe') ||
          target.isContentEditable);
      const leaveField = editing && event.key === 'Escape' && !document.fullscreenElement;
      const leaveSelect =
        target?.matches('select') && ['ArrowLeft', 'ArrowRight'].includes(event.key);
      if (editing && !leaveField && !leaveSelect) return;
      if (event.key === 'Escape' && !editing) {
        event.preventDefault();
        exit();
        return;
      }
      if (event.key === 'MediaPlayPause') {
        const action = host!.querySelector<HTMLButtonElement>(
          '[data-playback-toggle]:not(:disabled)',
        );
        if (action) {
          event.preventDefault();
          action.click();
        }
        return;
      }
      if (
        !leaveField &&
        !['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)
      )
        return;
      const controls = Array.from(
        host!.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, summary, video[controls], [tabindex="0"]',
        ),
      ).filter((node) => {
        const rect = node.getBoundingClientRect();
        return (
          !node.matches(':disabled') &&
          node.getAttribute('aria-disabled') !== 'true' &&
          node.tabIndex >= 0 &&
          rect.width > 0 &&
          rect.height > 0 &&
          getComputedStyle(node).visibility !== 'hidden'
        );
      });
      if (!controls.length) return;
      const current = controls.indexOf(document.activeElement as HTMLElement);
      const step = leaveField || ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1;
      const next =
        current < 0 ? 0 : Math.max(0, Math.min(controls.length - 1, current + step));
      event.preventDefault();
      controls[next]!.focus({ preventScroll: true });
      controls[next]!.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, [root, enabled, exit]);
}
