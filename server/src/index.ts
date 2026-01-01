import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import boardsRouter from './routes/boards';
import authRouter from './routes/auth.routes';
import pool from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Origin',
    'Accept',
    'X-Requested-With',
  ],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Trello API Server' });
});

app.use('/api/auth', authRouter);
app.use('/api', boardsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
