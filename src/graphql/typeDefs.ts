import { gql } from "apollo-server-express";
import fs from 'fs';

const typeDefs = gql(fs.readFileSync(require.resolve('./schema.graphql'), { encoding: 'utf-8' }));

export default typeDefs;