import { useEffect, useState } from "react";
import { fetchContactQueries, ContactQuery } from "../fetchData";

const ContactQueries: React.FC = () => {
  const [contactQueries, setContactQueries] = useState<ContactQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="contact-queries-container">
      <h2 className="contact-queries-title">Contact Queries</h2>

      <div className="table-wrapper">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : contactQueries.length > 0 ? (
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
              {contactQueries.map((query) => (
                <tr key={query.id}>
                  <td>{query.id || "N/A"}</td>
                  <td>{query.source || "N/A"}</td>
                  <td>{query.fullName || "N/A"}</td>
                  <td>{query.email || "N/A"}</td>
                  <td>{query.note || "N/A"}</td>
                  <td>{query.createdAt ? new Date(query.createdAt).toLocaleString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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