import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DatabaseService } from "./db/mongodb";
import { typeDefs } from "./graphql/schemas";
import { resolvers } from "./graphql/resolvers";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import { globalErrorHandler } from './middlewares/errorHandler';

dotenv.config();
const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();
  
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  await DatabaseService.connect(process.env.MONGODB_URI || '');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>({
      origin: 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
    express.json(),
    expressMiddleware(server),
  );

  app.use(globalErrorHandler);
  app.get('/ping',(req,res)=>{
    res.send('pong')
  })
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
