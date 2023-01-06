import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../Navbar";
import LeftBar from "../LeftBar";
import RightBar from "../RightBar";
import { useSelector } from "react-redux";
import { httpClient } from "../../httpClient.ts";

export const Private = ({ children }) => {
  const currentUser = useSelector((state) => state.app.user);

  return (
    <div className={`theme-${true ? "dark" : "light"}`}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <LeftBar />
        <div style={{ flex: 6 }}>
          {currentUser ? { children } : <Navigate to="/login" />}
        </div>
        <RightBar />
      </div>
    </div>
  );
};
