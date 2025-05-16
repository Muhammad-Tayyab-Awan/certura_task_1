/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import authAPI from "../api/auth";

const LoginContext = createContext({
  loggedIn: false,
  userId: null,
  username: null,
});

export function LoginContextProvider({ children }) {
  const [loginState, setLoginState] = useState({
    loggedIn: false,
    userId: null,
    username: null,
  });
  useEffect(() => {
    authAPI.login_status().then((response) => {
      if (response.resStatus) {
        setLoginState(response.userStatus);
      }
    });
  }, []);
  return (
    <LoginContext.Provider value={{ ...loginState, setLoginState }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLoginContext() {
  return useContext(LoginContext);
}

export default LoginContext;
