import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";

export function UserProvider({ children }) {
  /**@typedef {import("../../types").Usuario } Usuario*/

  /** @type {[Usuario | null, React.Dispatch<React.SetStateAction<Usuario | null>>]} */
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  /**
   * @param {Usuario} userData
   * @param {string} tokenData
   */
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
