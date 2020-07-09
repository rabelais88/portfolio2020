/* eslint-disable react/prop-types */
import React from 'react';
import { Button, ButtonGroup } from '@chakra-ui/core';

type PaginatorProps = {
  count: number;
  size: number;
  page: number;
  onPageClick: (page: number) => void;
};

const Paginator: React.FunctionComponent<PaginatorProps> = (props) => {
  const { count, size, page, onPageClick } = props;
  if (count < 0) throw Error('props.count is smaller than 0');
  const pageLength = Math.round(count / size);
  const clipping = 5;
  const pages = Array.from({ length: pageLength })
    .map((_, i) => i + 1)
    .filter((i) => i + clipping > page && i - clipping < page);
  const pageClipped = pages.length < pageLength;

  const _onPageClick = (pageNum) => () => onPageClick(pageNum);

  return (
    <div className="paginator">
      <ButtonGroup spacing={2}>
        {pageClipped && page > clipping && (
          <Button size="sm" onClick={_onPageClick(1)} variant="ghost">
            back
          </Button>
        )}
        {pages.map((pageNum) =>
          pageNum === page ? (
            <Button
              key={pageNum.toString()}
              size="sm"
              isDisabled
              variant="ghost"
            >
              {pageNum}
            </Button>
          ) : (
            <Button
              size="sm"
              key={pageNum.toString()}
              onClick={_onPageClick(pageNum)}
              variant="ghost"
            >
              {pageNum}
            </Button>
          )
        )}
        {pageClipped && page < pageLength - clipping && (
          <Button size="sm" onClick={_onPageClick(pageLength)} variant="ghost">
            end
          </Button>
        )}
      </ButtonGroup>
    </div>
  );
};

export default Paginator;
