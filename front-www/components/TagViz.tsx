import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { setSize, ttrans } from 'd3-quicktool';
import { tag } from 'types/tag';

interface TagVizProps {
  tags: tag[];
  barHeight?: number;
  textMargin?: number;
  marginX?: number;
  marginY?: number;
}

interface getConfigArgs extends TagVizProps {
  width: number;
}

const getConfig = ({
  tags,
  width,
  barHeight,
  marginX,
  marginY,
  textMargin,
}: getConfigArgs) => ({
  width,
  height: tags.length * barHeight + marginY * 2,
  marginX,
  marginY,
  textMargin,
  barHeight,
});

const TagViz: React.FunctionComponent<TagVizProps> = (props) => {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState(null);
  const [config, setConfig] = useState(getConfig({ ...props, width: 500 }));
  useEffect(() => {
    const elContainer = containerRef.current || {};
    setConfig(getConfig({ ...props, width: elContainer.offsetWidth || 0 }));
  }, [props]);
  useEffect(() => {
    // when component is mounted
    if (!svg) {
      const _svg = d3.select('#tagViz').append('svg');
      setSvg(_svg);
    }
  }, [containerRef.current]);
  if (svg) {
    svg.call(setSize, config.width, config.height);
  }
  return (
    <div ref={containerRef} id="tagViz">
      &nbsp;
    </div>
  );
};

TagViz.defaultProps = {
  marginX: 5,
  marginY: 5,
  textMargin: 100,
  barHeight: 10,
};

export default TagViz;
