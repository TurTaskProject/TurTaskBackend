import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { NavPreLogin } from "../navigations/NavPreLogin";
import { useAuth } from "src/hooks/AuthHooks";
import { createUser, googleLogin } from "src/api/AuthenticationApi";
import { FloatingParticles } from "../FlaotingParticles";

export function SignUp() {
  const Navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

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

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    try {
      const data = await createUser(formData);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      await delay(200);
      setIsAuthenticated(true);
      Navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handleUsernameChange = (e) => {
    setFormData({ ...formData, username: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const googleLoginImplicit = useGoogleLogin({
    flow: "auth-code",
    redirect_uri: "postmessage",
    scope:
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar.acls.readonly https://www.googleapis.com/auth/calendar.events.readonly",
    onSuccess: async (response) => {
      try {
        const loginResponse = await googleLogin(response.code);
        if (loginResponse && loginResponse.data) {
          const { access_token, refresh_token } = loginResponse.data;

          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          setIsAuthenticated(true);
          Navigate("/profile");
        }
      } catch (error) {
        console.error("Error with the POST request:", error);
        setIsAuthenticated(false);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div>
      <NavPreLogin
        text="Already have an account?"
        btn_text="Log In"
        link="/login"
      />
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-zinc-100 via-gray-200 to-zinc-100">
        <FloatingParticles />
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
                onChange={handleEmailChange}
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
                onChange={handleUsernameChange}
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
          </div>
        </div>
      </div>
    </div>
  );
}
