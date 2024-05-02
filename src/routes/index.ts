import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { DB, DBManager, ORM } from 'configs/db';
import { errorHandler } from 'ErrorUtils';
import router from './router';
import typeDefs from 'graphql/typeDefs';
import resolvers from 'graphql/resolvers';
import socketConnection from 'SocketController';
import http from 'http';
import cors from 'cors';

const app = express();

app.use(cors());

const server = new ApolloServer({ typeDefs, resolvers });
const httpServer = http.createServer(app);

await server.start();
server.applyMiddleware({ app });

const port = process.env.PORT || 3000;

const dbManager = DBManager.getInstance(DB.MySQL);

(async () => {
    try {
        dbManager.connect(ORM.Sequelize);
    } catch (error) {
        console.error('데이터베이스 연결 실패:', error);
        throw error;
    }
})();

app.use(express.json());
app.use(router);
app.use(errorHandler);

socketConnection(httpServer);

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});