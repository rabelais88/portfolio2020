import { useRef, useEffect } from 'react';

// https://gist.github.com/jaydenseric/a67cfb1b809b1b789daa17dfe6f83daa
function useIsMounted(): { current: boolean } {
  const componentIsMounted = useRef(true);
  useEffect(
    () => () => {
      componentIsMounted.current = false;
    },
    []
  );
  return componentIsMounted;
}

export default useIsMounted;
