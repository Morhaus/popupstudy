import { createRouter } from '@expo/ex-navigation';

import RootNavigation from './RootNavigation';
import MenuNavigation from './MenuNavigation';
import LoadingScreen from '../screens/LoadingScreen';
import SigninScreen from '../screens/SigninScreen';
import PostsScreen from '../screens/PostsScreen';
import PostScreen from '../screens/PostScreen';
import NewPostScreen from '../screens/NewPostScreen';

export default createRouter(() => ({
  rootNavigation: () => RootNavigation,
  menuNavigation: () => MenuNavigation,
  loading: () => LoadingScreen,
  signin: () => SigninScreen,
  posts: () => PostsScreen,
  post: () => PostScreen,
  newPost: () => NewPostScreen,
}));
