import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

export default class LoadingScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
    },
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Popup</Text>
        </View>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeff4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    fontSize: 30,
    color: '#666',
  },
});
