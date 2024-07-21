"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

const SocketComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io('http://localhost:3000'); // Explicitly specify the server URL

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

  const sendMessage = () => {
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="Type a message"
        className='text-black'
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default SocketComponent;
