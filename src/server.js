import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

//^ ROUTES
app.get('/notes', (req, res) => {
  res.status(200).json({
    message: 'Retrieved all notes',
  });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;

  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

//^ ROUTE FOR TESTING ERROR
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

//^ MIDDLEWARE FOR PAGE NOT FOUND
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

//^ MIDDLEWARE FOR ERROR
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
