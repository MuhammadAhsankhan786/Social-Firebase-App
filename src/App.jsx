import React, { useContext, useEffect } from "react";
import "./App.css";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { GlobalContext } from "./context/Context";
import CustomRoutes from "./components/CustomRoutes";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ import toaster

function App() {
  const { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "USER_LOGIN", payload: user });
        console.log("user logged in:", user);
      } else {
        dispatch({ type: "USER_LOGOUT" });
        console.log("user not found");
      }
    });

    return () => unsubscribe();
  }, []);

  const logoutUser = () => {
    signOut(auth)
      .then(() => console.log("Sign-out successful."))
      .catch((error) => console.log("Sign-out error:", error));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Toaster added here for global accessibility */}
      <Toaster position="top-center" reverseOrder={false} />

      <header className="flex items-center justify-between bg-white shadow px-6 py-4">
        <h1 className="text-2xl font-bold text-blue-600">React Social App</h1>
        {state?.isLogin ? (
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-blue-600 text-lg font-semibold">
              Profile
            </Link>
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Home
            </Link>
            <button
              onClick={logoutUser}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <nav className="flex space-x-4">
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login
            </Link>
          </nav>
        )}
      </header>
      <main className="p-4">
        <CustomRoutes />
      </main>
    </div>
  );
}

export default App;
