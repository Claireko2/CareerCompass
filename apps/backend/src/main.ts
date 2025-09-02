import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8000;

// CORS setup: allow your frontend URL
app.use(cors({
  origin: ['https://career-compass-frontend-hazel.vercel.app/'],
  credentials: true
}));

app.get('/', (_, res) => res.send('Hello from backend'));

// example API route
app.get('/api/jobs', (_, res) => {
  res.json({ jobs: ['job1', 'job2'] });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
