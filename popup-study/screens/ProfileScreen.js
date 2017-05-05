import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
  Image,
} from 'react-native';
import { graphql, gql } from 'react-apollo';

import Router from '../navigation/Router';
import TagsList from '../components/TagsList';

class ProfileScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Profile',

      renderRight: state => {
        const { config: { eventEmitter } } = state;

        return (
          <Button title="Edit" onPress={() => eventEmitter.emit('edit')} />
        );
      },
    },
  };

  componentWillMount() {
    this.subscriptionEdit = this.props.route
      .getEventEmitter()
      .addListener('edit', this.onEdit);
  }

  componentWillUnmount() {
    this.subscriptionEdit.remove();
  }

  onEdit = () => {
    this.props.navigation
      .getNavigator('root')
      .push(Router.getRoute('editProfile'));
  };

  render() {
    const { loading } = this.props;

    if (this.props.data.loading) {
      return <ActivityIndicator />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: this.props.data.user.picture.url }}
            style={styles.image}
          />
          <View style={styles.right}>
            <Text style={styles.firstName}>
              {this.props.data.user.firstName}
            </Text>
            <TagsList tags={this.props.data.user.tags} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    overflow: 'hidden',
    height: 120,
    width: 120,
    borderRadius: 60,
    marginRight: 20,
  },
  firstName: {
    fontSize: 20,
    marginBottom: 5,
  },
});

const ProfileQuery = gql`
  query ProfileQuery {
    user {
      id
      firstName
      picture {
        id
        url
      }
      tags {
        id
        name
      }
    }
  }
`;

export default graphql(ProfileQuery)(ProfileScreen);
