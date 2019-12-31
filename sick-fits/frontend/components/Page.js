import React from "react";

import Header from "../components/Header";
import Meta from "../components/Meta";

const Page = props => {
  return (
    <div>
      <Meta />
      <Header />
      {props.children}
    </div>
  );
};

export default Page;
