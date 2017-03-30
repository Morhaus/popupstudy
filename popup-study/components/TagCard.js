import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class TagCard extends React.Component {
  render() {
    const { tag } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{tag.name}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#0074D9',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 4,
  },
  text: {
    color: '#0074D9',
  },
});
