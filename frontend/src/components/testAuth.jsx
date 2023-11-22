import { useState, useEffect } from "react";
import axiosapi from "../api/AuthenticationApi";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function TestAuth() {
  let Navigate = useNavigate();

  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch the "hello" data from the server when the component mounts
    axiosapi
      .getGreeting()
      .then((res) => {
        console.log(res.data);
        setMessage(res.data.user);
      })
      .catch((err) => {
        console.log(err);
        setMessage("");
      });
  }, []);

  const logout = () => {
    // Log out the user, clear tokens, and navigate to the "/testAuth" route
    axiosapi.apiUserLogout();
    Navigate("/testAuth");
  };

  return (
    <div>
      {message !== "" && (
        <div>
          <h1 className="text-xl font-bold">Login! Hello!</h1>
          <h2>{message}</h2>
          <Button variant="contained" onClick={logout}>
            Logout
          </Button>
        </div>
      )}
      {message === "" && <h1 className="text-xl font-bold">Need to sign in, No authentication found</h1>}
    </div>
  );
}

export default TestAuth;
