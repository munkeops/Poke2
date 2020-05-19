import React from "react";

import Header from "../components/header/header";

export const Layout = (props) => {
  return (
    <>
      <Header />
      {props.children}
    </>
  );
};
