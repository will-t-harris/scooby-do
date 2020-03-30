import React, { useContext, useRef } from "react";
import { Router, Link } from "@reach/router";
import {
	Flex,
	Heading,
	Button,
	NavLink,
	Container,
	Input,
	Label,
} from "theme-ui";
import { IdentityContext } from "../../identity-context";

const Dashboard = props => {
	const { user, identity: netlifyIdentity } = useContext(IdentityContext);

	const inputRef = useRef();

	return (
		<Container>
			<Flex as="nav">
				<NavLink as={Link} to="/" p={2}>
					Home
				</NavLink>
				<NavLink as={Link} to="/app" p={2}>
					Dashboard
				</NavLink>
				{user && (
					<NavLink href="#!" p={2}>
						{user.user_metadata.full_name}
					</NavLink>
				)}
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
				<Button
					sx={{ marginTop: 2 }}
					onClick={() => {
						netlifyIdentity.logout();
					}}
				>
					Log Out {user.user_metadata.full_name}
				</Button>
			</Flex>
			<Flex
				as="form"
				onSubmit={event => {
					event.preventDefault();
					alert(inputRef.current.value);
				}}
			>
				<Label sx={{ display: "flex" }}>
					<span>Add&nbsp;Todo</span>
					<Input ref={inputRef} sx={{ marginLeft: 1 }} />
				</Label>
				<Button sx={{ marginLeft: 1 }}>Submit</Button>
			</Flex>
		</Container>
	);
};

export default Dashboard;
