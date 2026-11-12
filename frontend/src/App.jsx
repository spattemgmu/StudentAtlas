import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import AddApplication from "./components/AddApplication";
import FilterApplicationsFollowUp from "./components/FilterApplicationsFollowUp";
import ApplicationStatus from "./components/ApplicationStatus";
import "./App.css";

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to get the applications from the server.");
        }
        return res.json();
      })
      .then((data) => {
        const formattedData = data.map((app) => ({
          id: app.id,
          company: app.company_name,
          role: app.job_title,
          position: app.job_title,
          status: app.status,
          applicationDate: app.application_date,
          deadline: app.deadline,
          followUpDate: app.follow_up_date,
          jobUrl: app.job_url,
          notes: app.notes,
        }));
        setApplications(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error while fetching applications:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  async function addApplication(newApplicationData) {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newApplicationData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to save the application.");
      }

      const savedApp = await response.json();

      const formattedApp = {
        id: savedApp.id,
        company: savedApp.company_name,
        role: savedApp.job_title,
        position: savedApp.job_title,
        status: savedApp.status,
        applicationDate: savedApp.application_date,
        deadline: savedApp.deadline,
        followUpDate: savedApp.follow_up_date,
        jobUrl: savedApp.job_url,
        notes: savedApp.notes,
      };

      setApplications((prev) => [formattedApp, ...prev]);
    } catch (err) {
      console.error("Failed to add application:", err);
      alert(`Error: ${err.message}`);
    }
  }

  async function updateApplicationStatus(applicationId, newStatus) {
    try {
      const response = await fetch(
        `/api/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update status.");
      }

      setApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.id === applicationId
            ? { ...application, status: newStatus }
            : application,
        ),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(`Error: ${err.message}`);
    }
  }

  return (
    <>
      <Dashboard />

      <AddApplication onAddApplication={addApplication} />
      <h2>Application Tracker</h2>

      {loading && <p>Loading applications from the database.</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading &&
        !error &&
        applications.map((application) => (
          <div
            key={application.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <h3>{application.company}</h3>
            <p>{application.role || application.position}</p>

            <ApplicationStatus
              application={application}
              onStatusChange={updateApplicationStatus}
            />
          </div>
        ))}

      <FilterApplicationsFollowUp applications={applications} />
    </>
  );
}

export default App;
