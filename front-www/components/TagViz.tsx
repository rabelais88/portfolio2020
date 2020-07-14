import Logger from 'lib/logger';
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { setSize, move } from 'd3-quicktool';
import { tag } from 'types/tag';
import checkClient from 'lib/checkClient';

const logger = new Logger('components/TagViz.tsx');

interface TagVizProps {
  tags: tag[];
  barHeight?: number;
  textMargin?: number;
  marginX?: number;
  marginY?: number;
  threshold?: number;
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
  threshold,
}: getConfigArgs) => ({
  width,
  height: tags.length * barHeight + marginY * 2,
  marginX,
  marginY,
  textMargin,
  barHeight,
  threshold,
});

const drawDot = (dotRadius) => {
  return function (d, i, e) {
    for (let di = 0; di < d.articleCount; di += 1) {
      d3.select(this)
        .append('circle')
        .attr('r', dotRadius / 2)
        .attr('fill', 'red')
        .call(move, () => [dotRadius * di + dotRadius / 2, dotRadius / 2]);
    }
  };
};

const TagViz: React.FunctionComponent<TagVizProps> = (props) => {
  const { tags, threshold } = props;
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [viewWidth, setViewWidth] = useState(100);

  useEffect(() => {
    const handleResize = () => {
      logger.log(containerRef.current.offsetWidth);
      setViewWidth(containerRef.current.offsetWidth);
    };
    if (checkClient() && svgRef.current && containerRef.current) {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
  }, [svgRef.current, containerRef.current]);
  useEffect(() => {
    const elContainer = svgRef.current || {};
    const config = getConfig({
      ...props,
      width: viewWidth,
    });
    // when component is mounted
    const svg = d3.select(elContainer);
    logger.log('updating', { width: config.width });
    const _tags = tags.sort((a, b) => b.articleCount - a.articleCount);
    const countMax = d3.max(tags, (d) => d.articleCount);
    const countMin = d3.min(tags, (d) => d.articleCount);
    const scaleX = d3
      .scaleLinear()
      .domain([countMin, countMax])
      .range([0, config.width - config.marginX * 2]);

    const scaleY = d3
      .scaleBand<number>()
      .domain(_tags.map((_, i) => i))
      .range([0, config.height])
      .paddingInner(0.2);
    // changing config triggers redrawing
    svg.call(setSize, config.width, config.height);

    const updateLargeDataCoord = (el) =>
      el
        .attr('width', (d) => scaleX(d.articleCount))
        .attr('height', (d) => scaleY.bandwidth())
        .attr('fill', 'black');

    const forLargeData = (el) =>
      el
        .filter((d) => d.articleCount >= threshold)
        .append('rect')
        .call(updateLargeDataCoord);

    const dotRadius = scaleY.step();
    const forSmallData = (el) =>
      el.filter((d) => d.articleCount < threshold).each(drawDot(dotRadius));

    const enterData = (el) =>
      el
        .append('g')
        .attr('class', 'tag-node')
        .call(move, (_, i) => [0, scaleY(i)])
        .call(forLargeData)
        .call(forSmallData);

    const updateData = (el) =>
      el
        .filter((d) => d.articleCount >= threshold)
        .select('rect')
        .call(updateLargeDataCoord)
        .attr('data-test', (d, i, e) => {
          logger.log(e);
        });

    const exitData = (el) => el.remove();

    svg
      .selectAll('.tag-node')
      .data(_tags, (d: tag) => d.tag)
      .join(enterData, updateData, exitData);
  }, [svgRef.current, props, viewWidth]);

  return (
    <div ref={containerRef}>
      <svg ref={svgRef} id="tagViz" />
    </div>
  );
};

TagViz.defaultProps = {
  marginX: 5,
  marginY: 5,
  textMargin: 100,
  barHeight: 10,
  threshold: 3,
};

export default TagViz;
