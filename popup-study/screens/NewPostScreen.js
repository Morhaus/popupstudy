import React from 'react';
import {
  TextInput,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
} from 'react-native';
import { gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { NavigationStyles } from '@expo/ex-navigation';

import Router from '../navigation/Router';
import Input from '../components/Input';

class NewPostScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'New Post',
      renderLeft: () => null,
      renderRight: state => {
        const { config: { eventEmitter } } = state;

        return (
          <Button title="Cancel" onPress={() => eventEmitter.emit('cancel')} />
        );
      },
    },
    styles: {
      ...NavigationStyles.SlideVertical,
    },
  };

  componentWillMount() {
    this.subscriptionCancel = this.props.route
      .getEventEmitter()
      .addListener('cancel', this.onCancel);
  }

  componentWillUnmount() {
    this.subscriptionCancel.remove();
  }

  onCancel = () => {
    this.props.navigator.pop();
  };

  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9eaed',
    justifyContent: 'center',
  },
});

export default NewPostScreen;
