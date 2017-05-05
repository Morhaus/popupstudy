import ApolloClient, { createNetworkInterface } from 'apollo-client';
import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';

const wsClient = new SubscriptionClient(
  'wss://subscriptions.graph.cool/v1/cj0cew9fx44ka01547ytdzfs3',
  {
    reconnect: true,
  }
);

const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/cj0cew9fx44ka01547ytdzfs3',
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

networkInterfaceWithSubscriptions.use([
  {
    applyMiddleware(req, next) {
      // Circular dependency.
      const store = require('../store/store').default;

      if (!req.options.headers) {
        req.options.headers = {};
      }

      if (store.getState().app.token !== null) {
        req.options.headers.authorization = `Bearer ${store.getState().app.token}`;
      }

      next();
    },
  },
]);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject: o => o.id,
});

export default client;
