import { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import TestAuth from "./components/testAuth";
import LoginPage from "./components/authentication/LoginPage";
import SignUpPage from "./components/authentication/SignUpPage";
import NavBar from "./components/navigations/Navbar";
import Calendar from "./components/calendar/calendar";
import KanbanPage from "./components/kanbanBoard/kanbanPage";
import IconSideNav from "./components/navigations/IconSideNav";
import Eisenhower from "./components/EisenhowerMatrix/Eisenhower";
import PrivateRoute from "./PrivateRoute";
import ProfileUpdatePage from "./components/profilePage";
import Dashboard from "./components/dashboard/dashboard";

import { useAuth } from "./hooks/AuthHooks";

const baseURL = import.meta.env.VITE_BASE_URL;

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const data = {
        access_token: localStorage.getItem("access_token"),
        refresh_token: localStorage.getItem("refresh_token"),
      };

      await axios
        .post(`${baseURL}auth/status/`, data, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        })
        .then((response) => {
          if (response.status === 200) {
            if (response.data.access_token) {
              localStorage.setItem("access_token", response.data.access_token);
              setIsAuthenticated(true);
            } else {
              setIsAuthenticated(true);
            }
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch((error) => {
          console.error("Error checking login status:", error.message);
        });
    };

    checkLoginStatus();
  }, [setIsAuthenticated]);

  return <div>{isAuthenticated ? <AuthenticatedComponents /> : <NonAuthenticatedComponents />}</div>;
};

const NonAuthenticatedComponents = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  );
};

const AuthenticatedComponents = () => {
  return (
    <div className="display: flex">
      <IconSideNav />
      <div className="flex-1 ml-[76px] overflow-hidden">
        <NavBar />
        <div className="overflow-x-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route exact path="/tasks" element={<PrivateRoute />}>
              <Route exact path="/tasks" element={<KanbanPage />} />
            </Route>
            <Route path="/testAuth" element={<TestAuth />} />
            <Route exact path="/profile" element={<PrivateRoute />}>
              <Route exact path="/profile" element={<ProfileUpdatePage />} />
            </Route>
            <Route exact path="/calendar" element={<PrivateRoute />}>
              <Route exact path="/calendar" element={<Calendar />} />
            </Route>
            <Route exact path="/priority" element={<PrivateRoute />}>
              <Route exact path="/priority" element={<Eisenhower />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
