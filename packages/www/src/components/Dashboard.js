import React, { useContext, useRef } from "react";
import { Link } from "@reach/router";
import {
	Flex,
	Heading,
	Button,
	NavLink,
	Container,
	Input,
	Label,
	Checkbox,
} from "theme-ui";
import { gql, useMutation, useQuery } from "@apollo/client";

import { IdentityContext } from "../../identity-context";

const ADD_TODO = gql`
	mutation AddTodo($text: String!) {
		addTodo(text: $text) {
			id
		}
	}
`;

const GET_TODOS = gql`
	query GetTodos {
		todos {
			id
			text
			done
		}
	}
`;

const UPDATE_TODO_DONE = gql`
	mutation UpdateTodoDone($id: ID!) {
		updateTodoDone(id: $id) {
			text
			done
		}
	}
`;

const Dashboard = () => {
	const { user, identity: netlifyIdentity } = useContext(IdentityContext);
	const inputRef = useRef();
	const [addTodo] = useMutation(ADD_TODO);
	const [updateTodoDone] = useMutation(UPDATE_TODO_DONE);
	const { loading, error, data, refetch } = useQuery(GET_TODOS);

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
				onSubmit={async (event) => {
					event.preventDefault();
					await addTodo({ variables: { text: inputRef.current.value } });
					inputRef.current.value = "";
					await refetch();
				}}
			>
				<Label sx={{ display: "flex" }}>
					<span>Add&nbsp;Todo</span>
					<Input ref={inputRef} sx={{ marginLeft: 1 }} />
				</Label>
				<Button sx={{ marginLeft: 1 }}>Submit</Button>
			</Flex>
			<Flex sx={{ flexDirection: "column" }}>
				{loading ? <div>loading...</div> : null}
				{error ? <div>{error.message}</div> : null}
				{!loading && !error && (
					<ul sx={{ listStyleType: "none" }}>
						{data.todos.map((todo) => (
							<Flex
								key={todo.id}
								as="li"
								onClick={async () => {
									await updateTodoDone({ variables: { id: todo.id } });
									await refetch();
								}}
							>
								<Checkbox checked={todo.done} />
								<span>{todo.text}</span>
							</Flex>
						))}
					</ul>
				)}
			</Flex>
		</Container>
	);
};

export default Dashboard;
