import { createContext, useState, useContext, useEffect } from "react";

interface AuthState {
  username: string;
  roles: number[];
  accessToken: string;
  address: string;
  name: string;
  familyName: string;
}

type AuthContextType = {
  auth: AuthState | undefined;
  setAuth: React.Dispatch<React.SetStateAction<AuthState | undefined>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [auth, setAuth] = useState<AuthState | undefined>(undefined);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (auth) {
      setUsername(auth.name);
    }
  }, [auth]);

  const value: AuthContextType = {
    auth,
    setAuth,
    username,
    setUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
