import {
  addApplication,
  getApplicationById,
  updateApplicationStatus as updateStatusInRepository,
} from "../repositories/applicationRepository.js";


const validStatuses = [
  "Saved",
  "Applied",
  "Under Review",
  "Interview",
  "Assessment",
  "Offer",
  "Rejected",
];


export function validateApplication(application) {
  const errors = [];

  if (!application) {
    return {
      valid: false,
      errors: ["Application data is required."],
    };
  }

  if (!application.company || application.company.trim() === "") {
    errors.push("Company name is required.");
  }

  if (!application.position || application.position.trim() === "") {
    errors.push("Position is required.");
  }

  if (!application.applicationDate) {
    errors.push("Application date is required.");
  }

  if (!application.status) {
    errors.push("Application status is required.");
  } 
  
  else if (!validStatuses.includes(application.status)) {
    errors.push("Application status is invalid.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}



export function createApplication(applicationData) {
  const validation = validateApplication(applicationData);

  if (!validation.valid) {
    throw new Error(validation.errors.join(" "));
  }

  return {
    ...applicationData,
  };
}



export function validateApplicationStatus(status) {
  if (!status) {
    throw new Error("Application status is required.");
  }

  if (!validStatuses.includes(status)) {
    throw new Error("Application status is invalid.");
  }

  return status;
}



export function updateApplicationStatus(application, newStatus) {
  if (!application) {
    throw new Error("Application is required.");
  }

  validateApplicationStatus(newStatus);

  return {
    ...application,
    status: newStatus,
  };
}

export function saveApplication(applicationData) {
  const application = createApplication(applicationData);

  const databaseApplication = {
    company_name: application.company,
    job_title: application.position,
    status: application.status,
    application_date: application.applicationDate,
    deadline: application.deadline ?? null,
    follow_up_date: application.followUpDate ?? null,
    job_url: application.jobUrl ?? null,
    notes: application.notes ?? null,
  };

  const id = addApplication(databaseApplication);

  return getApplicationById(id);
}

export function changeApplicationStatus(id, newStatus) {
  
    validateApplicationStatus(newStatus);

  const application = getApplicationById(id);

  if (!application) {
    throw new Error("Application not found.");
  }

  const updated = updateStatusInRepository(id, newStatus);

  
  if (!updated) {
    throw new Error("Application status could not be updated.");
  }

  return getApplicationById(id);
}