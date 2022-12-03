import React from 'react';
import { getLoggedInUser } from '../../../../helpers/authUtils';

import './Message.css';

const Message = ({ message: { text, user } }) => {
  let isSentByCurrentUser = false;
  const currentUser = getLoggedInUser()


  if(user === currentUser?.username) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{user}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{text}</p>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{text}</p>
            </div>
            <p className="sentText pl-10 ">{user}</p>
          </div>
        )
  );
}

export default Message;