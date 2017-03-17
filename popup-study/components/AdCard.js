import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import TagsList from './TagsList';

export default class AdCard extends React.Component {
  render() {
    const { ad } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{ad.title}</Text>
        <View style={styles.tagsList}>
          <TagsList tags={ad.tags} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  title: {
    fontSize: 16,
  },
  tagsList: {
    paddingTop: 4,
  },
});
