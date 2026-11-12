import {
  saveApplication,
  changeApplicationStatus,
  getAllApplications,
} from "../services/applicationService.js";

export function getAllApplicationsHandler(_request, response) {
  try {
    const applications = getAllApplications();
    response.status(200).json(applications);
  } catch (error) {
    response.status(500).json({
      error: error.message,
    });
  }
}

export function createApplicationHandler(request, response) {
  try {
    const savedApplication = saveApplication(request.body);

    response.status(201).json(savedApplication);
  } 
  catch (error) {
    response.status(400).json({
      error: error.message,
    });
  }

}

export function updateApplicationStatusHandler(request, response) {
  try {
    const id = Number(request.params.id);
    const { status } = request.body;

    const updatedApplication = changeApplicationStatus(id, status);

    response.status(200).json(updatedApplication);
  } 
  catch (error) {
    
    if (error.message === "Application not found.") {
      return response.status(404).json({
        error: error.message,
      });
    }

    response.status(400).json({
      error: error.message,
    });
  }
  
}