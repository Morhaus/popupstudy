import React from 'react';
import {
  TextInput,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { NavigationStyles } from '@expo/ex-navigation';

import Router from '../navigation/Router';
import Input from '../components/Input';
import { setUser } from '../store/actions';

class SigninScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Sign In',
      renderLeft: () => null,
    },
    styles: {
      ...NavigationStyles.SlideVertical,
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      focus: null,
    };
  }

  onSignIn = () => {
    const { setUser, signinUser } = this.props;
    signinUser({
      variables: { email: this.state.email, password: this.state.password },
    }).then(
      ({ data }) => {
        setUser(data.signinUser.user.id, data.signinUser.token);
        // This is a way to replace the preceding route and pop to it.
        this.props.navigator.immediatelyResetStack(
          [Router.getRoute('menuNavigation'), Router.getRoute('signin')],
          1
        );
        // @TODO: Figure out a better way to do this.
        setTimeout(() => this.props.navigator.pop(), 10);
      },
      error => {
        console.log({ error });
        error.graphQLErrors.forEach(error => {
          switch (error.code) {
            case 3022:
              Alert.alert('Wrong email or password.');
              break;
            default:
              Alert.alert('An unknown error has occurred.');
              break;
          }
        });
      }
    );
  };

  onSignUp = () => {
    const { createUser } = this.props;

    createUser({
      variables: { email: this.state.email, password: this.state.password },
    }).then(
      () => {
        this.onSignIn();
      },
      error => {
        console.log({ error });
        error.graphQLErrors.forEach(error => {
          switch (error.code) {
            case 3023:
              Alert.alert('A user with that email already exists.');
              break;
            default:
              Alert.alert('An unknown error has occurred.');
              break;
          }
        });
      }
    );
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset={20}
        style={styles.container}
      >
        <View style={styles.form}>
          <View style={styles.inputsContainer}>
            <Input
              label="Email"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />
            <View style={styles.spacer} />
            <Input
              label="Password"
              secureTextEntry
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <Button onPress={this.onSignUp} title="Sign Up" />
            <View style={styles.spacer} />
            <Button onPress={this.onSignIn} title="Sign In" />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9eaed',
    justifyContent: 'center',
  },
  form: {
    flex: 0,
    borderWidth: 0.5,
    borderColor: '#cbcbcd',
    borderRadius: 5,
    overflow: 'hidden',
    marginLeft: '10%',
    marginRight: '10%',
  },
  inputsContainer: {
    backgroundColor: '#f6f7f8',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  spacer: {
    height: 20,
  },
  buttonsContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderTopWidth: 0.5,
    borderTopColor: '#e9eaec',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  signUpButtonResizer: {
    height: 10,
  },
});

const createUserMutation = gql`
  mutation createUserMutation($email: String!, $password: String!) {
    createUser(authProvider: { email: { email: $email, password: $password }}) {
      id
    }
  }
`;

const signinUserMutation = gql`
  mutation signinUserMutation($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }) {
      token
      user {
        id
      }
    }
  }
`;

export default connect(null, { setUser })(
  graphql(createUserMutation, { name: 'createUser' })(
    graphql(signinUserMutation, { name: 'signinUser' })(SigninScreen)
  )
);
