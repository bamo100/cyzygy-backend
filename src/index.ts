import express from 'express';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import schema  from './schema';
import { connectDB } from './utils/connection';
import { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { authenticate, AuthRequest } from './middleware/auth';

dotenv.config();

//connect to DB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI environment variable is not defined');
}
connectDB(mongoUri);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.LIVE_URL].filter((url): url is string => typeof url === 'string'), 
  credentials: true,
}));

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'Server is running' });
});

app.use(
    "/graphql",
    authenticate,
    graphqlHTTP((req, res) => {
        const authReq = req as AuthRequest;
        return {
            schema,
            context: { user: authReq.user, res, role: authReq.role },
            graphiql: true,
        };
    })
);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start server with error handling
const startServer = async () => {
    try {
        //conect to DB
    //   await connectDB(); 
      app.listen(PORT, () => {
        console.log(`
          🚀 Server running at: http://localhost:${PORT}
          📊 GraphQL playground: http://localhost:${PORT}/graphql
        `);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
};
  
startServer();
