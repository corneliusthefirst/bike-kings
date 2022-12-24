import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ messages, lastMessageRef, room }) => (
  <ScrollToBottom className="messages pb-4">
    {messages?.reverse().map((message, i) => <div ref={lastMessageRef} key={`${message}-${i}`} ><Message room={room} index={i} messages={messages} message={message} /></div>)}
  </ScrollToBottom>
);

export default Messages;