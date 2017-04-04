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
    const { label, style, ...otherProps } = this.props;
    return (
      <View
        style={[styles.container, this.state.focus && styles.containerFocus]}
      >
        <Text style={styles.label}>{label}</Text>
        <TextInput
          {...otherProps}
          onFocus={() => this.setState({ focus: true })}
          onBlur={() => this.setState({ focus: false })}
          style={[styles.input, style]}
          shadowColor="#cbcbcb"
          shadowOffset={{ width: 0, height: 0.5 }}
          shadowOpacity={1}
          shadowRadius={0}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  containerFocus: {
    borderColor: '#0074D9',
  },
  label: {
    color: '#666',
    marginBottom: 5,
  },
  input: {
    overflow: 'visible',
    height: 40,
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 2,
  },
});
