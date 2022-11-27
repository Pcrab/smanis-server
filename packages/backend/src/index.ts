import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as dotenv from "dotenv";
import initDb from "./utils/db.js";

// Init env
// Then can visit any defined variables in .env through process.env.VAR_NAME
dotenv.config();
// console.log(process.env.DB_URL);

// Connecting to MongoDB
await initDb();

const typeDefs = `
type Book {
    title: String
    author: String
}
type Query {
    books: [Book]
}
`;

const resolvers = {
    Query: {
        books: () => [],
    },
};

const server = new ApolloServer({
    resolvers,
    typeDefs,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 20080 },
});

console.log(`Backend server started at ${url}`);
