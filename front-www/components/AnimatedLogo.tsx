import React, { useState } from 'react';
import { motion, AnimatePresence, useCycle } from 'framer-motion';

const memojis = [
  '/memoji1.png',
  '/memoji2.png',
  '/memoji3.png',
  '/memoji4.png',
  '/memoji5.png'
];

interface memojiProp {
  width?: number | string;
  height?: number | string;
}

const getRandom = (max) => Math.round(Math.random() * max);

const AnimatedLogo: React.FC<memojiProp> = ({ width, height }) => {
  const [url, nextCycle] = useCycle(...memojis);

  return (
    <AnimatePresence>
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
        transition={{ duration: 1.3, delay: 1.3 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        onAnimationComplete={() => nextCycle()}
      />
    </AnimatePresence>
  );
};

export default AnimatedLogo;
