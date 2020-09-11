import React, { useState, SVGAttributes, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// https://stackoverflow.com/questions/40731352/extending-html-elements-in-react-and-typescript-while-preserving-props
type FollowingLogoProps = SVGAttributes<SVGElement>;

const FollowingLogo: React.FC<FollowingLogoProps> = (props) => {
  const [mouse, setMouse] = useState<[number, number, boolean]>([0, 0, false]);
  const [mx, my, isActive] = mouse;
  const svgRef = useRef(null);

  const logoWidth = 200;
  const logoHeight = 200;

  function getMouseCoordSVG(e): { x: number; y: number } {
    const svg = svgRef.current;
    const p = svg.createSVGPoint();
    p.x = e.clientX;
    p.y = e.clientY;
    const ctm = svg.getScreenCTM().inverse();
    return p.matrixTransform(ctm);
  }

  const getSvgSize = () => {
    const svgBox = svgRef.current.getBoundingClientRect();
    return [svgBox.width, svgBox.height];
  };

  const onMouseMove = (e) => {
    const { x, y } = getMouseCoordSVG(e);
    const [w, h] = getSvgSize();
    const minX = 0;
    const minY = 0;
    const maxX = w - logoWidth;
    const maxY = h - logoHeight;
    const _x = x - logoWidth / 2;
    const _y = y - logoWidth / 2;
    setMouse([
      Math.min(Math.max(_x, minX), maxX),
      Math.min(Math.max(_y, minY), maxY),
      true,
    ]);
  };

  const onMouseOut = () => {
    const [w, h] = getSvgSize();
    setMouse([w / 2 - logoWidth / 2, h / 2 - logoHeight / 2, false]);
  };

  useEffect(() => {
    onMouseOut();
  }, [svgRef.current]);

  return (
    <svg {...props} ref={svgRef}>
      <motion.image
        href="/memoji2.png"
        height={logoHeight}
        width={logoWidth}
        animate={{
          x: mx,
          y: my,
        }}
      />
      <rect
        width="100%"
        height="100%"
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}
        opacity="0"
      />
    </svg>
  );
};

export default FollowingLogo;
