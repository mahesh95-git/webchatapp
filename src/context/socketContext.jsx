"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { UserContext } from "./userContext";
export const SocketContext = createContext();
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useContext(UserContext);
  useEffect(() => {
    let socketInstance;
    if (user) {
      socketInstance = io(process.env.SOCKET_SERVER, {
       withCredentials: true,
      
      });
      setSocket(socketInstance);
      socketInstance.on("connect", () => {
        console.log("connected to server");
      });
     
    }
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
