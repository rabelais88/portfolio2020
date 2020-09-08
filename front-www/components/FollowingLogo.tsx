import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const FollowingLogo: React.FC = () => {
  const [mouse, setMouse] = useState([0, 0, false]);
  const [mx, my, isActive] = mouse;
  const logoX = useSpring(0);
  const logoY = useSpring(0);
  useEffect(() => {
    logoX.set(mx);
    logoY.set(my);
  }, [mx, my]);
  const logoStyle = {
    x: logoX,
    y: logoY,
  };
  return (
    <svg
      width="100%"
      onMouseOver={(e) => {
        console.log(e);
        // const { offsetTop, offsetLeft } = e.currentTarget;
        // setMouse([e.pageX - offsetLeft, e.pageY - offsetTop, true]);
      }}
      onMouseOut={(e) => {}}
    >
      <motion.image
        href="/memoji2.png"
        height="200"
        width="200"
        style={logoStyle}
      />
    </svg>
  );
};

export default FollowingLogo;
