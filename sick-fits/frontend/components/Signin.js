import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

const Signin = props => {
  const [input, setInput] = useState({
    email: "",
    name: "",
    password: ""
  });

  const handleChange = e => {
    e.preventDefault();
    console.log(input);
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <Mutation
      mutation={SIGNIN_MUTATION}
      variables={input}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(signup, { error, loading }) => {
        return (
          <Form
            method="post"
            onSubmit={e => {
              e.preventDefault();
              signup();
              setInput({ ...input, email: "", name: "", password: "" });
            }}
          >
            <fieldset disableed={loading} aria-bus={loading}>
              <h2>Sign in to your Account!</h2>
              <Error error={error} />
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={input.email}
                  onChange={handleChange}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={input.password}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Login</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default Signin;
