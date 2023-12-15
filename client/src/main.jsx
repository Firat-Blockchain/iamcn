import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Omchain } from "@thirdweb-dev/chains";
import App from "./App";
import "./index.css";
import { StateContextProvider } from "./context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThirdwebProvider activeChain={Omchain} clientId={"id"}>
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);