import React, { useContext } from "react";
import { Router, Link } from "@reach/router";
import { Flex, Heading, Button, NavLink, Container } from "theme-ui";
import { IdentityContext } from "../../identity-context";
import Dashboard from "../components/Dashboard";

let DashLoggedOut = props => {
	const { user, identity: netlifyIdentity } = useContext(IdentityContext);

	return (
		<Container>
			<Flex as="nav">
				<NavLink as={Link} to="/" p={2}>
					Home
				</NavLink>
				<NavLink as={Link} to="/app" p={2}>
					Dashboard
				</NavLink>
			</Flex>
			<Flex sx={{ flexDirection: "column", padding: 3 }}>
				<Heading as="h1">Get Stuff Done</Heading>
				<Button
					sx={{ marginTop: 2 }}
					onClick={() => {
						netlifyIdentity.open();
					}}
				>
					Log In
				</Button>
			</Flex>
		</Container>
	);
};

export default props => {
	const { user } = useContext(IdentityContext);

	if (!user) {
		return (
			<Router>
				<DashLoggedOut path="/app" />
			</Router>
		);
	}
	return (
		<Router>
			<Dashboard path="/app" />
		</Router>
	);
};
