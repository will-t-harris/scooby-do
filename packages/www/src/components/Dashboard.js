import React, { useContext, useRef, useReducer } from "react";
import { Router, Link } from "@reach/router";
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
	mutation AddTodo($type: String!) {
		addTodo(text: 'one todo') {
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

const todosReducer = (state, action) => {
	switch (action.type) {
		case "addTodo":
			return [{ done: false, value: action.payload }, ...state];
		case "toggleTodoDone":
			const newState = [...state];
			newState[action.payload] = {
				done: !state[action.payload].done,
				value: state[action.payload].value,
			};
			return newState;
	}
};

const Dashboard = (props) => {
	const { user, identity: netlifyIdentity } = useContext(IdentityContext);
	const [todos, dispatch] = useReducer(todosReducer, []);
	const inputRef = useRef();
	const [addTodo] = useMutation(ADD_TODO);
	const [updateTodoDone] = useMutation(UPDATE_TODO_DONE);
	const { loading, error, data } = useQuery(GET_TODOS);

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
				onSubmit={(event) => {
					event.preventDefault();
					addTodo({ variables: { text: inputRef.current.value } });
					inputRef.current.value = "";
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
						{todos.map((todo) => (
							<Flex
								as="li"
								onClick={() => {
									updateTodoDone({ variables: { id: todo.id } });
								}}
							>
								<Checkbox checked={todo.done} />
								<span>{todo.value}</span>
							</Flex>
						))}
					</ul>
				)}
			</Flex>
		</Container>
	);
};

export default Dashboard;
