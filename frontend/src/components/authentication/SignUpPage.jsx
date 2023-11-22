import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosapi from "../../api/AuthenticationApi";
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
  }

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
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-zinc-100 via-gray-200 to-zinc-100">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300"></div>
      </div>
      <div className="w-1/4 h-1 flex items-center justify-center z-10">
        <div className="w-96 bg-white rounded-lg p-8 space-y-4 z-10">
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
            <FcGoogle className="rounded-full bg-white" />
            Login with Google
          </button>
          {/* Already have an account? */}
          <div className="text-blue-500 flex justify-center text-sm">
            <a href="login">Already have an account?</a>
          </div>
          <Copyright />
        </div>
      </div>
    </div>
  );
}
