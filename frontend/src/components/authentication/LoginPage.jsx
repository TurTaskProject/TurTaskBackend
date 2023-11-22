import { useEffect, useState } from "react";
import { useNavigate, redirect } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import refreshAccessToken from "./refreshAcessToken";
import axiosapi from "../../api/AuthenticationApi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "src/hooks/AuthHooks";

function LoginPage() {
  const { setIsAuthenticated } = useAuth();
  const Navigate = useNavigate();

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
        redirect("/");
      })
      .catch((err) => {
        console.log("Login failed");
        console.log(err);
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
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  {
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-zinc-100 via-gray-200 to-zinc-100">
      <div
        aria-hidden="true"
        className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40"
      >
        <div className="blur-[106px] h-56 bg-gradient-to-br from-pink-600 to-fuchsia-300"></div>
        <div className="blur-[106px] h-32 bg-gradient-to-r from-fuchsia-500 to-orange-500"></div>
      </div>
      {/* Login Box */}
      <div className="w-1/4 flex items-center justify-center">
        <div className="w-96 bg-white rounded-lg p-8 shadow-md space-y-4 z-10">
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
            <FcGoogle className="rounded-full bg-white" />
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
