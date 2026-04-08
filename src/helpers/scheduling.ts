export function scheduleIdle(callback: () => void): void {
  const schedule =
    typeof window !== 'undefined' && 'requestIdleCallback' in window
      ? requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 200);
  schedule(callback);
}
