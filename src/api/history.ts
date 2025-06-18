import type { HistoryInfo, PaginationResponse } from "../interface";
import { getItemLocalStorage, useFetch } from "../utils";

export const getListHistory = async (
  page: number,
  errHandlers?: Record<number, (message?: string) => void>
) => {
  const token = getItemLocalStorage("token");

  return await useFetch<PaginationResponse<HistoryInfo[]>>(
    `orders?page=${page}`,
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
