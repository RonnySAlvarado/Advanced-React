import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import formatMoney from "../lib/formatMoney";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

const CreateItem = props => {
  const [input, setInput] = useState({
    title: "Cool Shoes",
    description: "Great description",
    image: "",
    largeImage: "",
    price: 1000
  });

  const handleChange = e => {
    const { name, type, value } = e.target;
    console.log(name, type, value);
    const val = type === "number" ? parseFloat(value) : value;
    setInput({ ...input, [name]: val });
  };

  const uploadFile = async e => {
    console.log("uploading file...");
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sickfits"); // This is specific to the presets you set with Cloudinary so make sure the strings match

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/anaestheticz/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();
    console.log(file);
    setInput({
      ...input,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };

  return (
    <Mutation mutation={CREATE_ITEM_MUTATION} variables={input}>
      {(createItem, { loading, error }) => {
        return (
          <Form
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault();
              // call the mutation
              const res = await createItem();
              // change them to the single item page
              console.log("res: ", res);
              Router.push({
                pathname: "/item",
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="title"
                  placeholder="Upload an image..."
                  required
                  onChange={uploadFile}
                />
                {input.image && (
                  <img width="200" src={input.image} alt="Upload Preview" />
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={input.title}
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
                  value={input.price}
                  onChange={handleChange}
                />
              </label>

              <label htmlFor="description">
                Description
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter A Description"
                  required
                  value={input.description}
                  onChange={handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default CreateItem;
export { CREATE_ITEM_MUTATION };
