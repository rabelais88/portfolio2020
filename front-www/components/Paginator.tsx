/* eslint-disable react/prop-types */
import React from 'react';

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
  const clipping = 10;
  const pages = Array.from({ length: pageLength })
    .map((_, i) => i + 1)
    .filter((i) => i + clipping > page && i - clipping < page);
  const pageClipped = pages.length < pageLength;

  const _onPageClick = (pageNum) => () => onPageClick(pageNum);

  return (
    <div className="paginator">
      {pageClipped && page > clipping && (
        <button type="button" onClick={_onPageClick(1)}>
          to 1
        </button>
      )}
      {pages.map((pageNum) =>
        pageNum === page ? (
          <span key={pageNum.toString()} className="active">
            {pageNum}
          </span>
        ) : (
          <button
            type="button"
            key={pageNum.toString()}
            onClick={_onPageClick(pageNum)}
          >
            {pageNum}
          </button>
        )
      )}
      {pageClipped && page < pageLength - clipping && (
        <button type="button" onClick={_onPageClick(pageLength)}>
          to end
        </button>
      )}
    </div>
  );
};

export default Paginator;
