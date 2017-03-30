import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';
import { graphql, gql } from 'react-apollo';

import TagsList from '../components/TagsList';

class PostScreen extends React.Component {
  static route = {
    navigationBar: {
      title(params) {
        return params.title;
      },
    },
  };

  render() {
    if (this.props.data.loading) {
      return <ActivityIndicator />;
    }

    return (
      <View style={styles.container}>
        <TagsList tags={this.props.data.post.tags} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const PostQuery = gql`
  query PostQuery($id: ID!) {
    post: Post(id: $id) {
      id
      title
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
