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
      // 페이지가 10개 미만이면 → 첫 페이지로
      onPageChange(0);
    } else if (startPage > 0) {
      // 10개 단위 블록 이동
      onPageChange(startPage - 1);
    }
  };

  const handleNext = () => {
    if (totalPages <= BLOCK_SIZE) {
      // 페이지가 10개 미만이면 → 마지막 페이지로
      onPageChange(totalPages - 1);
    } else if (endPage < totalPages - 1) {
      // 10개 단위 블록 이동
      onPageChange(endPage + 1);
    }
  };

  return (
    <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
      <button onClick={handlePrev} disabled={currentPage === 0}>
        ⬅️ 이전
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={currentPage === page}
          style={{
            fontWeight: currentPage === page ? "bold" : "normal",
          }}
        >
          {page + 1}
        </button>
      ))}

      <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
        다음 ➡️
      </button>
    </div>
  );
};

export default BoardPagination;
