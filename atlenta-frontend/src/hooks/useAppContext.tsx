import { useContext } from "react";
import { AppContext } from "src/context/AppContext";
import { IAppContext } from "src/types/context";

export const useAppContext = (): IAppContext => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};
