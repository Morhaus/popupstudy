import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';

export default class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focus: false,
    };
  }

  render() {
    const { label, ...otherProps } = this.props;
    return (
      <View
        style={[styles.container, this.state.focus && styles.containerFocus]}
      >
        <Text style={styles.label}>{label}</Text>
        <TextInput
          {...otherProps}
          onFocus={() => this.setState({ focus: true })}
          onBlur={() => this.setState({ focus: false })}
          style={styles.input}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  containerFocus: {
    borderColor: '#0074D9',
  },
  label: {
    color: '#666',
    marginBottom: 5,
  },
  input: {
    height: 40,
  },
});
