import type { NavigateFunction } from "react-router-dom";

export const ErrorHandler = (navigate: NavigateFunction) => {
  localStorage.clear();
  navigate("/");
};
