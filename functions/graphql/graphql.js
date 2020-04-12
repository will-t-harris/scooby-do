const { ApolloServer, gql } = require("apollo-server-lambda");

// Construct schema
const typeDefs = gql`
	type Query {
		hello: String
	}
`;

// Provide resolver functions for schema fields
const resolvers = {
	Query: {
		hello: () => "Hello world!",
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,

	// By default, the GraphQL Playground interface and GraphQL introspection
	// is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
	//
	// If you'd like to have GraphQL Playground and introspection enabled in production,
	// the `playground` and `introspection` options must be set explicitly to `true`.
	playground: true,
	introspection: true,
});

exports.handler = server.createHandler();
