import { useEffect, useState, createContext } from "react";
import axios from "axios";

export const captainDataContext = createContext();

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <captainDataContext.Provider value={{ captain, setCaptain, loading }}>
      {children}
    </captainDataContext.Provider>
  );
};

export default CaptainContext;
