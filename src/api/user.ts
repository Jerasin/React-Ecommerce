import type { ApiResponse, PaginationResponse, UserInfo } from "../interface";
import { getItemLocalStorage, useFetch } from "../utils";

export const getUserInfo = async (
  errHandlers?: Record<number, (message?: string) => void>
) => {
  const token = getItemLocalStorage("token");
  return useFetch<ApiResponse<UserInfo>>(
    `users/info`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    },
    errHandlers
  );
};

export const getUsers = async (
  errHandlers?: Record<number, (message?: string) => void>
) => {
  const token = getItemLocalStorage("token");
  return useFetch<PaginationResponse<UserInfo[]>>(
    `users`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    },
    errHandlers
  );
};
