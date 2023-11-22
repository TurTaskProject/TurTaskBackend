import { useContext } from "react";
import AuthContext from "src/contexts/AuthContextProvider";

/**
 * useAuth - Custom React Hook for Accessing Authentication Context
 *
 * @returns {Object} An object containing:
 *   - {boolean} isAuthenticated: A boolean indicating whether the user is authenticated.
 *   - {function} setIsAuthenticated: A function to set the authentication status manually.
 *
 * @throws {Error} If used outside the context of an AuthProvider.
 *
 * @example
 * // Import the hook
 * import useAuth from './AuthHooks';
 *
 * // Inside a functional component
 * const { isAuthenticated, setIsAuthenticated } = useAuth();
 *
 * // Check authentication status
 * if (isAuthenticated) {
 *   // User is authenticated
 * } else {
 *   // User is not authenticated
 * }
 *
 * // Manually set authentication status
 * setIsAuthenticated(true);
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
