import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript API!');
});

app.get('/api', (req: Request, res: Response) => {
  res.send('This is api general');
});

app.get('/api/v1', (req: Request, res: Response) => {
  res.send('This is apiv1');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
