import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { flatten } from 'lodash';
import { withNavigation } from '@expo/ex-navigation';
import { gql, graphql } from 'react-apollo';
import moment from 'moment';

import Router from '../navigation/Router';

class ChatList extends React.Component {
  render() {
    const { postId, navigator, data: { loading, threads, user } } = this.props;

    if (loading) {
      return <ActivityIndicator />;
    }

    return (
      <ScrollView style={styles.container}>
        {threads.map((thread, idx) => {
          return (
            <TouchableHighlight
              key={thread.id}
              onPress={() => {
                navigator.push(
                  Router.getRoute('chat', {
                    postId,
                    userId: thread.author.id,
                  })
                );
              }}
            >
              <View
                style={[
                  styles.thread,
                  idx !== threads.length - 1 && styles.threadIntersperse,
                ]}
              >
                <View style={styles.threadMetaContainer}>
                  <Text style={styles.threadName}>
                    {thread.author.email}
                  </Text>
                  <Text style={styles.threadLastMessageTime}>
                    {moment(thread.messages[0].sentAt).fromNow()}
                  </Text>
                </View>
                <View style={styles.threadLastMessage}>
                  <Text style={styles.threadLastMessageAuthor}>
                    {thread.messages[0].author.id === user.id
                      ? 'You'
                      : thread.messages[0].author.email}
                    :
                  </Text>
                  <Text style={styles.threadLastMessageContent}>
                    {thread.messages[0].content}
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          );
        })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeff4',
  },
  thread: {
    backgroundColor: 'white',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  threadName: {
    fontSize: 15,
    fontWeight: '500',
  },
  threadMetaContainer: {
    marginBottom: 5,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  threadLastMessage: {
    flexDirection: 'row',
  },
  threadLastMessageAuthor: {
    marginRight: 5,
  },
  threadIntersperse: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
});

const ThreadsQuery = gql`
  query ThreadsQuery($postId: ID!) {
    threads: allThreads(filter: {
      post: {
        id: $postId
      }
    }) {
      id
      author {
        id
        email
      }
      messages(orderBy: sentAt_DESC, first: 1) {
        id
        author {
          id
          email
        }
        content
        sentAt
      }
    }

    user {
      id
      email
    }
  }
`;

export default withNavigation(graphql(ThreadsQuery)(ChatList));
