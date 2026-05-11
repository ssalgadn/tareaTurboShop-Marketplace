export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="pagination-container">
      <button 
        className="page-btn"
        disabled={currentPage === 1} 
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Anterior
      </button>

      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`dots-${index}`} className="page-dots">...</span>
        ) : (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        )
      ))}

      <button 
        className="page-btn"
        disabled={currentPage === totalPages} 
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Siguiente
      </button>
    </div>
  );
}