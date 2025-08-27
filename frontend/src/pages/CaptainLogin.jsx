import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

function CaptainLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Add login logic
    console.log("Logging in with", { email, password });
    const newUserData = { email, password };
    setuserData(newUserData);
    console.log('Logging in with', newUserData); // correct value

    setEmail('');
    setPassword('');
    
    // navigate("/home");
  };


  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Login
        </h1>

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
            Login
          </button>
          <Link
          to={'/user/login'}
          className="flex items-center justify-center w-full bg-gray-900 text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Sign In as User
        </Link>

        </form>

        {/* Register link */}
        <p className="text-center text-gray-500 text-sm mt-5">
          Don’t have an account?{" "}
          <Link to="/captain/signup" className="text-gray-900 font-medium hover:underline">
            Register
          </Link>
        </p>

        {/* Social login inline buttons */}
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            <FaGoogle className="text-gray-800" />
          </button>
          <button
            onClick={() => handleSocialLogin("Facebook")}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            <FaFacebookF className="text-gray-800" />
          </button>
          <button
            onClick={() => handleSocialLogin("Apple")}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            <FaApple className="text-gray-800" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaptainLogin;
