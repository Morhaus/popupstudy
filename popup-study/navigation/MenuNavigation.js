import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
  DrawerNavigation,
  DrawerNavigationItem,
  StackNavigation,
} from '@expo/ex-navigation';
import { Ionicons } from '@expo/vector-icons';

import Router from './Router';
import Colors from '../constants/Colors';

export default class MenuNavigation extends React.Component {
  render() {
    return (
      <DrawerNavigation id="menu" initialItem="posts" drawerWidth={200}>
        <DrawerNavigationItem
          id="posts"
          renderTitle={isSelected => this._renderTitle('Posts', isSelected)}
          renderIcon={isSelected =>
            this._renderIcon('ios-list-outline', isSelected)}
        >

          <StackNavigation id="posts" initialRoute={Router.getRoute('posts')} />
        </DrawerNavigationItem>
        <DrawerNavigationItem
          id="saved"
          renderTitle={isSelected => this._renderTitle('Saved', isSelected)}
          renderIcon={isSelected =>
            this._renderIcon('ios-star-outline', isSelected)}
        >
          <StackNavigation id="saved" initialRoute={Router.getRoute('posts')} />
        </DrawerNavigationItem>
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
