import React from "react";
import { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom"; // Fixed import
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import { GlobalContext } from "../context/Context";
// import Navbar from "./NavBar"; // Importing Navbar

const CustomRoutes = () => {
  const { state } = useContext(GlobalContext);

  return (
    <div>
      {state?.isLogin === true ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : state?.isLogin === false ? (
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="text-center text-gray-600 py-8 text-lg">Loading...</div>
      )}
    </div>
  );
};

export default CustomRoutes;
