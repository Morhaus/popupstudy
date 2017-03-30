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

import PostsList from '../components/PostsList';

class PostsScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Posts',
      renderRight(...args) {
        return <Button title="New" onPress={() => {}} />;
      },
    },
  };

  render() {
    if (this.props.data.loading) {
      return <ActivityIndicator />;
    }

    // const myPosts = [
    //   {
    //     id: '0',
    //     title: 'Groupmate',
    //     tags: ['TIE-000', 'TIE-001'],
    //     requests: 2,
    //   },
    //   {
    //     id: '1',
    //     title: 'Groupmate',
    //     tags: ['TIE-000'],
    //   },
    //   {
    //     id: '2',
    //     title: 'Groupmate',
    //     tags: ['TIE-000'],
    //   },
    // ];
    // const suggestedPosts = [
    //   {
    //     id: '0',
    //     title: 'Tutor',
    //     tags: ['TIE-000'],
    //   },
    //   {
    //     id: '1',
    //     title: 'Tutor',
    //     tags: ['TIE-000'],
    //   },
    //   {
    //     id: '2',
    //     title: 'Tutor',
    //     tags: ['TIE-000'],
    //   },
    //   {
    //     id: '3',
    //     title: 'Tutor',
    //     tags: ['TIE-000'],
    //   },
    //   {
    //     id: '4',
    //     title: 'Tutor',
    //     tags: ['TIE-000'],
    //   },
    //   {
    //     id: '5',
    //     title: 'Tutor',
    //     tags: ['TIE-000'],
    //   },
    // ];
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
