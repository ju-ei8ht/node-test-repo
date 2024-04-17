import express, { type NextFunction, type Request, type Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { DBManager, ORM } from 'configs/db';
import { Error } from 'ErrorUtils';
import router from './router';
import typeDefs from 'graphql/typeDefs';
import resolvers from 'graphql/resolvers';

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

await server.start();
server.applyMiddleware({ app });

const port = process.env.PORT || 3000;

const dbManager = DBManager.getInstance();

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

// 에러 핸들러
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) res.status(err.getCode()).json(err);
    res.status(500).json(err);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});