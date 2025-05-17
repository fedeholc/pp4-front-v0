import { createContext } from "react";

/** @typedef {import("../../types").UsuarioCompleto } UsuarioCompleto */
/** @typedef {{ user: UsuarioCompleto | null, token: string | null,  setUser: React.Dispatch<React.SetStateAction<UsuarioCompleto | null>>, setToken: React.Dispatch<React.SetStateAction<string | null>>, logout: () => void }} UserContextType */
/** @type {React.Context<UserContextType | null>} */
export const UserContext = createContext(null);
