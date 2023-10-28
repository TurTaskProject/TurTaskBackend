import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID


ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
  <App />
  </GoogleOAuthProvider>
);