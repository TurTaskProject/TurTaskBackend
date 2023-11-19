import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
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

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    // Send a POST request to the authentication API
    axiosapi
      .apiUserLogin({
        email: email,
        password: password,
      })
      .then((res) => {
        // On successful login, store tokens and set the authorization header
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        axiosapi.axiosInstance.defaults.headers["Authorization"] =
          "Bearer " + res.data.access;
        setIsAuthenticated(true);
        Navigate("/");
      })
      .catch((err) => {
        console.log("Login failed");
        console.log(err);
        setIsAuthenticated(false);
      });
  };

  const googleLoginImplicit = useGoogleLogin({
    flow: "auth-code",
    redirect_uri: "postmessage",
    onSuccess: async (response) => {
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
    onError: (errorResponse) => console.log(errorResponse),
  });
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  return (
    <div
      data-theme="night"
      className="h-screen flex items-center justify-center"
    >
      {/* Particles Container */}
      <div style={{ width: "0%", height: "100vh" }}>
        <Particles
          id="particles"
          init={particlesInit}
          loaded={particlesLoaded}
          className="-z-10"
          options={{
            fpsLimit: 240,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#008000",
              },
              links: {
                color: "#00ff00",
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 4,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 50,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 4, max: 5 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>
      {/* Login Box */}
      <div className="w-1/4 flex items-center justify-center">
        <div className="w-96 bg-neutral rounded-lg p-8 shadow-md space-y-4 z-10">
          <h2 className="text-3xl font-bold text-center">Login</h2>
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
          <button className="btn btn-success w-full " onClick={handleSubmit}>
            Login
          </button>
          <div className="divider">OR</div>
          {/* Login with Google Button */}
          <button
            className="btn btn-outline btn-secondary w-full "
            onClick={() => googleLoginImplicit()}
          >
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
