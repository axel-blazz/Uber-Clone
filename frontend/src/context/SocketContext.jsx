import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    const url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    socketRef.current = io(url, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected to server:", socketRef.current.id);
      setSocketInstance(socketRef.current); // <-- update state on connect
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected:");
      setSocketInstance(null); // <-- clear state on disconnect
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendMessage = (eventName, payload) => {
    if (!socketRef.current) {
      console.warn("Socket not initialized yet");
      return;
    }
    console.log("Emitting event:", eventName, payload);
    socketRef.current.emit(eventName, payload);
  };

  const onMessage = (eventName, handler) => {
    if (!socketRef.current) {
      console.warn("Socket not initialized yet");
      return () => {};
    }
    socketRef.current.on(eventName, handler);
    return () => {
      if (socketRef.current) socketRef.current.off(eventName, handler);
    };
  };

  return (
    <SocketContext.Provider
      value={{ sendMessage, onMessage, socket: socketInstance }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
