import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { StateContextProvider } from "./context";
import { Omchain } from "@thirdweb-dev/chains";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const clientId = "6f138582e1821fecdf41e29d6152c2f5";

root.render(
  <ThirdwebProvider activeChain={Omchain} clientId={clientId}>
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);
