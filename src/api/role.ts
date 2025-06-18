import type { PaginationResponse, RoleInfo } from "../interface";
import { getItemLocalStorage, useFetch } from "../utils";

export const getRoles = async (errHandlers?: Record<number, () => void>) => {
  const token = getItemLocalStorage("token");

  return await useFetch<PaginationResponse<RoleInfo[]>>(
    `role_infos`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    errHandlers
  );
};
