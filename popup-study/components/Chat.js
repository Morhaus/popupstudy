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
import { GiftedChat } from 'react-native-gifted-chat';
import uuid from 'uuid/v4';
import update from 'immutability-helper';

import Router from '../navigation/Router';
import Input from '../components/Input';
import Message from '../components/Message';

function transformMessage(message) {
  return {
    _id: message.id,
    text: message.content,
    createdAt: message.sentAt,
    user: {
      _id: message.author.id,
      name: message.author.firstName || message.author.email,
      avatar: message.author.picture && message.author.picture.url,
    },
  };
}

class Chat extends React.Component {
  state = {
    content: '',
  };

  componentWillUnmount() {
    this.props.unsubscribe();
  }

  onSend = messages => {
    const content = this.state.content;
    this.setState(
      state => ({
        ...state,
        content: '',
      }),
      () => {
        // @TODO: support multiple messages
        const message = messages[0];
        this.props.createMessage({
          content: message.text,
          sentAt: new Date().toISOString(),
        });
      }
    );
  };

  render() {
    const { loading, user } = this.props;

    if (this.props.loading) {
      return <ActivityIndicator />;
    }

    return (
      <View style={styles.container}>
        <GiftedChat
          style={{ flex: 1 }}
          onSend={this.onSend}
          messages={this.props.messages.map(m => transformMessage(m))}
          user={{
            _id: user.id,
            name: user.email,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

const createMessageMutation = gql`
  mutation createMessageMutation(
    $threadId: ID!
    $authorId: ID!
    $content: String!
    $sentAt: DateTime!
  ) {
    createMessage(
      threadId: $threadId
      authorId: $authorId
      content: $content
      sentAt: $sentAt
    ) {
      id
    }
  }
`;

const createThreadMutation = gql`
  mutation createThreadMutation($postId: ID!, $authorId: ID!) {
    createThread(postId: $postId, authorId: $authorId) {
      id
    }
  }
`;

const ThreadsQuery = gql`
  query ThreadsQuery($postId: ID!, $userId: ID!) {
    threads: allThreads(filter: {
      post: {
        id: $postId
      }
      author: {
        id: $userId
      }
    }) {
      id
      messages(orderBy: sentAt_DESC) {
        id
        author {
          id
          firstName
          picture {
            id
            url
          }
        }
        content
        sentAt
      }
    }

    user {
      id
      firstName
      picture {
        id
        url
      }
    }
  }
`;

const MessagesSubscription = gql`
  subscription MessagesSubscription($threadId: ID!) {
    Message(filter: {
      mutation_in: [CREATED]
      node: {
        thread: { id: $threadId }
      }
    }) {
      mutation
      node {
        id
        author {
          id
          firstName
          picture {
            id
            url
          }
        }
        content
        sentAt
      }
    }
  }
`;

export default graphql(createMessageMutation, { name: 'createMessage' })(
  graphql(createThreadMutation, { name: 'createThread' })(
    graphql(ThreadsQuery, {
      name: 'threadsQuery',

      options: ({ postId, userId }) => ({
        variables: {
          postId,
          userId,
        },
      }),

      props: ({
        threadsQuery,
        ownProps: { postId, createMessage, createThread },
      }) => {
        if (threadsQuery.loading) {
          return {
            loading: true,
          };
        }

        if (threadsQuery.error) {
          throw threadsQuery.error;
        }

        let thread = threadsQuery.threads.length > 0
          ? threadsQuery.threads[0]
          : {
              id: null,
              messages: [],
            };

        const subscribe = threadId => {
          return threadsQuery.subscribeToMore({
            document: MessagesSubscription,
            variables: {
              threadId,
            },
            updateQuery: (previousResult, { subscriptionData }) => {
              const newMessage = subscriptionData.data.Message.node;
              if (
                previousResult.threads[0].messages.some(
                  m => m.id === newMessage.id
                )
              ) {
                return previousResult;
              }
              return update(previousResult, {
                threads: {
                  0: {
                    messages: {
                      $unshift: [newMessage],
                    },
                  },
                },
              });
            },
          });
        };
        let unsubscribe = thread.id !== null ? subscribe(thread.id) : () => {};

        return {
          loading: false,
          user: threadsQuery.user,
          messages: thread.messages,
          unsubscribe: () => unsubscribe(),
          createMessage: ({ content, sentAt }) => {
            const threadPromise = thread.id === null
              ? createThread({
                  variables: { postId, authorId: threadsQuery.user.id },
                  updateQueries: {
                    ThreadsQuery: (previousResult, { mutationResult }) => ({
                      ...previousResult,
                      threads: [
                        {
                          ...mutationResult.data.createThread,
                          messages: [],
                        },
                      ],
                    }),
                  },
                }).then(({ data }) => {
                  if (thread.id === null) {
                    thread = data.createThread;
                    unsubscribe = subscribe(thread.id);
                  }
                  return data.createThread;
                })
              : Promise.resolve(thread);

            return threadPromise.then(thread => {
              const tempId = uuid();
              return createMessage({
                variables: {
                  threadId: thread.id,
                  authorId: threadsQuery.user.id,
                  content,
                  sentAt,
                },
                optimisticResponse: {
                  createMessage: {
                    __typename: 'Message',
                    id: tempId,
                  },
                },
                updateQueries: {
                  ThreadsQuery: (previousResult, { mutationResult }) => {
                    const newMessage = mutationResult.data.createMessage;
                    if (
                      previousResult.threads[0].messages.some(
                        m => m.id === newMessage.id
                      )
                    ) {
                      return previousResult;
                    }
                    return update(previousResult, {
                      threads: {
                        0: {
                          messages: {
                            $unshift: [
                              {
                                ...newMessage,
                                content,
                                sentAt,
                                author: threadsQuery.user,
                              },
                            ],
                          },
                        },
                      },
                    });
                  },
                },
              });
            });
          },
        };
      },
    })(Chat)
  )
);
