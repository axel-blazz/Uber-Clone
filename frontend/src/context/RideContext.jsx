// context/RideContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useSocket } from "./SocketContext";

export const RideDataContext = createContext();

const RideContext = ({ children, role }) => {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { onMessage } = useSocket();

  useEffect(() => {
    if (!onMessage) return;

    // CAPTAIN-SPECIFIC: listen for new ride requests
    let unsubNewRide;
    if (role === "captain") {
      unsubNewRide = onMessage("new-ride-request", (newRide) => {
        setRide(newRide);
      });
    }

    // Both roles listen to ride lifecycle events
    const unsubAccepted = onMessage("ride-accepted", (acceptedRide) => {
      setRide((prev) =>
        prev ? { ...prev, ...acceptedRide, status: "accepted" } : acceptedRide
      );
      setLoading(false);
    });

    const unsubStarted = onMessage("ride-started", (startedRide) => {
      setRide((prev) =>
        prev ? { ...prev, ...startedRide, status: "started" } : startedRide
      );
    });

    const unsubCompleted = onMessage("ride-completed", (completedRide) => {
      setRide((prev) =>
        prev
          ? { ...prev, ...completedRide, status: "completed" }
          : completedRide
      );
      setLoading(false);
    });

    return () => {
      unsubAccepted && unsubAccepted();
      unsubStarted && unsubStarted();
      unsubCompleted && unsubCompleted();
      unsubNewRide && unsubNewRide();
    };
  }, [onMessage, role]);

  // Create ride API call (mostly used by users)
  const createRide = async ({ pickup, vehicleType }) => {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/rides/create-ride`,
        { pickup, vehicleType },
        { withCredentials: true }
      );
      setRide(res.data.ride);
      return res.data.ride;
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || "Failed to create ride"
      );
      setLoading(false);
      throw err;
    }
  };

  const clearRide = () => {
    setRide(null);
    setLoading(false);
    setError(null);
  };

  return (
    <RideDataContext.Provider
      value={{
        ride,
        setRide,
        loading,
        setLoading,
        error,
        setError,
        createRide,
        clearRide,
      }}
    >
      {children}
    </RideDataContext.Provider>
  );
};

export default RideContext;
