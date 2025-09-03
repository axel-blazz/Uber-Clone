import { useContext } from "react";
import axios from "axios";
import { RideDataContext } from "../context/RideContext";
import useFCMToken from "../hooks/useFCMToken";

const CaptainHome = () => {
  useFCMToken("captain"); // register FCM token

  const { ride, setRide, loading, setLoading } = useContext(RideDataContext);

  const handleAccept = async () => {
    if (!ride) return;
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/rides/accept-ride`,
        { rideId: ride._id },
        { withCredentials: true }
      );
      setRide((prev) => (prev ? { ...prev, status: "accepted" } : ride));
    } catch (err) {
      console.error("Error accepting ride:", err);
      setLoading(false);
    }
  };

  // Idle screen when no ride
  if (!ride) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Waiting for ride requests...</p>
      </div>
    );
  }

  // Ride available → show details
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h2 className="text-xl mb-4">Incoming Ride Request</h2>
      <p>Ride Id: {ride.id}</p>
      <p>PickUP: {ride.pickup}</p>
      <p>Fare: {ride.fare}</p>

      {ride.status === "pending" && (
        <button
          onClick={handleAccept}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-white text-white rounded"
        >
          {loading ? "Accepting..." : "Accept Ride"}
        </button>
      )}

      {ride.status === "accepted" && <p>Ride Accepted ✅</p>}
      {ride.status === "started" && <p>Ride Started 🚗</p>}
      {ride.status === "completed" && <p>Ride Completed ✅</p>}
    </div>
  );
};

export default CaptainHome;
