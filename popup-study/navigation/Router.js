import { createRouter } from '@expo/ex-navigation';

import AdsScreen from '../screens/AdsScreen';
import RootNavigation from './RootNavigation';

export default createRouter(() => ({
  ads: () => AdsScreen,
  rootNavigation: () => RootNavigation,
}));
