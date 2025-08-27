import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";

const UserProtectedWrapper = ({ children }) => {
  const { user, loading } = useContext(userDataContext);

  if (loading) return <div>Loading...</div>; // while checking cookie/session
  if (!user) return <Navigate to="/user/login" />;

  return children;
};

export default UserProtectedWrapper;
