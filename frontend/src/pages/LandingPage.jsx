import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Image Section */}
      <div className="relative flex-1 w-full">
        <img
          src="https://images.unsplash.com/photo-1625258110620-b213f56b9267?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Ambulance"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Bottom Content Section */}
      <div className="px-6 py-8 bg-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Uber Clone
          </h1>

          <Link
            to="/user/login"
            className="inline-block w-full bg-black hover:bg-gray-800 text-white py-6 text-lg font-semibold rounded-md transition-colors duration-200"
            onClick={() => navigate("/home")}
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
