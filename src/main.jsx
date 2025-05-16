import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./style.css";
import App from './App.jsx'
import { BrowserRouter } from "react-router";
import { LoginContextProvider } from "./context/LoginContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LoginContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </LoginContextProvider>
  </BrowserRouter>,
);
