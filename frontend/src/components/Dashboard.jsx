
import './Dashboard.css';

function Dashboard({ applications = [] }) {

  // Show the four most recent applications
  const recentApplications = applications.slice(0, 4);

  // Find upcoming deadlines and follow-ups
  const today = new Date().toISOString().split('T')[0];

  const upcomingDates = applications
    .flatMap((app) => {
      const dates = [];

      if (app.deadline) {
        dates.push({
          task: `${app.company} deadline`,
          date: app.deadline,
        });
      }

      if (app.followUpDate) {
        dates.push({
          task: `${app.company} follow-up`,
          date: app.followUpDate,
        });
      }

      return dates;
    })
    .filter((item) => item.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <div className="dashboard">

      <h1>StudentAtlas</h1>

      <nav>
        <a href="#dashboard">Dashboard</a>
        <a href="#applications">Applications</a>
        <a href="#resources">Resources</a>
        <a href="#documents">Documents</a>
        <a href="#career">Career Hub</a>
      </nav>

      <div className="welcome" id="dashboard">
        <h2>Welcome back!</h2>
        <p>Keep track of your job search with StudentAtlas.</p>
      </div>

      <div className="features">
        <div className="card">
          <h3>Application Tracker</h3>
          <p>Track and manage your job applications</p>
        </div>

        <div className="card">
          <h3>Search Resources</h3>
          <p>Find and save job opportunities</p>
        </div>

        <div className="card">
          <h3>Document Hub</h3>
          <p>Organize resumes, cover letters, and documents</p>
        </div>

        <div className="card">
          <h3>Career Hub</h3>
          <p>Explore career events and resources</p>
        </div>
      </div>

      <div className="tables">

        <div className="table-box">
          <h3>Recent Applications</h3>

          <table>
            <thead>
              <tr>
                <th>Application</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {recentApplications.length === 0 ? (
                <tr>
                  <td colSpan="3">No applications saved yet.</td>
                </tr>
              ) : (
                recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.position || app.role} - {app.company}</td>
                    <td>{app.status}</td>
                    <td>{app.applicationDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-box">
          <h3>Upcoming Deadlines</h3>

          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {upcomingDates.length === 0 ? (
                <tr>
                  <td colSpan="2">No upcoming dates saved.</td>
                </tr>
              ) : (
                upcomingDates.map((item, index) => (
                  <tr key={index}>
                    <td>{item.task}</td>
                    <td>{item.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
