import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosapi from "../../api/AuthenticationApi";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

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
      <div className="w-1/4 h-1 flex items-center justify-center">
        <div className="w-96 bg-neutral rounded-lg p-8 shadow-md space-y-4 z-10">
          {/* Register Form */}
          <h2 className="text-3xl font-bold text-center">Signup</h2>
          <form noValidate onSubmit={handleSubmit}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={handleChange}
            />
            <TextField
              autoComplete="username"
              name="Username"
              required
              fullWidth
              id="Username"
              label="Username"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive inspiration, marketing promotions and updates via email."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            {/* Already have an account? */}
            <div className="text-blue-500 text-sm">
              <a href="login" className="text-left">
                Already have an account?
              </a>
            </div>
          </form>
          <Copyright />
        </div>
      </div>
    </div>
  );
}
