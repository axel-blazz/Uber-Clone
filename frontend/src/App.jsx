import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import CaptainProtectedWrapper from "./pages/CaptainProtectedWrapper";
import CaptainHome from "./pages/CaptainHome";
import RideContext from "./context/RideContext";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/register" element={<UserSignup />} />
        <Route path="/captain/login" element={<CaptainLogin />} />
        <Route path="/captain/signup" element={<CaptainSignup />} />
        {/* <Route path='/home' element={<Home />} /> */}

        {/* Protect routes here */}
        <Route
          path="/home"
          element={
            <UserProtectedWrapper>
              <RideContext role="user">
                <Home />
              </RideContext>
            </UserProtectedWrapper>
          }
        />

        <Route
          path="/captain/home"
          element={
            <CaptainProtectedWrapper>
              <RideContext role="captain">
                <CaptainHome />
              </RideContext>
            </CaptainProtectedWrapper>
          }
        />
      </Routes>
    </>
  );
};

export default App;
