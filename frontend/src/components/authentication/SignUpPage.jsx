import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosapi from "../../api/AuthenticationApi";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";


function Copyright(props) {
  return (
    <div className="text-center text-sm text-gray-500" {...props}>
      {"Copyright © "}
      <a
        href="https://github.com/TurTaskProject/TurTaskWeb"
        className="text-blue-500 hover:underline"
      >
        TurTask
      </a>{" "}
      {new Date().getFullYear()}
      {"."}
    </div>
  );
}

export default function SignUp() {
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      axiosapi.createUser(formData);
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
    Navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };
  {
    /* Particles Loader*/
  }
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

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
                value: "#023020",
              },
              links: {
                color: "#228B22",
                distance: 150,
                enable: true,
                opacity: 1,
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
                value: 0.6,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 6, max: 8 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>
      <div className="w-1/4 h-1 flex items-center justify-center">
        <div className="w-96 bg-neutral rounded-lg p-8 shadow-md space-y-4 z-10">
          {/* Register Form */}
          <h2 className="text-3xl font-bold text-center">Signup</h2>
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
              onChange={handleChange}
            />
          </div>
          {/* Username Input */}
          <div className="form-control">
            <label className="label" htmlFor="Username">
              <p className="text-bold">
                Username<span className="text-red-500 text-bold">*</span>
              </p>
            </label>
            <input
              className="input"
              type="text"
              id="Username"
              placeholder="Enter your username"
              onChange={handleChange}
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
              onChange={handleChange}
            />
          </div>
          <br></br>

          {/* Signups Button */}
          <button className="btn btn-success w-full " onClick={handleSubmit}>
            Signup
          </button>
          <div className="divider">OR</div>
          {/* Login with Google Button */}
          <button
            className="btn btn-outline btn-secondary w-full "
            onClick={() => googleLoginImplicit()}
          >
            <FcGoogle className="rounded-full bg-white"/>Login with Google
          </button>
          {/* Already have an account? */}
          <div className="text-blue-500 flex justify-center text-sm">
            <a href="login">
              Already have an account?
            </a>
          </div>
          <Copyright />
        </div>
      </div>
    </div>
  );
}
