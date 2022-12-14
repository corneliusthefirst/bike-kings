import React from 'react';
import './Message.css';
import { SvgIcon } from '@material-ui/core';
import { ReactComponent as ChatBotIconSvg } from "../../../../assets/images/chatbot.svg";

const Message = ({ message}) => {
  let isSentByCurrentUser = false;

  if(!message?.previousMessage) {
    isSentByCurrentUser = true;

  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <div className="messageBox  bg-primary">
            <p className="messageText text-white">{message?.message}</p>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
                  <SvgIcon >
              <ChatBotIconSvg />
            </SvgIcon>
            <div className="messageBox bg-gray-100">
              <p className="messageText text-black">{message?.message}</p>
            </div>
          </div>
        )
  );
}

export default Message;