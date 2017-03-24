import { createRouter } from '@expo/ex-navigation';

import AdsScreen from '../screens/AdsScreen';
import SignInScreen from '../screens/SignInScreen';
import RootNavigation from './RootNavigation';

export default createRouter(() => ({
  ads: () => AdsScreen,
  signIn: () => SignInScreen,
  rootNavigation: () => RootNavigation,
}));
