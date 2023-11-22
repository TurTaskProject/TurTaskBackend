import { Link } from "react-router-dom";

export const NavPreLogin = ({ text, btn_text, link }) => {
  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 border-2 border-neutral-400">
      <div className="navbar-start"></div>
      <div className="navbar-center hidden lg:flex"></div>
      <div className="navbar-end space-x-3">
        <p className="font-bold">{text}</p>
        <Link to={link} className="btn bg-blue-700 hover:bg-blue-900 text-white font-bold">
          {btn_text}
        </Link>
      </div>
    </div>
  );
};
