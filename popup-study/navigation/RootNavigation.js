import React from 'react';
import { StackNavigation } from '@expo/ex-navigation';

export default class RootNavigation extends React.Component {
  render() {
    return (
      <StackNavigation id="root" initialRoute={Router.getRoute('loading')} />
    );
  }
}
