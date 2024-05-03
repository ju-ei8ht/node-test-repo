import { gql } from "apollo-server-express";
import fs from 'fs';
import path from 'path';

const env = process.env.NODE_ENV;
let schemaPath;

if (env == 'production') schemaPath = path.join(__dirname, '../../schema.graphql');
else schemaPath = require.resolve('./schema.graphql');

const typeDefs = gql(fs.readFileSync(schemaPath, { encoding: 'utf-8' }));


export default typeDefs;