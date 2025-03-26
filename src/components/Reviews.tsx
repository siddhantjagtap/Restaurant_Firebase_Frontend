import { useEffect, useState } from "react";
import { fetchReviews, Review } from "../fetchData";

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Reviews</h2>

      <div className="table-wrapper">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : reviews.length > 0 ? (
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
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.id || "N/A"}</td>
                  <td>{review.source || "N/A"}</td>
                  <td>{review.name || "N/A"}</td>
                  <td>{review.email || "N/A"}</td>
                  <td>{review.mobile || "N/A"}</td>
                  <td>{review.dob || "N/A"}</td>
                  <td>{review.comment || "N/A"}</td>
                  <td>{review.rating || "N/A"}</td>
                  <td>{review.anniversary || "N/A"}</td>
                  <td>{review.createdAt ? new Date(review.createdAt).toLocaleString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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