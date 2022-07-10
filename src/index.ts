import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { typeDefs } from './schema';
import resolvers from './resolvers.js';
import TrackAPI from './datasources/track-api';

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
      return {
        trackAPI: new TrackAPI(),
      };
    },
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise<void>((resolve) => httpServer.listen({ port: 5000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
}

startApolloServer();
