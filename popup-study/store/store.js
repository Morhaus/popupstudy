import Reactotron from 'reactotron-react-native';
import { compose, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
  createNavigationEnabledStore,
  NavigationReducer,
} from '@expo/ex-navigation';

import reducer from './reducer';
import client from '../utilities/apollo';

const createStoreWithNavigation = createNavigationEnabledStore({
  createStore: Reactotron.createStore,
  navigationStateKey: 'navigation',
});

// .createStore with only one argument is bugged
// See https://github.com/infinitered/reactotron/issues/313
const store = createStoreWithNavigation(
  combineReducers({
    navigation: NavigationReducer,
    app: reducer,
    apollo: client.reducer(),
  }),
  {},
  compose(applyMiddleware(client.middleware(), thunk))
);

export default store;
