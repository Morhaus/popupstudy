import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';

class PostScreen extends React.Component {
  static route = {
    navigationBar: {
      title(params) {
        return params.title;
      },
    },
  };

  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default PostScreen;
