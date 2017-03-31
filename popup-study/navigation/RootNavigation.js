import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Notifications } from 'expo';
import {
  StackNavigation,
  DrawerNavigation,
  DrawerNavigationItem,
} from '@expo/ex-navigation';
import { Ionicons } from '@expo/vector-icons';

import Alerts from '../constants/Alerts';
import Colors from '../constants/Colors';
import registerForPushNotificationsAsync
  from '../api/registerForPushNotificationsAsync';

export default class RootNavigation extends React.Component {
  componentDidMount() {
    this._notificationSubscription = this._registerForPushNotifications();
  }

  componentWillUnmount() {
    this._notificationSubscription && this._notificationSubscription.remove();
  }

  render() {
    return (
      <DrawerNavigation initialItem="posts" drawerWidth={200}>
        <DrawerNavigationItem
          id="posts"
          renderTitle={isSelected => this._renderTitle('Posts', isSelected)}
          renderIcon={isSelected =>
            this._renderIcon('ios-list-outline', isSelected)}
        >
          <StackNavigation initialRoute="posts" />
        </DrawerNavigationItem>
        <DrawerNavigationItem
          id="saved"
          renderTitle={isSelected => this._renderTitle('Saved', isSelected)}
          renderIcon={isSelected =>
            this._renderIcon('ios-star-outline', isSelected)}
        />
      </DrawerNavigation>
    );
  }

  _renderTitle(text, isSelected) {
    return (
      <Text
        style={[
          styles.buttonTitleText,
          isSelected ? styles.selectedText : null,
        ]}
      >
        {text}
      </Text>
    );
  }

  _renderIcon(name, isSelected) {
    return (
      <Ionicons
        name={name}
        size={24}
        color={isSelected ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }

  _registerForPushNotifications() {
    // Send our push token over to our backend so we can receive notifications
    // You can comment the following line out if you want to stop receiving
    // a notification every time you open the app. Check out the source
    // for this function in api/registerForPushNotificationsAsync.js
    registerForPushNotificationsAsync();

    // Watch for incoming notifications
    this._notificationSubscription = Notifications.addListener(
      this._handleNotification
    );
  }

  _handleNotification = ({ origin, data }) => {
    this.props.navigator.showLocalAlert(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`,
      Alerts.notice
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonTitleText: {
    color: '#222',
    fontWeight: 'bold',
    marginLeft: 18,
  },
  icon: {
    color: '#999',
  },
  selectedText: {
    color: '#0084FF',
  },
  selectedItemStyle: {
    backgroundColor: '#E8E8E8',
  },
  selectedTab: {
    color: Colors.tabIconSelected,
  },
});
