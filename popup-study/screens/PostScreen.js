import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';
import { NavigationBar } from '@expo/ex-navigation';
import { graphql, gql } from 'react-apollo';
import { GiftedChat } from 'react-native-gifted-chat';
import { connect } from 'react-redux';

import Router from '../navigation/Router';
import PostCard from '../components/PostCard';
import TagsList from '../components/TagsList';
import Chat from '../components/Chat';

class PostScreen extends React.Component {
  static route = {
    navigationBar: {},
  };

  render() {
    const { loading, userId } = this.props;

    if (this.props.data.loading) {
      return <ActivityIndicator />;
    }

    return (
      <View style={styles.container}>
        <PostCard post={this.props.data.post} />
        <View style={styles.description}>
          <Text>{this.props.data.post.description}</Text>
        </View>
        {this.props.data.post.author.id === userId
          ? <View style={styles.chatList} />
          : <View style={styles.chat}>
              <Chat postId={this.props.data.post.id} />
            </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
  chatList: {
    flex: 1,
    backgroundColor: 'red',
  },
  chat: {
    flex: 1,
    backgroundColor: 'white',
  },
  description: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#b2b2b2',
  },
});

const PostQuery = gql`
  query PostQuery($id: ID!) {
    post: Post(id: $id) {
      id
      title
      description
      author {
        id
      }
      tags {
        id
        name
        isCourse
      }
    }
  }
`;

export default connect(state => ({ userId: state.app.userId }))(
  graphql(PostQuery, {
    options: ({ id }) => ({ variables: { id } }),
  })(PostScreen)
);
