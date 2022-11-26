import{ApolloServer as e}from"@apollo/server";import{startStandaloneServer as t}from"@apollo/server/standalone";const o=`#graphql
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
`,r={Query:{books:()=>[]}},s=new e({resolvers:r,typeDefs:o}),{url:a}=await t(s,{listen:{port:20080}});console.log(`Backend server started at ${a}`);
//# sourceMappingURL=index.js.map
