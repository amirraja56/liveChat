import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './index.css'

const socket = io('https://live-chat-snowy.vercel.app');

const Chat = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleLogin = () => {
    if (username.trim()) {
      setLoggedIn(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && username.trim()) {
      const newMessage = { user: username, message };
      socket.emit('message', newMessage);
      setMessage('');
    }
  };


  return (
    <div className="chat-container">
      <div className="chat-window">
      <div className="chat-header">
      <h2 className='text-center'>ChatApp</h2>
      </div> 

      {
        !loggedIn  ? 

        <div className="login">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className='form-control w-50'
        />
        <button type='button' className='btn btn-primary' onClick={handleLogin}>Login</button>
      </div>

        : 

        <div className="messages">
        <div className='username'>User- {username}</div>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.user === username ? 'sent' : 'received'}`}>
              <span className='usertext'><span className="user">{msg.user}:</span> {msg.message}</span>
            </div>
          ))}
        </div>
      }
        
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message..."
          className='form-control'
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
