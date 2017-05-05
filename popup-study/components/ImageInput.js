import React from 'react';
import { View, StyleSheet, Text, Image, Button } from 'react-native';
import { ImagePicker } from 'expo';

export default class ImageInput extends React.Component {
  onSelectPicture = () => {
    ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
    }).then(result => {
      if (!result.cancelled) {
        this.props.onChange(result.uri);
      }
    });
  };

  render() {
    const { label, style, value, ...otherProps } = this.props;
    return (
      <View style={styles.container}>
        {value !== null
          ? <Image source={{ uri: value }} style={styles.image} />
          : <View style={[styles.image, styles.placeholder]} />}
        <Button
          title={label}
          onPress={this.onSelectPicture}
          style={styles.label}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    overflow: 'hidden',
    height: 120,
    width: 120,
    borderRadius: 60,
    marginRight: 10,
  },
  placeholder: {
    backgroundColor: 'white',
  },
});
