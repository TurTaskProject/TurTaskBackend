import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import homeLogo from "../assets/home.png";
import calendarLogo from "../assets/calendar.png";
import planLogo from "../assets/planning.png";
import pieLogo from "../assets/pie-chart.png";
import plusLogo from "../assets/plus.png";

const menuItems = [
  { id: 0, path: "/", icon: <homeLogo />, logo: homeLogo },
  { id: 1, path: "/tasks", icon: <planLogo />, logo: planLogo },
  { id: 2, path: "/calendar", icon: <calendarLogo />, logo: calendarLogo },
  { id: 3, path: "/pie", icon: <pieLogo />, logo: pieLogo },
  { id: 4, path: "/plus", icon: <plusLogo />, logo: plusLogo },
];

const IconSideNav = () => {
  return (
    <div className="bg-slate-900 text-slate-100 flex">
      <SideNav />
    </div>
  );
};

const SideNav = () => {
  const [selected, setSelected] = useState(0);

  return (
    <nav className="bg-slate-950 p-4 flex flex-col items-center gap-2 h-screen">
      {menuItems.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          selected={selected === item.id}
          id={item.id}
          setSelected={setSelected}
          logo={item.logo}
          path={item.path}
        />
      ))}
    </nav>
  );
};

const NavItem = ({ icon, selected, id, setSelected, logo, path }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      className="p-3 text-xl bg-slate-800 hover-bg-slate-700 rounded-md transition-colors relative"
      onClick={() => {
        setSelected(id);
        navigate(path);
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {selected && (
          <motion.span
            className="absolute inset-0 rounded-md bg-indigo-600 z-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          ></motion.span>
        )}
      </AnimatePresence>
      <span className="block relative z-10">
        {icon}
        <img src={logo} alt="Logo" className="h-8 w-8 mx-auto my-2" />
      </span>
    </motion.button>
  );
};

export default IconSideNav;
