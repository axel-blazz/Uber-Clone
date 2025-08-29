import { useEffect, useState, createContext } from "react";
import axios from "axios";
import { useSocket } from "./SocketContext"; // Import useSocket

export const captainDataContext = createContext();

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const { sendMessage, socket } = useSocket(); // Get socket

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/captain/profile`, {
        withCredentials: true, // send cookie
      })
      .then((res) => {
        setCaptain(res.data.user);
      })
      .catch(() => {
        setCaptain(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Emit join when captain and socket are available
  useEffect(() => {
    if (captain && socket) {
      sendMessage("join", { userId: captain._id, userType: "captain" });
    }
  }, [captain, socket, sendMessage]);

  return (
    <captainDataContext.Provider value={{ captain, setCaptain, loading }}>
      {children}
    </captainDataContext.Provider>
  );
};

export default CaptainContext;
