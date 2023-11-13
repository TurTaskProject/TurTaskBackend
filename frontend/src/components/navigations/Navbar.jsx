import * as React from "react";
import { useNavigate } from "react-router-dom";
import IsAuthenticated from "../../hooks/authentication/IsAuthenticated";
import axiosapi from "../../api/AuthenticationApi";

const settings = {
  Profile: '/update_profile',
  Account: '/account',
};

function NavBar() {
  const Navigate = useNavigate();

  const isAuthenticated = IsAuthenticated();

  const logout = () => {
    axiosapi.apiUserLogout();
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
        <div className="form-control">
          <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        </div>
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://us-tuna-sounds-images.voicemod.net/f322631f-689a-43ac-81ab-17a70f27c443-1692187175560.png" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <a href={settings.Profile} className="justify-between">
                  Profile
                </a>
              </li>
              <li>
                <a href={settings.Account}>Settings</a>
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
export default NavBar;
