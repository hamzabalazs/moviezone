import React from "react";

export const themeSwitchContext = React.createContext<{
  mode: "light" | "dark";
  switchMode: () => void;
}>({ mode: "light", switchMode: () => null });
