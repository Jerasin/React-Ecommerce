import { jwtDecode } from "jwt-decode";
import type {
  CreateWallet,
  PaginationResponse,
  WalletInfo,
} from "../interface";
import { getItemLocalStorage, useFetch } from "../utils";

type CreateWalletWithOptionalUserId = Omit<CreateWallet, "userId"> &
  Partial<Pick<CreateWallet, "userId">>;

export const getListWallet = async (
  errHandlers?: Record<number, (message?: string) => void>
) => {
  const token = getItemLocalStorage("token");
  return await useFetch<PaginationResponse<WalletInfo[]>>(
    `wallets`,
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

export const createWallet = async (
  payload: CreateWalletWithOptionalUserId,
  errHandlers?: Record<number, (message?: string) => void>
) => {
  const token = getItemLocalStorage("token");
  const decoded = jwtDecode<{ id: number }>(token);
  payload.userId = decoded.id;

  return await useFetch(
    "wallets",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    },
    errHandlers
  );
};
