import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  DrawerNavigation,
  DrawerNavigationItem,
  StackNavigation,
  withNavigation,
} from '@expo/ex-navigation';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import { tintColor } from '../constants/Colors';
import { clearUser } from '../store/actions';
import Router from './Router';
import Colors from '../constants/Colors';

const routeConfig = {
  navigationBar: {
    tintColor: Colors.tintColor,
    titleStyle: {
      color: 'black',
    },
  },
};

class MenuNavigation extends React.Component {
  render() {
    const { dispatch, navigation } = this.props;
    return (
      <DrawerNavigation
        id="menu"
        initialItem="suggestedPosts"
        drawerWidth={200}
        renderHeader={this._renderHeader}
      >
        <DrawerNavigationItem
          id="suggestedPosts"
          renderTitle={isSelected => this._renderTitle('Posts', isSelected)}
          renderIcon={isSelected =>
            this._renderIcon('ios-list-box-outline', isSelected)}
        >
          <StackNavigation
            id="suggestedPosts"
            initialRoute={Router.getRoute('suggestedPosts')}
            defaultRouteConfig={routeConfig}
          />
        </DrawerNavigationItem>
        <DrawerNavigationItem
          id="myPosts"
          renderTitle={isSelected => this._renderTitle('My Posts', isSelected)}
          renderIcon={isSelected =>
            this._renderIcon('ios-archive-outline', isSelected)}
        >
          <StackNavigation
            id="myPosts"
            initialRoute={Router.getRoute('myPosts')}
            defaultRouteConfig={routeConfig}
          />
        </DrawerNavigationItem>
        <DrawerNavigationItem
          id="profile"
          renderTitle={isSelected => this._renderTitle('Profile', isSelected)}
          renderIcon={isSelected =>
            this._renderIcon('ios-person-outline', isSelected)}
          defaultRouteConfig={routeConfig}
        >
          <StackNavigation
            id="profile"
            initialRoute={Router.getRoute('profile')}
            defaultRouteConfig={routeConfig}
          />
        </DrawerNavigationItem>
        <DrawerNavigationItem
          id="logOut"
          renderTitle={isSelected => this._renderTitle('Log out', isSelected)}
          renderIcon={isSelected => this._renderIcon('ios-log-out', isSelected)}
          onPress={() => {
            navigation
              .getNavigator('root')
              .immediatelyResetStack([Router.getRoute('loading')], 0);
            setTimeout(() => {
              navigation.getNavigator('root').push(Router.getRoute('signin'));
              dispatch(clearUser());
            }, 10);
          }}
        />
      </DrawerNavigation>
    );
  }

  _renderHeader() {
    return <View style={{ height: 30 }} />;
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
      <View style={styles.icon}>
        <Ionicons
          name={name}
          size={24}
          color={isSelected ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonTitleText: {
    color: '#222',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'center',
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

export default withNavigation(connect()(MenuNavigation));
