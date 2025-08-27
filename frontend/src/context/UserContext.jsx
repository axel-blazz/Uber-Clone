import { useEffect, useState, createContext } from "react";
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/me`, {
      withCredentials: true, // send cookie
    })
    .then(res => {
      setUser(res.data);
    })
    .catch(() => {
      setUser(null);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <userDataContext.Provider value={{ user, setUser, loading }}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
