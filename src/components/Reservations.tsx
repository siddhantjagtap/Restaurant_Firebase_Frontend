import { useEffect, useState } from "react";
import { fetchReservations, Reservation } from "../fetchData";

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="reservation-container">
      <h2 className="reservation-title">Reservations</h2>

      <div className="table-wrapper">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : reservations.length > 0 ? (
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
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td>{res.id || "N/A"}</td>
                  <td>{res.source || "N/A"}</td>
                  <td>{res.title || "N/A"}</td>
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