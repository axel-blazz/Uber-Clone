import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { captainDataContext } from "../context/CaptainContext";

const CaptainProtectedWrapper = ({ children }) => {
  const { captain, loading } = useContext(captainDataContext);

  if (loading) return <div>Loading...</div>; // while checking cookie/session
  if (!captain) return <Navigate to="/captain/login" />;

  return children;
};

export default CaptainProtectedWrapper;
