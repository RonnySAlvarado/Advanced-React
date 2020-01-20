import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

const Signup = props => {
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
    <Mutation mutation={SIGNUP_MUTATION} variables={input}>
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
              <h2>Sign Up for an Account!</h2>
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
              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                  value={input.name}
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
              <button type="submit">Signup</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default Signup;
