import { createRouter } from '@expo/ex-navigation';

import SignInScreen from '../screens/SignInScreen';
import RootNavigation from './RootNavigation';
import PostsScreen from '../screens/PostsScreen';
import PostScreen from '../screens/PostScreen';

export default createRouter(() => ({
  signIn: () => SignInScreen,
  rootNavigation: () => RootNavigation,
  posts: () => PostsScreen,
  post: () => PostScreen,
}));
