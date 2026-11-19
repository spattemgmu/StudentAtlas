
                <section className="tracker-panel">
                  {statusError && (
                    <p className="error-message" role="alert">
                      {statusError}
                    </p>
                  )}

                  <FilterApplicationsFollowUp
                    applications={applications}
                    onStatusChange={updateApplicationStatus}
                    onDeleteApplication={deleteApplication}
                  />
                </section>
              </div>
            </>
          )}

          {page === "Follow-ups" && (
            <>
              <h1>Follow-ups</h1>

              <p className="page-description">
                Keep track of your saved follow-up dates.
              </p>

              <section className="tracker-panel">
                <FilterApplicationsFollowUp
                  key="followups"
                  applications={applications}
                  followUpsOnly={true}
                />
              </section>
            </>
          )}

          {page === "Search Resources" && (
            <section className="placeholder-panel">
              <h1>Search Resources</h1>
              <p>
                AI-assisted job search is planned for a future update.
              </p>
            </section>
          )}

          {page === "Documents" && (
            <section className="placeholder-panel">
              <h1>Document Hub</h1>

              <p className="page-description">
                Upload, download, and manage your resumes, cover letters,
                and other documents.
              </p>

              <div>
                <input
                  type="file"
                  onChange={(event) =>
                    setSelectedDocument(event.target.files[0] || null)
                  }
                />

                <button onClick={uploadDocument}>
                  Upload Document
                </button>
              </div>

              {documentMessage && (
                <p>{documentMessage}</p>
              )}

              <div>
                {documents.length === 0 ? (
                  <p>No documents uploaded yet.</p>
                ) : (
                  documents.map((document) => (
                    <div key={document.id}>
                      <span>{document.original_name}</span>

                      <button
                        onClick={() => downloadDocument(document)}
                      >
                        Download
                      </button>

                      <button
                        onClick={() =>
                          deleteDocumentFromHub(document.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {page === "Career Hub" && (
            <section className="placeholder-panel">
              <h1>Career Hub</h1>
              <p>
                Career events and resources are planned.
              </p>
            </section>
          )}

          {page === "My Profile" && <MyProfile />}
        </main>
      </div>
    </div>
  );
}

export default App;
