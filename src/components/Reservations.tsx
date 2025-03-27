// Reservations.tsx
import { useEffect, useState } from "react";
import { fetchReservations, Reservation } from "../fetchData";

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState("All");
  const reservationsPerPage = 10;

  useEffect(() => {
    const getReservations = async () => {
      try {
        setIsLoading(true);
        const data = await fetchReservations();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getReservations();
  }, []);

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch = Object.values(res).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesSource = sourceFilter === "All" || res.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation
  );
  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="reservation-container">
      <div className="header-section">
        <h2 className="reservation-title">Reservations</h2>
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
              placeholder="Search reservations..."
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
        ) : currentReservations.length > 0 ? (
          <>
            <table className="reservation-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Source</th>
                  <th>Title</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Timing</th>
                  <th>Persons</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {currentReservations.map((res) => (
                  <tr key={res.id}>
                    <td>{res.id || "N/A"}</td>
                    <td>{res.source || "N/A"}</td>
                    {/* <td>{res.outlet.title || "N/A"}</td> */}
                    <td>{res.name || "N/A"}</td>
                    <td>{res.email || "N/A"}</td>
                    <td>{res.phone || "N/A"}</td>
                    <td>{res.date || "N/A"}</td>
                    <td>{res.timeSlot || "N/A"}</td>
                    <td>{res.timing || "N/A"}</td>
                    <td>{res.persons || "N/A"}</td>
                    <td>{res.createdAt ? new Date(res.createdAt).toLocaleString() : "N/A"}</td>
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
            <p>No reservations found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservations;