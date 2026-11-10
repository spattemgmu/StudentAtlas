import express from 'express';
import healthRoutes from './routes/healthRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

// Express creates the HTTP API; feature routes can be added here later.
const app = express();
app.use(express.json());


// A safe test endpoint that confirms the API is running.
app.use('/api/health', healthRoutes);
app.use('/api/applications', applicationRoutes);

// Standard JSON response for errors not handled by a specific route.
app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'Internal server error' });
});

export default app;
