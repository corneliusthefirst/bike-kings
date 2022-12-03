import React from 'react';
import './Input.css';

const Input = ({ setMessage, sendMessage, message }) => (
  <form className="form chat-input flex flex-row">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
    <button className="sendButton" onClick={e => sendMessage(e)}>
      <i className="ri-send-plane-2-line text-2xl text-blue-500"></i>
    </button>
  </form>
)

export default Input;