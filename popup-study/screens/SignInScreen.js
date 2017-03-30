import React from 'react';
import {
  TextInput,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
} from 'react-native';
import { gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';

import Router from '../navigation/Router';
import Input from '../components/Input';
import { setToken } from '../store/actions';

class SignInScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Sign In',
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
    const { setToken, signInUser } = this.props;
    signInUser({
      variables: { email: this.state.email, password: this.state.password },
    }).then(
      ({ data }) => {
        setToken(data.signinUser.token);
        this.props.navigator.push(Router.getRoute('rootNavigation'));
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
      <View style={styles.container}>
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
      </View>
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
    borderWidth: 1,
    borderColor: '#e3e3e5',
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
    borderTopWidth: 1,
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

const signInUserMutation = gql`
  mutation signInUserMutation($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }) {
      token
    }
  }
`;

export default connect(null, { setToken })(
  graphql(createUserMutation, { name: 'createUser' })(
    graphql(signInUserMutation, { name: 'signInUser' })(SignInScreen)
  )
);
