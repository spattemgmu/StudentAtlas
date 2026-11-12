import "./ApplicationStatus.css";

function ApplicationStatus({ application, onStatusChange }) {
  const statuses = [
    "Saved",
    "Applied",
    "Under Review",
    "Interview",
    "Assessment",
    "Offer",
    "Rejected",
  ];

  return (
    <div className="application-status">
      <label htmlFor={`status-${application.id}`}>Application Status:</label>

      <select
        id={`status-${application.id}`}
        value={application.status}
        onChange={(event) => onStatusChange(application.id, event.target.value)}
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ApplicationStatus;
