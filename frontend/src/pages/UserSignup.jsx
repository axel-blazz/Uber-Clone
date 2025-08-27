import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import axios from "axios";
import { userDataContext } from "../context/UserContext";


const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:4000';


function UserSignup() {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState({ firstname: "", lastname: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser } = useContext(userDataContext);


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

  const newUser = { fullname, email, password };

  try {
    const response = await axios.post(`${BASE_URL}/api/user/register`, newUser, { withCredentials: true });
    console.log("Response:", response.data);

    setUser(response.data.user); // update context
    navigate("/home");

    // ✅ clear fields after success
    setFullname({ firstname: "", lastname: "" });
    setEmail("");
    setPassword("");
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
          Register
        </h1>

        {/* Name / Email / Password Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2">First Name</label>
              <input
                type="text"
                placeholder="John"
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
                placeholder="Doe"
                value={fullname.lastname}
                onChange={(e) => setFullname({ ...fullname, lastname: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition"
                required
              />
            </div>
          </div>

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

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Register
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

export default UserSignup;
