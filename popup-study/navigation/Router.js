import { createRouter } from '@expo/ex-navigation';

import RootNavigation from './RootNavigation';
import MenuNavigation from './MenuNavigation';
import LoadingScreen from '../screens/LoadingScreen';
import SigninScreen from '../screens/SigninScreen';
import SuggestedPostsScreen from '../screens/SuggestedPostsScreen';
import MyPostsScreen from '../screens/MyPostsScreen';
import NewPostScreen from '../screens/NewPostScreen';

export default createRouter(() => ({
  rootNavigation: () => RootNavigation,
  menuNavigation: () => MenuNavigation,
  loading: () => LoadingScreen,
  signin: () => SigninScreen,
  suggestedPosts: () => SuggestedPostsScreen,
  myPosts: () => MyPostsScreen,
  newPost: () => NewPostScreen,
}));
