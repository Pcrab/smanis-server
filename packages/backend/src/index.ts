import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as dotenv from "dotenv";
import { encryptPwd, signJwt, verifyJwt, verifyPwd } from "./utils/crypto.js";
import initDb from "./utils/db.js";

// Init env
// Then can visit any defined variables in .env through process.env.VAR_NAME
dotenv.config();
// console.log(process.env.DB_URL);

// Test JWT
const jwt = signJwt({ payload: "payload" });
verifyJwt(jwt);
// Test PWD
const hash = await encryptPwd("password");
if (!(await verifyPwd(hash, "password"))) {
    throw "pwd error";
}

// Connecting to MongoDB
await initDb();

const typeDefs = `#graphql
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
