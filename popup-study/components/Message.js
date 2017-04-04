import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { propType } from 'graphql-anywhere';
import { gql } from 'react-apollo';

const MessageMessage = gql`
  fragment MessageMessage on Message {
    inbound
    content
  }
`;

export default class Message extends React.Component {
  static fragments = {
    message: MessageMessage,
  };

  static propTypes = {
    message: propType(MessageMessage).isRequired,
  };

  render() {
    const { message } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{message.content}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0074D9',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    maxWidth: 200,
  },
  text: {
    color: 'white',
    backgroundColor: 'transparent',
  },
});
