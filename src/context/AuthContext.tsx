import jwtDecode from "jwt-decode";
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useState } from "react";

interface JWTContent {
  user_id: number,
  username: string,
  email: string,
  exp: number,
  iat: number,
}

function retrieveUser(token: string | null) {
  if (!token) return null;
  try {
    return jwtDecode<JWTContent>(token);
  } catch (e) {
    return null;
  }
}

interface AuthContextValues {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  user: JWTContent | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContextValues);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('access')
  );
  const user = retrieveUser(token);
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ token, setToken, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
