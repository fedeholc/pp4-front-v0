import { useState } from "react";
import { UserContext } from "./UserContext";

export function UserProvider({ children }) {
  /**@typedef {import("../../types").Usuario } Usuario*/

  /** @type {[Usuario | null, React.Dispatch<React.SetStateAction<Usuario | null>>]} */
  const [user, setUser] = useState({
    id: null,
    email: null,
    password: null,
    rol: null,
  });

  /** @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]} */
  const [token, setToken] = useState(null);

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
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
