import { useState } from "react";
import { AiOutlineHome, AiOutlineSchedule, AiOutlineUnorderedList, AiOutlinePieChart } from "react-icons/ai";
import { PiStepsDuotone } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const menuItems = [
  { id: 0, path: "/", icon: <AiOutlineHome /> },
  { id: 1, path: "/tasks", icon: <AiOutlineUnorderedList /> },
  { id: 2, path: "/calendar", icon: <AiOutlineSchedule /> },
  { id: 3, path: "/settings", icon: <IoSettingsOutline /> },
  { id: 4, path: "/priority", icon: <PiStepsDuotone /> },
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
    <nav className="bg-slate-950 p-4 flex flex-col items-center gap-2 h-full fixed top-0 left-0 z-50">
      {menuItems.map(item => (
        <NavItem
          key={item.id}
          icon={item.icon}
          selected={selected === item.id}
          id={item.id}
          setSelected={setSelected}
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
      whileTap={{ scale: 0.95 }}>
      <AnimatePresence>
        {selected && (
          <motion.span
            className="absolute inset-0 rounded-md bg-emerald-600 z-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}></motion.span>
        )}
      </AnimatePresence>
      <span className="block relative z-10">{icon}</span>
    </motion.button>
  );
};

export default IconSideNav;
