import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import SocketProvider from "./contexts/SocketContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <SocketProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_google_client_id"}>
        <App />
      </GoogleOAuthProvider>
      <Toaster closeButton position="top-center" />
    </SocketProvider>
  </Provider>
  // </React.StrictMode>
);
