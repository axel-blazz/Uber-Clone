import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

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

  const handleRegister = (e) => {
    e.preventDefault();
    // Build payload for API
    const payload = {
      fullname,
      email,
      password,
      vehicle
    };
    console.log("Registering captain:", payload);
    // TODO: call API
    setFullname({ firstname: "", lastname: "" });
    setEmail("");
    setPassword("");
    setVehicle({
      color: "",
      plate: "",
      capacity: "",
      vehicleType: ""
    });
    // navigate("/home");
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
