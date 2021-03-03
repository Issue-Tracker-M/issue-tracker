import { useEffect, useState } from "react";

interface useTimeoutReturn {
  /**
   * Starts timeout with the given callback
   */
  startTimeout: () => void;
  /**
   * Clears existing timeout
   */
  clearTimeout: () => void;
  /**
   * Shows if there's currently an active timeout.
   */
  timeoutActive: boolean;
}

/**
 *
 * @param callback callback to invoke after timeout
 * @param timeoutInMs - time in ms after which to invoke the callback
 */
export const useTimeout = (
  callback: () => void,
  timeoutInMs = 0
): useTimeoutReturn => {
  const [timeoutActive, setTimeoutActive] = useState(false);
  const startTimeout = () => setTimeoutActive(true);
  const clearTimeout = () => setTimeoutActive(false);
  useEffect(() => {
    if (timeoutActive) {
      const t = setTimeout(callback, timeoutInMs);
      return () => {
        window.clearTimeout(t);
      };
    }
  }, [callback, timeoutInMs, timeoutActive]);
  return { startTimeout, clearTimeout, timeoutActive };
};
