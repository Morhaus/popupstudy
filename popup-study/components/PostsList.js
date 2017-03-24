import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { flatten } from 'lodash';

import PostCard from './PostCard';

export default class PostsList extends React.Component {
  render() {
    const { categories } = this.props;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        stickyHeaderIndices={categories.map((_, idx) => idx * 2)}
      >
        {flatten(
          categories.map(category => [
            <View key={`${category.id}.title`} style={styles.sticky}>
              <Text style={styles.stickyText}>{category.title}</Text>
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
                  <PostCard post={post} />
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
    backgroundColor: '#fff',
  },
  contentContainer: {},
  sticky: {
    backgroundColor: '#eee',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  stickyText: {
    color: '#666',
    fontVariant: ['small-caps'],
  },
  postCardIntersperse: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
