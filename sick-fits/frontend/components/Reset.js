import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const RESET_MUTATION = gql`
  mutation SIGNIN_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      email: $email
      resetToken: $resetToken
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

const Reset = props => {
  const [input, setInput] = useState({
    password: "",
    confirmPassword: ""
  });

  const handleChange = e => {
    e.preventDefault();
    console.log(input);
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <Mutation
      mutation={RESET_MUTATION}
      variables={{
        resetToken: props.resetToken,
        password: input.password,
        confirmPassword: input.confirmPassword
      }}
      refetchQueries={[{ query: CURRENT_USER_QUERY }]}
    >
      {(reset, { error, loading, called }) => {
        return (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await reset();
              setInput({ ...input, password: "", confirmPassword: "" });
            }}
          >
            <fieldset disabled={loading} aria-bus={loading}>
              <h2>Reset Your Password</h2>
              <Error error={error} />
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
              <label htmlFor="confirmPassword">
                Confirm Your Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirmPassword"
                  value={input.confirmPassword}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Reset</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default Reset;
