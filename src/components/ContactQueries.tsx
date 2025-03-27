// ContactQueries.tsx
import { useEffect, useState } from "react";
import { fetchContactQueries, ContactQuery } from "../fetchData";

const ContactQueries: React.FC = () => {
  const [contactQueries, setContactQueries] = useState<ContactQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState("All");
  const queriesPerPage = 10;

  useEffect(() => {
    const getContactQueries = async () => {
      try {
        setIsLoading(true);
        const data = await fetchContactQueries();
        setContactQueries(data);
      } catch (error) {
        console.error("Error fetching contact queries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getContactQueries();
  }, []);

  const filteredQueries = contactQueries.filter((query) => {
    const matchesSearch = Object.values(query).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesSource = sourceFilter === "All" || query.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const indexOfLastQuery = currentPage * queriesPerPage;
  const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
  const currentQueries = filteredQueries.slice(
    indexOfFirstQuery,
    indexOfLastQuery
  );
  const totalPages = Math.ceil(filteredQueries.length / queriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="contact-queries-container">
      <div className="header-section">
        <h2 className="contact-queries-title">Contact Queries</h2>
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
              placeholder="Search queries..."
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
        ) : currentQueries.length > 0 ? (
          <>
            <table className="contact-queries-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Source</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Note</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentQueries.map((query) => (
                  <tr key={query.id}>
                    <td>{query.id || "N/A"}</td>
                    <td>{query.source || "N/A"}</td>
                    <td>{query.fullName || "N/A"}</td>
                    <td>{query.email || "N/A"}</td>
                    <td className="comment-cell">{query.notes || "N/A"}</td>
                    <td>
                      {query.createdAt ? new Date(Number(query.createdAt)).toLocaleString() : "N/A"}
                    </td>
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
            <p>No contact queries found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactQueries;