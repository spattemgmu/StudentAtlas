
import { useState } from 'react';
import './AddApplication.css';

function AddApplication({ onAddApplication }) {
  const [applicationData, setapplicationData] = useState({
    company: '',
    position: '',
    applicationDate: '',
    status: '',
    notes: '',
  });

  const [message, setMessage] = useState('');

  function updateField(event) {
    const { name, value } = event.target;

    setapplicationData({
      ...applicationData,
      [name]: value,
    });
  }

  async function saveApplication(event) {
    event.preventDefault();
    setMessage('');

    try {
      await onAddApplication(applicationData);

      setMessage('Application saved successfully!');

      setapplicationData({
        company: '',
        position: '',
        applicationDate: '',
        status: '',
        notes: '',
      });
    } catch (error) {
      setMessage('Could not save application: ' + error.message);
    }
  }

  return (
    <section className="add-application" id="applications">
      <div className="add-application-box">
        <h2>Add Application</h2>

        <p className="form-description">
          Add a job/internship application to your StudentAtlas tracker.
        </p>

        <form onSubmit={saveApplication}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">Company Name</label>
              <input
                id="company"
                name="company"
                type="text"
                value={applicationData.company}
                onChange={updateField}
                placeholder="Enter Company Name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                id="position"
                name="position"
                type="text"
                value={applicationData.position}
                onChange={updateField}
                placeholder="Enter Position"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="applicationDate">Application Date</label>
              <input
                id="applicationDate"
                name="applicationDate"
                type="date"
                value={applicationData.applicationDate}
                onChange={updateField}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Current Status</label>
              <select
                id="status"
                name="status"
                value={applicationData.status}
                onChange={updateField}
                required
              >
                <option value="" disabled>
                  Select a status
                </option>
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Interview">Interview</option>
                <option value="Assessment">Assessment</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={applicationData.notes}
              onChange={updateField}
              placeholder="Enter Important Details"
              rows="4"
            />
          </div>

          <button className="save-button" type="submit">
            Save Application
          </button>

          {message && <p className="success-message">{message}</p>}
        </form>
      </div>
    </section>
  );
}

export default AddApplication;
