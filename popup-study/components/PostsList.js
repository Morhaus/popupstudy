import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableHighlight,
} from 'react-native';
import { flatten } from 'lodash';
import { withNavigation } from '@expo/ex-navigation';
import Swipeout from 'react-native-swipe-out';

import Router from '../navigation/Router';
import SwipeoutButton from './SwipeoutButton';
import PostCard from './PostCard';

class PostsList extends React.Component {
  render() {
    const { categories, navigator } = this.props;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        stickyHeaderIndices={categories.map((_, idx) => idx * 2)}
      >
        {flatten(
          categories.map(category => [
            <View key={`${category.id}.title`} style={styles.sticky}>
              <Text style={styles.stickyText}>
                {category.title.toUpperCase()}
              </Text>
            </View>,
            <View key={`${category.id}.posts`} style={styles.postsList}>
              {category.posts.map((post, idx) => (
                <View
                  key={post.id}
                  style={[
                    idx !== category.posts.length - 1 &&
                      styles.postCardIntersperse,
                  ]}
                >
                  <Swipeout
                    left={[
                      {
                        component: (
                          <SwipeoutButton
                            title="Save"
                            icon="ios-star-outline"
                          />
                        ),
                        backgroundColor: '#0074D9',
                        underlayColor: '#0f8fff',
                      },
                    ]}
                    right={[
                      {
                        component: (
                          <SwipeoutButton
                            title="Save"
                            icon="ios-star-outline"
                          />
                        ),
                        backgroundColor: '#0074D9',
                        underlayColor: '#0f8fff',
                      },
                    ]}
                  >
                    <TouchableHighlight
                      delayPressIn={300}
                      onPress={() =>
                        navigator.push(
                          Router.getRoute('post', {
                            id: post.id,
                            title: post.title,
                          })
                        )}
                    >
                      <PostCard post={post} />
                    </TouchableHighlight>
                  </Swipeout>
                </View>
              ))}
            </View>,
          ])
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeff4',
  },
  contentContainer: {},
  sticky: {
    backgroundColor: '#efeff4',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 0.5,
    borderColor: '#c8c7cc',
  },
  postsList: {
    borderBottomWidth: 0.5,
    marginBottom: 10,
    borderColor: '#c8c7cc',
  },
  stickyText: {
    color: '#6d6d72',
    fontSize: 13,
  },
  postCardIntersperse: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default withNavigation(PostsList);
