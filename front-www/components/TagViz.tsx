import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { tag } from 'types/tag';

interface TagVizProps {
  tags: tag[];
}

const TagViz: React.FunctionComponent<TagVizProps> = (props) => {
  const containerRef = useRef(null);
  useEffect(() => {
    // when component is mounted
    d3.select('#tagViz')
      .append('svg')
      .style('background-color', 'red')
      .attr('width', 100)
      .attr('height', 100);
  }, [containerRef.current]);
  return (
    <div ref={containerRef} id="tagViz">
      &nbsp;
    </div>
  );
};

export default TagViz;
