import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ApolloClient } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { url, ws } from "./url";
import { InMemoryCache, defaultDataIdFromObject } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { split, ApolloLink } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { BrowserRouter } from "react-router-dom";
import { setContext } from "apollo-link-context";
import { USRTOKEN } from "./components/Mode";
import { onError } from "apollo-link-error";

const httplink = createHttpLink({
  uri: url
});

const wsLink = new WebSocketLink({
  uri: ws,
  options: {
    reconnect: true
  }
});

const auth = setContext((_, { headers }) => {
  const token = sessionStorage.getItem(USRTOKEN);
  console.log("token", token);
  return {
    headers: {
      ...headers,
      authorization: token ? token : null
    }
  };
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

const link = ApolloLink.from([
  errorLink,
  split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    auth.concat(httplink)
  )
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    dataIdFromObject: object => {
      switch (object.__typename) {
        case "BoardWithDupeValue":
          return object.sessionID;
        default:
          return defaultDataIdFromObject(object);
      }
    }
  }),
  connectToDevTools: true
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
