const React = require("react");
const { ThemeProvider } = require("theme-ui");
const { deep } = require("@theme-ui/presets");
const {
	ApolloProvider,
	ApolloClient,
	HttpLink,
	InMemoryCache,
} = require("@apollo/client");

const { Provider } = require("./identity-context");

const tokens = { ...deep, sizes: { container: 1024 } };

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: "https://scooby-do.netlify.com/.netlify/functions/graphql",
	}),
});

module.exports = ({ element }) => (
	<Provider>
		<ApolloProvider client={client}>
			<ThemeProvider theme={tokens}>{element}</ThemeProvider>
		</ApolloProvider>
	</Provider>
);
