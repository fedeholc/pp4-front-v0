import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";

export function UserProvider({ children }) {
  /**@typedef {import("../../types").UsuarioCompleto } UsuarioCompleto */

  /** @type {[UsuarioCompleto | null, React.Dispatch<React.SetStateAction<UsuarioCompleto | null>>]} */
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

 

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{ user, token, setUser, setToken, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}
