import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message, name }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();
  const orgName = message.name.trim().toLowerCase();

  if(orgName === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(message.data)}</p>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
              <p className="sentText pl-10 ">{message.name}</p>
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(message.data)}</p>
            </div>
          </div>
        )
  );
}

export default Message;