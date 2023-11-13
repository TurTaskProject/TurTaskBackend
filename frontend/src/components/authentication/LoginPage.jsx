import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import refreshAccessToken from "./refreshAcesstoken";
import axiosapi from "../../api/AuthenticationApi";

function LoginPage() {
  const Navigate = useNavigate();

  useEffect(() => {
    if (!refreshAccessToken()) {
      Navigate("/");
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();

    // Send a POST request to the authentication API
    axiosapi
      .apiUserLogin({
        email: email,
        password: password,
      })
      .then(res => {
        // On successful login, store tokens and set the authorization header
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        axiosapi.axiosInstance.defaults.headers["Authorization"] = "Bearer " + res.data.access;
        Navigate("/");
      })
      .catch(err => {
        console.log("Login failed");
        console.log(err);
      });
  };

  const googleLoginImplicit = useGoogleLogin({
    flow: "auth-code",
    redirect_uri: "postmessage",
    onSuccess: async response => {
      try {
        const loginResponse = await axiosapi.googleLogin(response.code);
        if (loginResponse && loginResponse.data) {
          const { access_token, refresh_token } = loginResponse.data;

          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          Navigate("/");
        }
      } catch (error) {
        console.error("Error with the POST request:", error);
      }
    },
    onError: errorResponse => console.log(errorResponse),
  });

  return (
    <div data-theme="night" className="min-h-screen flex">
      {/* Left Section (Login Box) */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-96 bg-neutral rounded-lg p-8 shadow-md space-y-4">
          <h2 className="text-2xl font-semibold text-left">Log in to your account</h2>
          {/* Email Input */}
          <div className="form-control">
            <label className="label" htmlFor="email">
              <p className="text-bold">
                Email<span className="text-red-500 text-bold">*</span>
              </p>
            </label>
            <input
              className="input"
              type="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleEmailChange}
            />
          </div>
          {/* Password Input */}
          <div className="form-control">
            <label className="label" htmlFor="password">
              <p className="text-bold">
                Password<span className="text-red-500 text-bold">*</span>
              </p>
            </label>
            <input
              className="input"
              type="password"
              id="password"
              placeholder="Enter your password"
              onChange={handlePasswordChange}
            />
          </div>
          {/* Login Button */}
          <button className="btn btn-primary w-full" onClick={handleSubmit}>
            Login
          </button>
          <div className="divider">OR</div>
          {/* Login with Google Button */}
          <button className="btn btn-outline btn-secondary w-full" onClick={() => googleLoginImplicit()}>
            Login with Google
          </button>
          {/* Forgot Password Link */}
          <div className="justify-left">
            <a href="#" className="text-blue-500 text-sm text-left">
              Forgot your password?
            </a>
          </div>
        </div>
      </div>

      {/* Right Section (Blurred Image Background) */}
      <div className="w-1/2 relative">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://th.bing.com/th/id/OIG.9byG0pWUCcbGL7Kly9tA?pid=ImgGn&w=1024&h=1024&rs=1")',
            filter: "blur(2px) brightness(.5)",
          }}></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-semibold">
          Text Overlay
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
