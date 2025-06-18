import type { ApiResponse, OrderDetailItem } from "../interface";
import { getItemLocalStorage, useFetch } from "../utils";

export const getOrderDetail = async (
  orderId: number,
  errHandlers?: Record<number, (message?: string) => void>
) => {
  const token = getItemLocalStorage("token");

  return useFetch<ApiResponse<OrderDetailItem[]>>(
    `orders/${orderId}`,
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
