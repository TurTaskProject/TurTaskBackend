import { useEffect } from "react";
import PropTypes from "prop-types";
import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const contextValue = {
    isAuthenticated,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
