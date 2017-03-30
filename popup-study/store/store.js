import Reactotron from 'reactotron-react-native';
import { compose, combineReducers, applyMiddleware } from 'redux';

import reducer from './reducer';
import client from '../utilities/apollo';

// .createStore with only one argument is bugged
// See https://github.com/infinitered/reactotron/issues/313
const store = Reactotron.createStore(
  combineReducers({
    app: reducer,
    apollo: client.reducer(),
  }),
  {},
  compose(applyMiddleware(client.middleware()))
);

export default store;
