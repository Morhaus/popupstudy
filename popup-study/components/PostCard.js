import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableHighlight,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { withNavigation } from '@expo/ex-navigation';

import Router from '../navigation/Router';
import TagsList from './TagsList';

class PostCard extends React.Component {
  render() {
    const { post, navigator } = this.props;
    return (
      <TouchableHighlight
        onPress={() =>
          navigator.push(
            Router.getRoute('post', { id: post.id, title: post.title })
          )}
      >
        <View style={styles.container}>
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
            <Ionicons name="ios-arrow-forward" size={24} color="#ccc" />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default withNavigation(PostCard);
