import { useState } from "react";
import { useNavigate, redirect } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "src/hooks/AuthHooks";
import { FloatingParticles } from "../FlaotingParticles";
import { NavPreLogin } from "../navigations/NavPreLogin";
import { apiUserLogin, googleLogin } from "src/api/AuthenticationApi";

export function LoginPage() {
  const { setIsAuthenticated } = useAuth();
  const Navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send a POST request to the authentication API
    apiUserLogin({
      email: email,
      password: password,
    })
      .then((res) => {
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
        setIsAuthenticated(true);
        redirect("/");
      })
      .catch((err) => {
        setError("Incorrect username or password");
      });
  };

  const googleLoginImplicit = useGoogleLogin({
    flow: "auth-code",
    redirect_uri: "postmessage",
    onSuccess: async (response) => {
      try {
        const loginResponse = await googleLogin(response.code);
        if (loginResponse && loginResponse.data) {
          const { access_token, refresh_token } = loginResponse.data;

          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          setIsAuthenticated(true);
          Navigate("/");
        }
      } catch (error) {
        console.error("Error with the POST request:", error);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div>
      <NavPreLogin
        text="Don't have account?"
        btn_text="Sign Up"
        link="/signup"
      />
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-zinc-100 via-gray-200 to-zinc-100">
        {/* Particles Container */}

        <FloatingParticles />
        {/* Login Box */}
        <div className="flex items-center justify-center flex-1 z-50">
          <div className="w-100 bg-white border-solid rounded-lg p-8 shadow space-y-4">
            <h2 className="text-3xl font-bold">Log in to your account</h2>
            {/* Error Message */}
            {error && (
              <div role="alert" className="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
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
                value={email}
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
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {/* Login Button */}
            <button
              className="btn bg-blue-700 hover:bg-blue-900 w-full text-white font-bold"
              onClick={handleSubmit}
            >
              Login
            </button>
            <div className="divider">OR</div>
            {/* Login with Google Button */}
            <button
              className="btn bg-gray-200 btn-outline w-full "
              onClick={() => googleLoginImplicit()}
            >
              <FcGoogle className="rounded-full bg-white" />
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
