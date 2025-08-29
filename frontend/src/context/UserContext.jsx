import { useEffect, useState, createContext } from "react";
import axios from "axios";
import { useSocket } from "./SocketContext"; // Import useSocket

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { sendMessage, socket } = useSocket(); // Get socket

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/user/profile`, {
        withCredentials: true, // send cookie
      })
      .then((res) => {
        console.log("User Profile Response:", res.data);

        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Emit join when user and socket are available
  useEffect(() => {
    if (user && socket) {
      sendMessage("join", { userId: user._id, userType: "user" });
    }
  }, [user, socket, sendMessage]);

  return (
    <userDataContext.Provider value={{ user, setUser, loading }}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
