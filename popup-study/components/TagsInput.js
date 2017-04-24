import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';

import RNTagInput from 'react-native-tag-input';

export default class TagsInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focus: false,
    };
  }

  render() {
    const { label, style, onChange, value, ...otherProps } = this.props;
    return (
      <View
        style={[styles.container, this.state.focus && styles.containerFocus]}
        shadowColor="#cbcbcb"
        shadowOffset={{ width: 0, height: 0.5 }}
        shadowOpacity={1}
        shadowRadius={0}
      >
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.input, style]}>
          <RNTagInput
            value={value}
            onChange={onChange}
            tagContainerStyle={{
              marginTop: 3,
            }}
            inputProps={{
              ...otherProps,
              onFocus: () => this.setState({ focus: true }),
              onBlur: () => this.setState({ focus: false }),
              placeholder: '',
            }}
          />
        </View>
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
    height: 42,
    alignSelf: 'stretch',
    overflow: 'visible',
    backgroundColor: 'white',
    paddingTop: 2,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 2,
  },
});
