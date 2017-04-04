import React from 'react';
import {
  TextInput,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';
import { gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { NavigationStyles } from '@expo/ex-navigation';

import Router from '../navigation/Router';
import Input from '../components/Input';
import Message from '../components/Message';

class MessagesList extends React.Component {
  state = {
    content: '',
  };

  componentWillMount() {
    this.unsubscribe = this.props.subscribeToNewMessages({
      initiatorId: this.props.userId,
      postId: this.props.postId,
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onSend = () => {
    const content = this.state.content;
    this.setState(
      state => ({
        ...state,
        content: '',
      }),
      () => {
        this.props
          .createMessage({
            variables: {
              initiatorId: this.props.userId,
              postId: this.props.postId,
              content: content,
              inbound: true,
            },
          })
          .then(
            ({ data }) => {
              // Yay
            },
            err => {}
          );
      }
    );
  };

  render() {
    if (this.props.loading) {
      return <ActivityIndicator />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.messages}>
          {this.props.messages.map((message, idx) => (
            <View
              key={message.id}
              style={[
                idx !== this.props.messages.length - 1 &&
                  styles.messagesIntersperse,
              ]}
            >
              <Message message={message} />
            </View>
          ))}
        </View>
        <View style={styles.inputsContainer}>
          <Input
            label="New Message"
            multiline
            style={styles.content}
            onChangeText={content => this.setState({ content })}
            value={this.state.content}
            returnKeyType="send"
            blurOnSubmit
            onSubmitEditing={this.onSend}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  messages: {
    padding: 20,
    paddingBottom: 0,
  },
  messagesIntersperse: {
    paddingBottom: 5,
  },
  inputsContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
  },
  content: {
    height: 200,
    paddingTop: 5,
  },
});

const createMessageMutation = gql`
  mutation createMessageMutation($postId: ID!, $initiatorId: ID!, $content: String!, $inbound: Boolean!) {
    createMessage(postId: $postId, initiatorId: $initiatorId, content: $content, inbound: $inbound) {
      id
    }
  }
`;

const MessagesQuery = gql`
  ${Message.fragments.message}

  query MessagesQuery($postId: ID!, $initiatorId: ID!) {
    allMessages(filter: { post: { id: $postId }, initiator: { id: $initiatorId }}) {
      id
      ...MessageMessage
    }
  }
`;

const MessagesSubscription = gql`
  ${Message.fragments.message}

  subscription MessagesSubscription($postId: ID!, $initiatorId: ID!) {
    Message(filter: {
      mutation_in: [CREATED]
      node: {
        post: { id: $postId }
        initiator: { id: $initiatorId }
      }
    }) {
      mutation
      node {
        id
        ...MessageMessage
      }
    }
  }
`;

const mapStateToProps = state => ({
  userId: state.app.userId,
});

export default connect(mapStateToProps)(
  graphql(MessagesQuery, {
    name: 'messages',

    options: ({ userId, postId }) => ({
      variables: {
        initiatorId: userId,
        postId: postId,
      },
    }),

    props: ({ messages }) => {
      return {
        loading: messages.loading,
        messages: messages.allMessages,
        subscribeToNewMessages: ({ initiatorId, postId }) => {
          return messages.subscribeToMore({
            document: MessagesSubscription,
            variables: {
              initiatorId,
              postId,
            },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) {
                return prev;
              }

              return {
                ...prev,
                allMessages: [
                  ...prev.allMessages,
                  subscriptionData.data.Message.node,
                ],
              };
            },
          });
        },
      };
    },
  })(graphql(createMessageMutation, { name: 'createMessage' })(MessagesList))
);
