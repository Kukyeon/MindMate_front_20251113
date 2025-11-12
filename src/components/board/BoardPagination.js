import "./BoardPagination.css";

const BoardPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const BLOCK_SIZE = 10;
  const currentBlock = Math.floor(currentPage / BLOCK_SIZE);
  const startPage = currentBlock * BLOCK_SIZE;
  const endPage = Math.min(startPage + BLOCK_SIZE - 1, totalPages - 1);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePrev = () => {
    if (totalPages <= BLOCK_SIZE) {
      onPageChange(0);
    } else if (startPage > 0) {
      onPageChange(startPage - 1);
    }
  };

  const handleNext = () => {
    if (totalPages <= BLOCK_SIZE) {
      onPageChange(totalPages - 1);
    } else if (endPage < totalPages - 1) {
      onPageChange(endPage + 1);
    }
  };

  return (
    <div className="board-pagination">
      <button onClick={handlePrev} disabled={currentPage === 0}>
        ◀ 이전
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? "active" : ""}
        >
          {page + 1}
        </button>
      ))}

      <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
        다음 ▶
      </button>
    </div>
  );
};

export default BoardPagination;
