import { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Read any existing session from localStorage on first load,
  // so a page refresh doesn't log the person out.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("sms_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("sms_token"));

  const login = useCallback(async (email, password) => {
    const res = await authApi.login(email, password); // -> hits POST /api/auth/login in C#
    const { token, fullName, role, userId } = res.data;
    const newUser = { fullName, role, userId };

    localStorage.setItem("sms_token", token);
    localStorage.setItem("sms_user", JSON.stringify(newUser));
    setToken(token);
    setUser(newUser);
    return newUser;
  }, []);

  const registerAdmin = useCallback(async (fullName, email, password) => {
    const res = await authApi.registerAdmin(fullName, email, password);
    const { token, role, userId } = res.data;
    const newUser = { fullName, role, userId };

    localStorage.setItem("sms_token", token);
    localStorage.setItem("sms_user", JSON.stringify(newUser));
    setToken(token);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_user");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthed: !!token, login, registerAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Any component calls useAuth() instead of digging through props -
// that's the whole point of Context for global state.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
