// src/context/Context.jsx
import React, { createContext, useReducer } from "react";
import { reducer } from "./Reducer"; // ✅ file name starts with capital 'R'

export const GlobalContext = createContext("Initial Value");

let data = {
  user: {},
  isLogin: null,
};

export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, data);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}
