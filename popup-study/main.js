import Expo from 'expo';
import React from 'react';
import {
  AppRegistry,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  NavigationProvider,
  StackNavigation,
  NavigationContext,
} from '@expo/ex-navigation';
import { FontAwesome } from '@expo/vector-icons';
import { ApolloProvider } from 'react-apollo';

import Router from './navigation/Router';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import './utilities/reactotron';
import store from './store/store';
import client from './utilities/apollo';

const navigationContext = new NavigationContext({
  router: Router,
  store: store,
});

class AppContainer extends React.Component {
  componentWillMount() {
    this._loadAssetsAsync();
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      navigationContext.getNavigator('root').push(Router.getRoute('signin'));
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ApolloProvider store={store} client={client}>
          <NavigationProvider context={navigationContext}>
            <StackNavigation
              id="root"
              initialRoute={Router.getRoute('loading')}
            />
          </NavigationProvider>
        </ApolloProvider>

        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

Expo.registerRootComponent(AppContainer);
