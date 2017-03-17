import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import { flatten } from 'lodash';

import AdCard from './AdCard';

export default class AdsList extends React.Component {
  render() {
    const { categories } = this.props;
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        stickyHeaderIndices={categories.map((_, idx) => idx * 2)}
      >
        {flatten(
          categories.map(category => [
            <View key={`${category.id}.title`} style={styles.sticky}>
              <Text style={styles.stickyText}>{category.title}</Text>
            </View>,
            <View key={`${category.id}.ads`} style={styles.adsList}>
              {category.ads.map((ad, idx) => (
                <View
                  key={ad.id}
                  style={[
                    idx !== category.ads.length - 1 && styles.adCardIntersperse,
                  ]}
                >
                  <AdCard ad={ad} />
                </View>
              ))}
            </View>,
          ])
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {},
  sticky: {
    backgroundColor: '#eee',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  stickyText: {
    color: '#666',
    fontVariant: ['small-caps'],
  },
  adCardIntersperse: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
