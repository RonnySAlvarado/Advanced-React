import React, { useState } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import formatMoney from "../lib/formatMoney";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

const UpdateItem = props => {
  const [input, setInput] = useState();

  const handleChange = e => {
    const { name, type, value } = e.target;
    console.log(name, type, value);
    const val = type === "number" ? parseFloat(value) : value;
    setInput({ ...input, [name]: val });
  };

  const itemUpdate = async (e, updateItemMutation) => {
    e.preventDefault();
    console.log("Updating item!!");
    console.log(input);
    const res = await updateItemMutation({
      variables: {
        id: props.id,
        ...input
      }
    });
    console.log("Updated!");
  };

  return (
    <Query
      query={SINGLE_ITEM_QUERY}
      variables={{
        id: props.id
      }}
    >
      {({ data, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (!data.item) return <p>No Item Found for ID {props.id}</p>;
        return (
          <Mutation mutation={UPDATE_ITEM_MUTATION} variables={input}>
            {(updateItem, { loading, error }) => (
              <Form onSubmit={e => itemUpdate(e, updateItem)}>
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="title">
                    Title
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Title"
                      required
                      defaultValue={data.item.title}
                      onChange={handleChange}
                    />
                  </label>

                  <label htmlFor="price">
                    Price
                    <input
                      type="number"
                      id="price"
                      name="price"
                      placeholder="Price"
                      required
                      defaultValue={data.item.price}
                      onChange={handleChange}
                    />
                  </label>

                  <label htmlFor="description">
                    Description
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Enter A Description"
                      required
                      defaultValue={data.item.description}
                      onChange={handleChange}
                    />
                  </label>
                  <button type="submit">
                    Sav{loading ? "ing" : "e"} Changes
                  </button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
};

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };