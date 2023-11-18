import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import refreshAccessToken from "./refreshAcesstoken";
import axiosapi from "../../api/AuthenticationApi";
import { useAuth } from "../../hooks/authentication/IsAuthenticated"; 

function LoginPage() {
  const Navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

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
        setIsAuthenticated(true);
        Navigate("/");
      })
      .catch(err => {
        console.log("Login failed");
        console.log(err);
        setIsAuthenticated(false);
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
          setIsAuthenticated(true);
          Navigate("/");
        }
      } catch (error) {
        console.error("Error with the POST request:", error);
        setIsAuthenticated(false);
      }
    },
    onError: errorResponse => console.log(errorResponse),
  });
  useEffect(() => {
    // Load particles.js configuration
    particlesJS.load('particles-js', 'src/assets/particles.json', function() {
      console.log('callback - particles.js config loaded');
    });
  }, []);


  return (
    <div data-theme="night" className="h-screen flex"> 
    <div id="particles-js" className="absolute inset-0 "></div>
      {/* Left Section (Login Box) */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-96 bg-neutral rounded-lg p-8 shadow-md space-y-4">
          <h2 className="text-2xl font-semibold text-left">Log in to your account</h2>
          {/* Email Input */}
          <div className="form-control ">
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
          <button className="btn btn-primary w-full " onClick={handleSubmit}>
            Login
          </button>
          <div className="divider">OR</div>
          {/* Login with Google Button */}
          <button className="btn btn-outline btn-secondary w-full " onClick={() => googleLoginImplicit()}>
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

    </div>
  );
}

export default LoginPage;
