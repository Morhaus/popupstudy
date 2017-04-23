import React from 'react';

import Chat from '../components/Chat';

export default class ChatScreen extends React.Component {
  static route = {
    navigationBar: {},
  };

  render() {
    const { postId, userId } = this.props;

    return <Chat userId={userId} postId={postId} />;
  }
}
