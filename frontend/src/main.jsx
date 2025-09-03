import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContext from "./context/UserContext.jsx";
import RideContext from "./context/RideContext.jsx";
import CaptainContext from "./context/CaptainContext.jsx";
import SocketProvider from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <SocketProvider>
      <UserContext>
        <CaptainContext>
          <RideContext>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </RideContext>     
        </CaptainContext>
      </UserContext>
    </SocketProvider>
  // </StrictMode>
);
