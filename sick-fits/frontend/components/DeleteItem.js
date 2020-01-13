import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { ALL_ITEMS_QUERY } from "./Items";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

const DeleteItem = props => {
  console.log(props.id);
  const updateAll = (cache, payload) => {
    // manually update the cache on the client so it matches the server
    // 1. Read the cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log(data);
    // 2. Filter the deleted item out of the page
    data.items = data.items.filter(item => {
      return item.id !== payload.data.deleteItem.id;
    });
    // 3. Put the items back!
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };
  return (
    <Mutation
      mutation={DELETE_ITEM_MUTATION}
      variables={{
        id: props.id
      }}
      update={updateAll}
    >
      {(deleteItem, { error }) => {
        return (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this item?")) {
                deleteItem();
              }
            }}
          >
            {props.children}
          </button>
        );
      }}
    </Mutation>
  );
};

export default DeleteItem;
