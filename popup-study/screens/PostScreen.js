import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';
import { NavigationBar } from '@expo/ex-navigation';
import { graphql, gql } from 'react-apollo';

import PostCard from '../components/PostCard';
import TagsList from '../components/TagsList';

class PostScreen extends React.Component {
  static route = {
    navigationBar: {},
  };

  render() {
    if (this.props.data.loading) {
      return <ActivityIndicator />;
    }

    return (
      <View style={styles.container}>
        <PostCard post={this.props.data.post} />
        <View style={styles.description}>
          <Text>{this.props.data.post.description}</Text>
        </View>
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
    backgroundColor: '#efeff4',
  },
  description: {
    padding: 20,
  },
});

const PostQuery = gql`
  query PostQuery($id: ID!) {
    post: Post(id: $id) {
      id
      title
      description
      tags {
        id
        name
        isCourse
      }
    }
  }
`;

export default graphql(PostQuery, {
  options: ({ id }) => ({ variables: { id } }),
})(PostScreen);
