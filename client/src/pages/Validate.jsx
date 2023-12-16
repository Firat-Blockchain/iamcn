import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { CustomButton } from "../components";

const Validate = () => {
  const [secretKey, setSecretKey] = useState("");
  const { updateCampaignStatus } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.search.split("=")[1];

  const validate = async () => {
    const req = await fetch(
      `https://834a-212-174-46-103.ngrok-free.app/validate?id=${id}&secret=${secretKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": true,
        },
      }
    );
    const res = await req.json();
    if (res) {
      console.log("aaa");
      updateCampaignStatus(id);
      navigate("/");
    }
    setSecretKey("");
  };

  return (
    <div>
      <h1>Enter Your Secret</h1>
      <input
        type="text"
        placeholder=" secret key"
        onChange={(e) => setSecretKey(e.target.value)}
        style={{
          width: "100%",
          height: "50px",
          marginTop: "20px",
          marginBottom: "20px",
          padding: "10px",
          borderRadius: "8px",
        }}
      />
      <CustomButton
        btnType="button"
        title={"Submit"}
        styles={"bg-tertiary"}
        handleClick={validate}
      />
    </div>
  );
};

export default Validate;
