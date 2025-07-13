import express from 'express';

const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', (_, res) => res.send('Hello from backend'));

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
