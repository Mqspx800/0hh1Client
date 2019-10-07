import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import apolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { url } from "./url";
import { InMemoryCache } from "apollo-cache-inmemory";

const client = new apolloClient({
  uri: url,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
