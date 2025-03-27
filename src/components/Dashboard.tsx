import { useEffect, useState } from "react";
import { fetchReservations, fetchReviews, fetchContactQueries, Reservation, Review, ContactQuery } from "../fetchData";
import {
   XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from "recharts";
import "../dashboard.css";

const Dashboard: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contactQueries, setContactQueries] = useState<ContactQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [reservationsData, reviewsData, queriesData] = await Promise.all([
          fetchReservations(),
          fetchReviews(),
          fetchContactQueries(),
        ]);
        setReservations(reservationsData);
        setReviews(reviewsData);
        setContactQueries(queriesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate summary metrics
  const totalReservations = reservations.length;
  const totalReviews = reviews.length;
  const totalContactQueries = contactQueries.length;

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => {
          const rating = parseFloat(review.rating || "0");
          return sum + (isNaN(rating) ? 0 : rating);
        }, 0) / reviews.length
      : 0;

  // Find busiest reservation day
  const reservationDays = reservations.reduce((acc, res) => {
    const date = res.date || "Unknown";
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const busiestDay = Object.entries(reservationDays).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Pie Chart: Percentage of reservations from Bo-Tai vs Swan
  const boTaiReservations = reservations.filter(r => r.source === "Bo-Tai").length;
  const swanReservations = reservations.filter(r => r.source === "Swan").length;
  const pieChartData = [
    { name: "Bo-Tai", value: boTaiReservations },
    { name: "Swan", value: swanReservations },
  ];
  const COLORS = ["#3b82f6", "#10b981"];

  // Area Chart: Reservations over time, split by source
  const reservationsByDate = reservations.reduce((acc, res) => {
    const date = res.date || "Unknown";
    // const source = res.source || "Unknown";
    if (!acc[date]) {
      acc[date] = { date, "Bo-Tai": 0, "Swan": 0 };
    }
  
    return acc;
  }, {} as Record<string, { date: string; "Bo-Tai": number; "Swan": number }>);
  const areaChartData = Object.values(reservationsByDate);

  // Bar Chart: Rating distribution
  const ratingDistribution = reviews.reduce((acc, review) => {
    const rating = review.rating ? Math.round(parseFloat(review.rating)) : "N/A";
    if (rating !== "N/A" && !isNaN(rating)) {
      acc[rating] = (acc[rating] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  const ratingChartData = Object.entries(ratingDistribution)
    .map(([rating, count]) => ({ rating: `${rating} Star`, count }))
    .sort((a, b) => parseInt(a.rating) - parseInt(b.rating));

  // Scatter Chart: Persons vs Time Slot (if available)
  const scatterChartData = reservations
    .filter(res => res.timeSlot && res.persons)
    .map(res => ({
      timeSlot: res.timeSlot,
      persons: res.persons,
      source: res.source,
    }));

  // Get recent items (limit to 5 for each)
  const recentReservations = reservations
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);
  const recentReviews = reviews
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);
  const recentContactQueries = contactQueries
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 5);

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Reservations</h3>
              <p>{totalReservations || "0"}</p>
            </div>
            <div className="summary-card">
              <h3>Total Reviews</h3>
              <p>{totalReviews || "0"}</p>
            </div>
            <div className="summary-card">
              <h3>Total Contact Queries</h3>
              <p>{totalContactQueries || "0"}</p>
            </div>
            <div className="summary-card">
              <h3>Average Rating</h3>
              <p>{averageRating ? averageRating.toFixed(1) : "N/A"} / 5</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Pie Chart: Bo-Tai vs Swan Reservations */}
            <div className="chart-container">
              <h3>Reservation Source Distribution</h3>
              {totalReservations > 0 ? (
                <PieChart width={400} height={300}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <div className="chart-empty">No reservations data available</div>
              )}
            </div>

            {/* Area Chart: Reservations Over Time by Source */}
            <div className="chart-container">
              <h3>Reservations Over Time by Source</h3>
              {areaChartData.length > 0 ? (
                <AreaChart width={500} height={250} data={areaChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Bo-Tai" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
                  <Area type="monotone" dataKey="Swan" stackId="1" stroke="#10b981" fill="#10b981" />
                </AreaChart>
              ) : (
                <div className="chart-empty">No reservations data available</div>
              )}
            </div>

            {/* Bar Chart: Rating Distribution */}
            <div className="chart-container">
              <h3>Rating Distribution</h3>
              {ratingChartData.length > 0 ? (
                <BarChart width={500} height={250} data={ratingChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              ) : (
                <div className="chart-empty">No reviews data available</div>
              )}
            </div>

            {/* Scatter Chart: Persons vs Time Slot */}
            <div className="chart-container">
              <h3>Persons vs Time Slot</h3>
              {scatterChartData.length > 0 ? (
                <ScatterChart width={500} height={250} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis type="category" dataKey="timeSlot" name="Time Slot" />
                  <YAxis type="number" dataKey="persons" name="Persons" />
                  <ZAxis type="category" dataKey="source" name="Source" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Legend />
                  <Scatter name="Bo-Tai" data={scatterChartData.filter(d => d.source === "Bo-Tai")} fill="#3b82f6" />
                  <Scatter name="Swan" data={scatterChartData.filter(d => d.source === "Swan")} fill="#10b981" />
                </ScatterChart>
              ) : (
                <div className="chart-empty">No data available for this chart</div>
              )}
            </div>
          </div>

          {/* Insights Section */}
          <div className="insights-section">
            <div className="insight-card">
              <h3>Key Insights</h3>
              <ul>
                <li>Busiest Day: {busiestDay}</li>
                <li>Bo-Tai Reservations: {boTaiReservations}</li>
                <li>Swan Reservations: {swanReservations}</li>
                <li>Bo-Tai Reviews: {reviews.filter(r => r.source === "Bo-Tai").length}</li>
                <li>Swan Reviews: {reviews.filter(r => r.source === "Swan").length}</li>
              </ul>
            </div>
            <div className="insight-card">
              <h3>Recent Activity Summary</h3>
              <p>Latest Reservation: {recentReservations[0]?.name || "N/A"} on {recentReservations[0]?.date || "N/A"}</p>
              <p>Latest Review: {recentReviews[0]?.name || "N/A"} rated {recentReviews[0]?.rating || "N/A"}</p>
              <p>Latest Query: {recentContactQueries[0]?.fullName || "N/A"}</p>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="recent-activity-section">
            <div className="recent-table">
              <h3>Recent Reservations</h3>
              {recentReservations.length > 0 ? (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Source</th>
                      <th>Date</th>
                      <th>Persons</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReservations.map((res) => (
                      <tr key={res.id}>
                        <td>{res.name || "N/A"}</td>
                        <td>{res.source || "N/A"}</td>
                        <td>{res.date || "N/A"}</td>
                        <td>{res.persons || "N/A"}</td>
                        <td>{res.createdAt ? new Date(res.createdAt).toLocaleString() : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="table-empty">No recent reservations</div>
              )}
            </div>

            <div className="recent-table">
              <h3>Recent Reviews</h3>
              {recentReviews.length > 0 ? (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Source</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReviews.map((review) => (
                      <tr key={review.id}>
                        <td>{review.name || "N/A"}</td>
                        <td>{review.source || "N/A"}</td>
                        <td>{review.rating || "N/A"}</td>
                        <td className="comment-cell">{review.comment || "N/A"}</td>
                        <td>{review.createdAt ? new Date(Number(review.createdAt)).toLocaleString() : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="table-empty">No recent reviews</div>
              )}
            </div>

            <div className="recent-table">
              <h3>Recent Contact Queries</h3>
              {recentContactQueries.length > 0 ? (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Source</th>
                      <th>Email</th>
                      <th>Note</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentContactQueries.map((query) => (
                      <tr key={query.id}>
                        <td>{query.fullName || "N/A"}</td>
                        <td>{query.source || "N/A"}</td>
                        <td>{query.email || "N/A"}</td>
                        <td className="comment-cell">{query.notes || "N/A"}</td>
                        <td>{query.createdAt ? new Date(Number(query.createdAt)).toLocaleString() : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="table-empty">No recent contact queries</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;