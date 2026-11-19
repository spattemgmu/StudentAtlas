
import { useState } from "react";
import ApplicationStatus from "./ApplicationStatus";
import "./FilterApplicationsFollowUp.css";

export default function FilterApplicationsFollowUp({
  applications,
  onStatusChange,
  onDeleteApplication,
  followUpsOnly = false
}) {
  // Store the user's search and filter selections.
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showOnlyUpcoming, setShowOnlyUpcoming] = useState(false);

  // Filter applications by company, role, status, and follow-up date.
  const filteredApplications = applications.filter((app) => {
    const roleOrPosition = app.role || app.position || "";

    const matchesSearch =
      (app.company &&
        app.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      roleOrPosition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || app.status === statusFilter;

    let matchesFollowUp = true;

    if (showOnlyUpcoming) {
      const today = new Date().toISOString().split("T")[0];

      matchesFollowUp =
        Boolean(app.followUpDate) && app.followUpDate >= today;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesFollowUp &&
      (!followUpsOnly || Boolean(app.followUpDate))
    );
  });

  return (
    <div className="filter-container">
      <h2>
        {followUpsOnly ? "Follow-up Tracker" : "Application Tracker"}
      </h2>

      <p>
        {followUpsOnly
          ? "Search your scheduled follow-ups."
          : "Search and filter your saved applications."}
      </p>

      {/* Search and filter controls. */}
      <div className="filter-controls">
        <input
          type="text"
          aria-label="Search applications"
          placeholder="Search by company or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-dropdown"
        >
          <option value="All">All Statuses</option>
          <option value="Saved">Saved</option>
          <option value="Applied">Applied</option>
          <option value="Under Review">Under Review</option>
          <option value="Interview">Interview</option>
          <option value="Assessment">Assessment</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        {followUpsOnly && (
          <button
            type="button"
            aria-pressed={showOnlyUpcoming}
            className="upcoming-btn"
            onClick={() => setShowOnlyUpcoming(!showOnlyUpcoming)}
          >
            {showOnlyUpcoming
              ? "Show all follow-ups"
              : "Upcoming only"}
          </button>
        )}
      </div>

      {/* Display the filtered application cards. */}
      <div className="app-list">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.id} className="app-card">
              <h3>{app.company}</h3>

              <p>Role: {app.role || app.position}</p>

              <div className="app-details">
                <span
                  className="status-badge"
                  data-status={app.status}
                >
                  {app.status}
                </span>

                <span className="followup-date">
                  Follow-up: {app.followUpDate || "Not set"}
                </span>
              </div>

              {/* Allow students to update application statuses. */}
              {onStatusChange && (
                <ApplicationStatus
                  application={app}
                  onStatusChange={onStatusChange}
                />
              )}

              {/* Show Delete only when a delete handler is provided. */}
              {onDeleteApplication && (
                <button
                  type="button"
                  className="delete-application-btn"
                  onClick={() => onDeleteApplication(app.id)}
                  aria-label={`Delete application for ${app.company}`}
                >
                  Delete Application
                </button>
              )}
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#888" }}>
            {followUpsOnly
              ? "No follow-up dates match your filters."
              : "No applications match your filters."}
          </p>
        )}
      </div>
    </div>
  );
}
