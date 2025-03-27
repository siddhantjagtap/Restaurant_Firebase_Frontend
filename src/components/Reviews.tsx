// Reviews.tsx
import { useEffect, useState } from "react";
import { fetchReviews, Review } from "../fetchData";

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState("All");
  const reviewsPerPage = 10;

  useEffect(() => {
    const getReviews = async () => {
      try {
        setIsLoading(true);
        const data = await fetchReviews();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getReviews();
  }, []);

  // Filter reviews based on search term and source
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = Object.values(review).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesSource = sourceFilter === "All" || review.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  // Calculate pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="reviews-container">
      <div className="header-section">
        <h2 className="reviews-title">Reviews</h2>
        <div className="filter-search-container">
          <select
            value={sourceFilter}
            onChange={(e) => {
              setSourceFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="source-filter"
          >
            <option value="All">All Sources</option>
            <option value="Bo-Tai">Bo-Tai</option>
            <option value="Swan">Swan</option>
          </select>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : currentReviews.length > 0 ? (
          <>
            <table className="reviews-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Source</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>DOB</th>
                  <th>Comment</th>
                  <th>Rating</th>
                  <th>Anniversary</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.id || "N/A"}</td>
                    <td>{review.source || "N/A"}</td>
                    <td>{review.name || "N/A"}</td>
                    <td>{review.email || "N/A"}</td>
                    <td>{review.mobile || "N/A"}</td>
                    <td>{review.dob || "N/A"}</td>
                    <td className="comment-cell">{review.comment || "N/A"}</td>
                    <td>{review.rating || "N/A"}</td>
                    <td>{review.anniversary || "N/A"}</td>
                    <td>{review.createdAt ? new Date(review.createdAt).toLocaleString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;