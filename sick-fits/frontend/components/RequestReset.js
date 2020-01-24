import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

const REQUEST_RESET_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const Signin = props => {
  const [input, setInput] = useState({
    email: ""
  });

  const handleChange = e => {
    e.preventDefault();
    console.log(input);
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <Mutation mutation={REQUEST_RESET_MUTATION} variables={input}>
      {(reset, { error, loading, called }) => {
        return (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await reset();
              setInput({ ...input, email: "" });
            }}
          >
            <fieldset disableed={loading} aria-bus={loading}>
              <h2>Request a password reset</h2>
              <Error error={error} />
              {!error && !loading && called && (
                <p>Success! Check your email for a reset link</p>
              )}
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
              <button type="submit">Request Reset!</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default Signin;
