import {
  saveApplication,
  changeApplicationStatus,
  getAllApplications,
  removeApplication,
} from "../services/applicationService.js";

// Get applications belonging to the logged-in student.
export function getAllApplicationsHandler(request, response) {
  try {
    const applications = getAllApplications(request.userId);

    response.status(200).json(applications);
  } catch (error) {
    response.status(500).json({
      error: error.message,
    });
  }
}

// Save a new application for the logged-in student.
export function createApplicationHandler(request, response) {
  try {
    const savedApplication = saveApplication(
      request.body,
      request.userId
    );

    response.status(201).json(savedApplication);
  } catch (error) {
    if (error.code === "DUPLICATE_APPLICATION") {
      return response.status(409).json({
        error: error.message,
      });
    }

    response.status(400).json({
      error: error.message,
    });
  }
}

// Update an application only if the student owns it.
export function updateApplicationStatusHandler(request, response) {
  try {
    const id = Number(request.params.id);
    const { status } = request.body;

    const updatedApplication = changeApplicationStatus(
      id,
      status,
      request.userId
    );

    response.status(200).json(updatedApplication);
  } catch (error) {
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

// Delete an application only if the logged-in student owns it.
export function deleteApplicationHandler(request, response) {
  try {
    // Convert the application ID from the URL into a number.
    const id = Number(request.params.id);

    // Delete the application using the logged-in student's ID.
    const result = removeApplication(id, request.userId);

    // Return a confirmation message.
    return response.status(200).json(result);

  } catch (error) {
    // Return 404 if the application does not exist
    // or does not belong to the logged-in student.
    if (error.message === "Application not found.") {
      return response.status(404).json({
        error: error.message,
      });
    }

    // Return 400 if the application ID is invalid.
    if (error.message === "Invalid application ID.") {
      return response.status(400).json({
        error: error.message,
      });
    }

    // Return 500 if an unexpected error occurs.
    return response.status(500).json({
      error: "Application could not be deleted.",
    });
  }
}
