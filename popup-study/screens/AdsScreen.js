import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';

import AdsList from '../components/AdsList';

export default class AdsScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Ads',
      renderRight(...args) {
        return <Button title="New" onPress={() => {}} />;
      },
    },
  };

  render() {
    const myAds = [
      {
        id: '0',
        title: 'Groupmate',
        tags: ['TIE-000', 'TIE-001'],
        requests: 2,
      },
      {
        id: '1',
        title: 'Groupmate',
        tags: ['TIE-000'],
      },
      {
        id: '2',
        title: 'Groupmate',
        tags: ['TIE-000'],
      },
    ];
    const suggestedAds = [
      {
        id: '0',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
      {
        id: '1',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
      {
        id: '2',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
      {
        id: '3',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
      {
        id: '4',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
      {
        id: '5',
        title: 'Tutor',
        tags: ['TIE-000'],
      },
    ];
    return (
      <View style={styles.container}>
        <AdsList
          categories={[
            {
              id: 'myAds',
              title: 'My ads',
              ads: myAds,
            },
            {
              id: 'suggestedAds',
              title: 'Suggested',
              ads: suggestedAds,
            },
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
