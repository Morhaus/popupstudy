import React from 'react';
import {
  TextInput,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import { gql, graphql, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { NavigationStyles } from '@expo/ex-navigation';

import findOrCreateTags from '../utilities/findOrCreateTags';
import Router from '../navigation/Router';
import Input from '../components/Input';
import TagsInput from '../components/TagsInput';

class NewPostScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'New Post',
      renderLeft: state => {
        const { config: { eventEmitter } } = state;

        return (
          <Button title="Cancel" onPress={() => eventEmitter.emit('cancel')} />
        );
      },
      renderRight: state => {
        const { config: { eventEmitter } } = state;

        return (
          <Button
            title="Publish"
            onPress={() => eventEmitter.emit('publish')}
          />
        );
      },
    },
    styles: {
      ...NavigationStyles.SlideVertical,
    },
  };

  state = {
    title: '',
    tags: [],
    description: '',
  };

  componentWillMount() {
    this.subscriptionCancel = this.props.route
      .getEventEmitter()
      .addListener('cancel', this.onCancel);
    this.subscriptionPublish = this.props.route
      .getEventEmitter()
      .addListener('publish', this.onPublish);
  }

  componentWillUnmount() {
    this.subscriptionCancel.remove();
  }

  onCancel = () => {
    this.props.navigator.pop();
  };

  onPublish = () => {
    const { tags } = this.state;
    findOrCreateTags(this.props.client, tags)
      .then(resultTags => {
        return this.props.createPost({
          variables: {
            title: this.state.title,
            description: this.state.description,
            authorId: this.props.userId,
            tagsIds: resultTags.map(tag => tag.id),
          },
        });
      })
      .then(
        ({ data }) => {
          // This is equivalent to an instant push
          const navigator = this.props.navigation.getNavigator(
            'suggestedPosts'
          );
          const routes = navigator._getNavigatorState().routes;
          navigator.immediatelyResetStack(
            routes.concat([
              Router.getRoute('post', {
                id: data.createPost.id,
                title: data.createPost.title,
              }),
            ]),
            routes.length
          );
          setTimeout(() => this.props.navigator.pop(), 10);
        },
        err => {
          console.log(err);
        }
      )
      .catch(e => console.log(e));
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputsContainer}>
          <Input
            label="Title"
            onChangeText={title => this.setState({ title })}
            value={this.state.title}
          />
          <View style={styles.spacer} />
          <TagsInput
            label="Tags"
            multiline
            onChange={tags => this.setState({ tags })}
            value={this.state.tags}
          />
          <View style={styles.spacer} />
          <Input
            label="Description"
            multiline
            style={styles.description}
            onChangeText={description => this.setState({ description })}
            value={this.state.description}
          />
        </View>
      </View>
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
  description: {
    height: 100,
    paddingTop: 5,
  },
});

const createPostMutation = gql`
  mutation createPostMutation($title: String!, $description: String!, $authorId: ID!, $tagsIds: [ID!]) {
    createPost(title: $title, description: $description, authorId: $authorId, tagsIds: $tagsIds) {
      id
      title
    }
  }
`;

const mapStateToProps = state => ({
  userId: state.app.userId,
});

export default connect(mapStateToProps)(
  graphql(createPostMutation, { name: 'createPost' })(withApollo(NewPostScreen))
);
