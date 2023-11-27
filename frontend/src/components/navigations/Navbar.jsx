import { useNavigate } from "react-router-dom";
import { apiUserLogout } from "src/api/AuthenticationApi";
import { useAuth } from "src/hooks/AuthHooks";

const settings = {
  Profile: "/profile",
  Account: "/account",
};

export function NavBar() {
  const Navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const logout = () => {
    apiUserLogout();
    setIsAuthenticated(false);
    Navigate("/");
  };

  return (
    <div data-theme="night" className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl" href="/">
          TurTask
        </a>
      </div>
      <div className="flex-none gap-2">
        {/* <div className="form-control">
          <button className="btn btn-success">Sync Data</button>
        </div> */}
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[10] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <a onClick={() => Navigate(settings.Profile)} className="justify-between">
                  Profile
                </a>
              </li>
              <li>
                <a onClick={() => Navigate(settings.Account)}>Settings</a>
              </li>
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <button className="btn btn-outline btn-info" onClick={() => Navigate("/login")}>
              Login
            </button>
            <button className="btn btn-success" onClick={() => Navigate("/signup")}>
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
