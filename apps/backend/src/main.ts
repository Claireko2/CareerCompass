import express from 'express';

const app = express();

app.get('/', (_, res) => res.send('Hello from backend'));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
