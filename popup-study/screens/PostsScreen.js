import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';
import { gql, graphql } from 'react-apollo';

import Router from '../navigation/Router';
import PostsList from '../components/PostsList';

class PostsScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Posts',
      renderRight(state) {
        const { config: { eventEmitter } } = state;

        return <Button title="New" onPress={() => eventEmitter.emit('new')} />;
      },
    },
  };

  componentWillMount() {
    this.subscriptionNew = this.props.route
      .getEventEmitter()
      .addListener('new', this.onNew);
  }

  componentWillUnmount() {
    this.subscriptionNew.remove();
  }

  onNew = () => {
    this.props.navigation.getNavigator('root').push(Router.getRoute('newPost'));
  };

  render() {
    if (this.props.data.loading) {
      return <ActivityIndicator />;
    }

    return (
      <View style={styles.container}>
        <PostsList
          categories={[
            {
              id: 'myPosts',
              title: 'My posts',
              posts: this.props.data.user.posts,
            },
            {
              id: 'suggestedPosts',
              title: 'Suggested',
              posts: this.props.data.allPosts,
            },
          ]}
        />
      </View>
    );
  }
}

const PostsQuery = gql`
  fragment presentationPost on Post {
    id
    title
    tags {
      id
      name
      isCourse
    }
  }

  query PostsQuery {
    allPosts {
      ...presentationPost
    }
    user {
      posts {
        ...presentationPost
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default graphql(PostsQuery)(PostsScreen);
