import { useRef, useEffect } from 'react';

type Callback = () => void;

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(callback: Callback, delay: number) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
