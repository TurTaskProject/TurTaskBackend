import "./App.css";
import axios from "axios";
import { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { LoginPage } from "./components/authentication/LoginPage";
import { SignUp } from "./components/authentication/SignUpPage";
import { NavBar } from "./components/navigations/Navbar";
import { Calendar } from "./components/calendar/calendar";
import { KanbanPage } from "./components/kanbanBoard/kanbanPage";
import { SideNav } from "./components/navigations/IconSideNav";
import { Eisenhower } from "./components/EisenhowerMatrix/Eisenhower";
import { PrivateRoute } from "./PrivateRoute";
import { ProfileUpdatePage } from "./components/profile/profilePage";
import { Dashboard } from "./components/dashboard/dashboard";
import { LandingPage } from "./components/landingPage/LandingPage";
import { PublicRoute } from "./PublicRoute";
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
        .catch((error) => {});
    };

    checkLoginStatus();
  }, [setIsAuthenticated]);

  return <div>{isAuthenticated ? <AuthenticatedComponents /> : <NonAuthenticatedComponents />}</div>;
};

const NonAuthenticatedComponents = () => {
  return (
    <div>
      <Routes>
        <Route exact path="/l" element={<PublicRoute />}>
          <Route exact path="/l" element={<LandingPage />} />
        </Route>
        <Route exact path="/login" element={<PublicRoute />}>
          <Route exact path="/login" element={<LoginPage />} />
        </Route>
        <Route exact path="/signup" element={<PublicRoute />}>
          <Route exact path="/signup" element={<SignUp />} />
        </Route>
        <Route path="*" element={<Navigate to="/l" />} />
      </Routes>
    </div>
  );
};

const AuthenticatedComponents = () => {
  return (
    <div className="display: flex">
      <SideNav />
      <div className="flex-1 ml-[76px] overflow-hidden">
        <NavBar />
        <div className="overflow-x-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route exact path="/tasks" element={<PrivateRoute />}>
              <Route exact path="/tasks" element={<KanbanPage />} />
            </Route>
            <Route exact path="/profile" element={<PrivateRoute />}>
              <Route exact path="/profile" element={<ProfileUpdatePage />} />
            </Route>
            <Route exact path="/calendar" element={<PrivateRoute />}>
              <Route exact path="/calendar" element={<Calendar />} />
            </Route>
            <Route exact path="/priority" element={<PrivateRoute />}>
              <Route exact path="/priority" element={<Eisenhower />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
