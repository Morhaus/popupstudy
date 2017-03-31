import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import TagsList from './TagsList';

class PostCard extends React.Component {
  // PostCard is used under a TouchableHighlight in PostsLists
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps);
  }

  render() {
    const { post } = this.props;
    return (
      <View ref={component => this._root = component} style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.title}>{post.title}</Text>
          <View style={styles.tagsList}>
            <TagsList tags={post.tags} />
          </View>
        </View>
        <View style={styles.right}>
          {post.requests > 0 &&
            <View style={styles.notif}>
              <Text style={styles.notifText}>{post.requests}</Text>
            </View>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  left: {
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  tagsList: {
    paddingTop: 4,
  },
  notif: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 133, 27, 0.6)',
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 13,
  },
  notifText: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 133, 27, 1)',
    fontSize: 16,
  },
});

export default PostCard;
