const { ApolloServer, gql } = require("apollo-server-lambda");

// Construct schema
const typeDefs = gql`
	type Query {
		todos: [Todo]!
	}
	type Todo {
		id: ID!
		text: String!
		done: Boolean!
	}
`;

const todos = {};

// Provide resolver functions for schema fields
const resolvers = {
	Query: {
		todos: () => {
			return Object.values(todos);
		},
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
