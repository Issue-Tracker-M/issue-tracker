import { MutableRefObject, useEffect, useRef } from "react";

/**
 * Returns a ref with current status of the component
 */
export const useIsMounted = (): MutableRefObject<boolean> => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};
