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
import { connect } from 'react-redux';

import Colors from '../constants/Colors';
import Router from '../navigation/Router';
import PostsList from '../components/PostsList';

class SuggestedPostsScreen extends React.Component {
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
              id: 'suggestedPosts',
              title: 'Suggested',
              posts: this.props.data.suggestedPosts,
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

  query PostsQuery($userId: ID!) {
    suggestedPosts: allPosts(filter: { author: { id_not: $userId } }) {
      ...presentationPost
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default connect(state => ({ userId: state.app.userId }))(
  graphql(PostsQuery, {
    options: ({ userId }) => ({ variables: { userId } }),
  })(SuggestedPostsScreen)
);
