import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { setSize, move } from 'd3-quicktool';
import { tag } from 'types/tag';
import checkClient from '../lib/checkClient';
import Logger from '../lib/logger';

interface TagVizProps {
  tags: tag[];
  barHeight?: number;
  textMargin?: number;
  marginX?: number;
  marginY?: number;
  threshold?: number;
  onMouseEnter?: (tag: tag) => void;
  onMouseLeave?: (tag: tag) => void;
  onMouseClick?: (tag: tag) => void;
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

const logger = new Logger('components/TagViz.tsx');

const drawDot = (dotRadius) => {
  return function (d, i, e) {
    for (let di = 0; di < d.articleCount; di += 1) {
      d3.select(this)
        .append('circle')
        .attr('r', dotRadius / 2)
        .attr('fill', 'gray')
        .call(move, () => [dotRadius * di + dotRadius / 2, dotRadius / 2]);
    }
  };
};

const TagViz: React.FunctionComponent<TagVizProps> = (props) => {
  const { tags, threshold, onMouseEnter, onMouseLeave, onMouseClick } = props;
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [viewWidth, setViewWidth] = useState(100);

  useEffect(() => {
    const handleResize = () => {
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
    const _tags = tags.sort((a, b) => b.articleCount - a.articleCount);
    const countMax = d3.max(tags, (d) => d.articleCount);
    const countMin = d3.min(tags, (d) => d.articleCount);
    const limitX = config.width - config.marginX * 2 - config.textMargin;
    const scaleX = d3
      .scaleLinear()
      .domain([countMin, countMax])
      .range([0, limitX > 0 ? limitX : 100]); // prevent minus width

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
        .attr('fill', 'gray');

    const forLargeData = (el) =>
      el
        .filter((d) => d.articleCount >= threshold)
        .append('rect')
        .call(updateLargeDataCoord);

    const dotRadius = scaleY.bandwidth();
    const forSmallData = (el) =>
      el.filter((d) => d.articleCount < threshold).each(drawDot(dotRadius));

    const addLabel = (el) =>
      el
        .append('text')
        .text((d) => `${d.tag}(${d.articleCount})`)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'hanging')
        .attr('font-size', '14px')
        .attr('font-family', 'sans-serif');

    const addHitBox = (el) =>
      el
        .append('rect')
        .attr('class', 'hitbox')
        .attr('opacity', 0)
        .attr('height', () => scaleY.bandwidth())
        .attr('width', () => scaleX(countMax))
        .on('mouseenter', onMouseEnter)
        .on('mouseleave', onMouseLeave)
        .on('click', onMouseClick);

    const enterData = (el) =>
      el
        .append('g')
        .attr('class', 'tag-node')
        .attr('data-tag', (d) => d.tag)
        .call(move, (_, i) => [config.textMargin, scaleY(i)])
        .call(addLabel)
        .call(forLargeData)
        .call(forSmallData)
        .call(addHitBox);

    const updateHitBox = (el) =>
      el.select('.hitbox').attr('width', () => scaleX(countMax));

    const updateData = (el) =>
      el
        .filter((d) => d.articleCount >= threshold)
        .call(updateHitBox)
        .select('rect')
        .call(updateLargeDataCoord);

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
  textMargin: 130,
  barHeight: 15,
  threshold: 4,
  onMouseEnter: (_tag: tag) => {
    logger.log('onMouseEnter', _tag);
  },
  onMouseLeave: (_tag: tag) => {
    logger.log('onMouseLeave', _tag);
  },
  onMouseClick: (_tag: tag) => {
    logger.log('onMouseClick', _tag);
  },
};

export default TagViz;
