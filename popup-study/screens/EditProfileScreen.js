import React from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { gql, graphql, withApollo } from 'react-apollo';
import { NavigationStyles } from '@expo/ex-navigation';

import findOrCreateTags from '../utilities/findOrCreateTags';
import Input from '../components/Input';
import TagsInput from '../components/TagsInput';
import ImageInput from '../components/ImageInput';

class ConfirmButton extends React.Component {
  componentWillMount() {
    this.subscriptionSetDisabled = this.props.events.addListener(
      'setConfirmDisabled',
      this.setDisabled
    );
  }

  componentWillUnmount() {
    this.subscriptionSetDisabled.remove();
  }

  state = {
    disabled: true,
  };

  setDisabled = disabled => {
    this.setState({ disabled });
  };

  render() {
    return (
      <Button
        title="Confirm"
        disabled={this.state.disabled}
        onPress={() => this.props.events.emit('confirm')}
      />
    );
  }
}

function isDisabled(state) {
  return (
    state.firstName === '' || state.tags.length === 0 || state.image === null
  );
}

async function uploadImage(image) {
  const body = new FormData();
  body.append('data', {
    uri: image,
    type: 'image/jpeg',
    name: 'image.jpg',
  });

  const res = await fetch(
    'https://api.graph.cool/file/v1/cj0cew9fx44ka01547ytdzfs3',
    {
      method: 'post',
      body,
    }
  );

  const file = await res.json();

  return file.id;
}

async function updateUser(client, { id, pictureId, firstName, tags }) {
  const resultTags = await findOrCreateTags(client, tags);

  return await client.mutate({
    mutation: updateUserMutation,
    variables: {
      id,
      firstName,
      tagsIds: resultTags.map(tag => tag.id),
      pictureId,
    },
  });
}

class SetupUserScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Edit profile',
      renderLeft: state => {
        const { config: { eventEmitter }, params } = state;
        if (params.cancel === false) {
          return null;
        }
        return (
          <Button title="Cancel" onPress={() => eventEmitter.emit('cancel')} />
        );
      },
      renderRight: state => {
        const { config: { eventEmitter } } = state;

        return <ConfirmButton events={eventEmitter} />;
      },
    },
    styles: {
      ...NavigationStyles.SlideVertical,
    },
  };

  constructor(props) {
    super(props);

    if (props.data.loading) {
      this.state = {
        firstName: '',
        tags: [],
        imageURL: null,
        imageChanged: false,
      };
    } else {
      this.state = {
        firstName: props.data.user.firstName,
        tags: props.data.user.tags.map(tag => tag.name),
        imageURL: props.data.user.picture.url,
      };
    }
  }

  componentWillMount() {
    this.subscriptionConfirm = this.props.route
      .getEventEmitter()
      .addListener('confirm', this.onConfirm);
    this.subscriptionCancel = this.props.route
      .getEventEmitter()
      .addListener('cancel', this.onCancel);
  }

  componentDidMount() {
    this.props.route
      .getEventEmitter()
      .emit('setConfirmDisabled', isDisabled(this.state));
  }

  componentWillUnmount() {
    this.subscriptionConfirm.remove();
    this.subscriptionCancel.remove();
  }

  onCancel = () => {
    this.props.navigator.pop();
  };

  onConfirm = async () => {
    let pictureId;
    if (this.state.imageChanged) {
      pictureId = await uploadImage(this.state.imageURL);
    } else {
      pictureId = this.props.data.user.picture.id;
    }
    await updateUser(this.props.client, {
      id: this.props.userId,
      firstName: this.state.firstName,
      tags: this.state.tags,
      pictureId,
    });

    this.props.navigator.pop();
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.data.loading && !nextProps.data.loading) {
      this.setState({
        firstName: nextProps.data.user.firstName,
        tags: nextProps.data.user.tags.map(tag => tag.name),
        imageURL: nextProps.data.user.picture.url,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (isDisabled(prevState) !== isDisabled(this.state)) {
      this.props.route
        .getEventEmitter()
        .emit('setConfirmDisabled', isDisabled(this.state));
    }
  }

  render() {
    if (this.props.data.loading) {
      return <ActivityIndicator />;
    }

    return (
      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset={20}
        style={styles.container}
      >
        <View style={styles.inputsContainer}>
          <ImageInput
            label="Select a picture"
            value={this.state.imageURL}
            onChange={imageURL =>
              this.setState({ imageURL, imageChanged: true })}
          />
          <View style={styles.spacer} />
          <Input
            label="First name"
            onChangeText={firstName => this.setState({ firstName })}
            value={this.state.firstName}
          />
          <View style={styles.spacer} />
          <TagsInput
            label="Tags"
            multiline
            onChange={tags => this.setState({ tags })}
            value={this.state.tags}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7f8',
    justifyContent: 'center',
  },
  inputsContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'flex-start',
  },
  spacer: {
    height: 20,
  },
});

const UserQuery = gql`
  query UserQuery {
    user {
      id
      firstName
      tags {
        id
        name
      }
      picture {
        id
        url
      }
    }
  }
`;

const updateUserMutation = gql`
  mutation updateUserMutation($id: ID!, $firstName: String!, $tagsIds: [ID!], $pictureId: ID!) {
    updateUser(
      id: $id
      firstName: $firstName
      tagsIds: $tagsIds
      pictureId: $pictureId
      isSetup: true
    ) {
      id
      firstName
      tags {
        id
        name
      }
      picture {
        id
        url
      }
    }
  }
`;

const mapStateToProps = state => ({
  userId: state.app.userId,
});

export default connect(mapStateToProps)(
  graphql(UserQuery)(withApollo(SetupUserScreen))
);
