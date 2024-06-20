// client/src/components/Chat.js
import React from 'react';
import FileUpload from './FileUpload';
import FileHistory from './FileHistory';

const Chat = ({ user }) => {
  const senderIp = process.env.REACT_APP_LOCAL_IP;

  return (
    <div>
      <h1>Chat with {user.username}</h1>
      <FileHistory receiverIp={user.wifi_ip} />
      <FileUpload senderIp={senderIp} receiverIp={user.wifi_ip} />
    </div>
  );
};

export default Chat;