import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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

    const myPosts = [
      {
        id: '0',
        title: 'Groupmate',
        tags: ['TIE-000', 'TIE-001'],
        requests: 2,
      },
      {
        id: '1',
        title: 'Groupmate',
        tags: ['TIE-000'],
      },
      {
        id: '2',
        title: 'Groupmate',
        tags: ['TIE-000'],
      },
    ];
    const suggestedPosts = [
      {
        id: '0',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
      {
        id: '1',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
      {
        id: '2',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
      {
        id: '3',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
      {
        id: '4',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
      {
        id: '5',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
    ];
    return (
      <View style={styles.container}>
        <PostsList
          categories={[
            {
              id: 'myPosts',
              title: 'My posts',
              posts: myPosts,
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
  query PostsQuery {
    allPosts {
      id,
      title,
      tags {
        name,
        isCourse
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
