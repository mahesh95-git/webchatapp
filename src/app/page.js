"use client";
import { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

const SocketComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  socket = io('http://localhost:3000'); 
  useEffect(() => {
   // Explicitly specify the server URL

    socket.on('connect', () => {
      console.log('connected to server');
    });

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('disconnect', () => {
      console.log('disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);



  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div>
    
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          placeholder="Type a message"
          className='text-black'
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default SocketComponent;
