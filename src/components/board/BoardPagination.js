const BoardPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages === 0) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);
  return (
    <div>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={currentPage === page}
        >
          {page + 1}
        </button>
      ))}
    </div>
  );
};
export default BoardPagination;
