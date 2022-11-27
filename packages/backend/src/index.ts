import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import * as dotenv from "dotenv";

// Init env
// Then can visit any defined variables in .env through process.env.VAR_NAME
dotenv.config();
// console.log(process.env.DB_URL);

const typeDefs = `#graphql
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "Book" type defines the queryable fields for every book in our data source.
type Book {
    title: String
    author: String
}

# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
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
