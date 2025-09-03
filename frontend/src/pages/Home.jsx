// pages/Home.jsx
import { useState, useContext } from "react";
import useFCMToken from "../hooks/useFCMToken";
import { RideDataContext } from "../context/RideContext";

const Home = () => {
  useFCMToken("user");

  const { ride, createRide, loading, error, setError } =
    useContext(RideDataContext);

  const [pickup, setPickup] = useState("");
  const [vehicleType, setVehicleType] = useState("car");

  const handleBookRide = async () => {
    setError(null);
    try {
      await createRide({ pickup, vehicleType });
      // ride will be set by context; loading remains true until socket says accepted/started
    } catch (err) {
      // error already set in context; you can also show a toast here
      console.error(err);
    }
  };

  // Booking form (no active ride)
  if (!ride) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h2 className="text-2xl mb-6">Book a Ride</h2>

        <input
          placeholder="Enter pickup location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          disabled={loading}
          className="mb-4 px-3 py-2 rounded bg-gray-800 text-white w-64"
        />

        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          disabled={loading}
          className="mb-4 px-3 py-2 rounded bg-gray-800 text-white w-64"
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="van">Van</option>
        </select>

        <button
          onClick={handleBookRide}
          disabled={loading || !pickup}
          className="px-4 py-2 bg-white text-black rounded"
        >
          {loading ? "Booking ride..." : "Book Ride"}
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    );
  }

  // Ride exists → show ride status
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h2 className="text-xl mb-4">Ride Details</h2>
      <p>Pickup: {ride.pickup}</p>
      <p>Vehicle: {ride.vehicleType}</p>
      <p>Status: {ride.status}</p>
    </div>
  );
};

export default Home;
