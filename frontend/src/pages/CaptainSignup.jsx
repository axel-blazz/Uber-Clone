import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import axios from "axios";
import { useContext } from "react";
import { captainDataContext } from "../context/CaptainContext";

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

function CaptainSignup() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState({ firstname: "", lastname: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle, setVehicle] = useState({
    color: "",
    plate: "",
    capacity: "",
    vehicleType: ""
  });

  const { captain, setCaptain } = useContext(captainDataContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    // frontend validation...
    if (!fullname.firstname) {
      return alert("First name is required");
    }
    if (!email.includes("@")) {
      return alert("Enter a valid email");
    }
    if (password.length < 6) {
      return alert("Password must be at least 6 characters");
    }
    if (!vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType) {
      return alert("All vehicle fields are required");
    }

    if(vehicle.capacity < 1) {
      return alert("Capacity must be at least 1");
    }

    const newCaptain = { fullname, email, password, vehicle };

    try {
      const response = await axios.post(`${BASE_URL}/api/captain/register`, newCaptain, { withCredentials: true });
      console.log("Captain Register Response:", response.data);

      setCaptain(response.data.captain); // update context
      navigate("/captain/home");

      // ✅ clear fields after success
      setFullname({ firstname: "", lastname: "" });
      setEmail("");
      setPassword("");
      setVehicle({
        color: "",
        plate: "",
        capacity: "",
        vehicleType: ""
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");

      // optional: clear only password for security
      setPassword("");
    }
  };

  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Sign Up as Captain
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2">First Name</label>
              <input
                type="text"
                placeholder="Jane"
                value={fullname.firstname}
                onChange={(e) => setFullname({ ...fullname, firstname: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2">Last Name</label>
              <input
                type="text"
                placeholder="Smith"
                value={fullname.lastname}
                onChange={(e) => setFullname({ ...fullname, lastname: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
                required
              />
            </div>
          </div>

          {/* Email & Password */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
              required
            />
          </div>

          {/* Vehicle Info */}
<h2 className="text-gray-800 font-semibold mt-4 mb-2">Vehicle Information</h2>

{/* Color + Plate */}
<div className="flex flex-col sm:flex-row gap-2">
  <input
    type="text"
    placeholder="Color"
    value={vehicle.color}
    onChange={(e) => setVehicle({ ...vehicle, color: e.target.value })}
    className="flex-1 min-w-[120px] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
    required
  />
  <input
    type="text"
    placeholder="Plate"
    value={vehicle.plate}
    onChange={(e) => setVehicle({ ...vehicle, plate: e.target.value })}
    className="flex-1 min-w-[120px] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
    required
  />
</div>

  {/* Capacity + Vehicle Type */}
  <div className="flex flex-col sm:flex-row gap-2 mt-2">
    <input
      type="number"
      placeholder="Capacity"
      value={vehicle.capacity}
      onChange={(e) => setVehicle({ ...vehicle, capacity: e.target.value })}
      className="flex-1 min-w-[120px] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
      required
    />
    <select
      value={vehicle.vehicleType}
      onChange={(e) => setVehicle({ ...vehicle, vehicleType: e.target.value })}
      className="flex-1 min-w-[120px] border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
      required
    >
      <option value="">Select Vehicle Type</option>
      <option value="car">Car</option>
      <option value="bike">Bike</option>
      <option value="van">Van</option>
    </select>
  </div>


          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Sign Up as Captain
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?{" "}
          <Link to="/user/login" className="text-gray-900 font-medium hover:underline">
            Login
          </Link>
        </p>

        {/* Social register inline buttons */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => handleSocialRegister("Google")}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            <FaGoogle className="text-gray-800" />
          </button>
          <button
            onClick={() => handleSocialRegister("Facebook")}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            <FaFacebookF className="text-gray-800" />
          </button>
          <button
            onClick={() => handleSocialRegister("Apple")}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            <FaApple className="text-gray-800" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaptainSignup;
