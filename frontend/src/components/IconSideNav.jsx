import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SiFramer, SiTailwindcss, SiReact, SiJavascript, SiCss3 } from "react-icons/si";
import homeLogo from "../assets/home.png";
import calendarLogo from "../assets/calendar.png";
import planLogo from "../assets/planning.png";
import pieLogo from "../assets/pie-chart.png";
import plusLogo from "../assets/plus.png";

const menuItems = [
  { id: 0, icon: <homeLogo />, logo: homeLogo },
  { id: 1, icon: <calendarLogo />, logo: calendarLogo },
  { id: 2, icon: <planLogo />, logo: planLogo },
  { id: 3, icon: <pieLogo />, logo: pieLogo },
  { id: 4, icon: <plusLogo />, logo: plusLogo },
];

const IconSideNav = () => {
  return (
    <div className="bg-slate-900 text-slate-100 flex">
      <SideNav />
      <div className="w-full"></div>
    </div>
  );
};

const SideNav = () => {
  const [selected, setSelected] = useState(0);

  return (
    <nav className="h-[500px] w-fit bg-slate-950 p-4 flex flex-col items-center gap-2">
      {menuItems.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          selected={selected === item.id}
          id={item.id}
          setSelected={setSelected}
          logo={item.logo}
        />
      ))}
    </nav>
  );
};

const NavItem = ({ icon, selected, id, setSelected, logo }) => {
  return (
    <motion.button
      className="p-3 text-xl bg-slate-800 hover-bg-slate-700 rounded-md transition-colors relative"
      onClick={() => setSelected(id)}
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