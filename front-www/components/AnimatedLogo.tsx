import React, { useEffect, useRef } from 'react';
import { motion, useCycle } from 'framer-motion';

const memojis = [
  '/memoji1.png',
  '/memoji2.png',
  '/memoji3.png',
  '/memoji4.png',
  '/memoji5.png',
];

interface memojiProp {
  width?: number | string;
  height?: number | string;
}

const AnimatedLogo: React.FC<memojiProp> = ({ width, height }) => {
  const [currentUrl, nextCycle] = useCycle(...memojis);
  const refContainer = useRef(null);

  const variants = {
    show: {
      opacity: 1,
      scale: 1,
    },
    hide: {
      scale: 0,
      opacity: 0,
    },
  };

  useEffect(() => {
    if (refContainer.current) {
      setInterval(() => {
        nextCycle();
      }, 2000);
    }
  }, [refContainer.current]);

  return (
    <>
      <div ref={refContainer} />
      {memojis.map((url) => {
        return (
          <motion.img
            width={width || '200px'}
            height={height || '200px'}
            src={url}
            key={url}
            style={{
              x: 0,
              y: 0,
              position: 'absolute',
              // WebkitFilter: 'drop-shadow(5px 5px 5px #222)',
              // filter: 'drop-shadow(5px 5px 5px #222)',
            }}
            animate={url === currentUrl ? 'show' : 'hide'}
            variants={variants}
          />
        );
      })}
    </>
  );
};

export default AnimatedLogo;
