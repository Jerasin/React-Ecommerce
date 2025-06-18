import type {
  CreateProduct,
  PaginationResponse,
  Product,
  ProductCategory,
} from "../interface";
import { getItemLocalStorage, useFetch } from "../utils";

export const getProducts = async (
  page: number,
  errHandlers?: Record<number, () => void>
) => {
  const token = getItemLocalStorage("token");
  return await useFetch<PaginationResponse<Product[]>>(
    `products?page=${page}`,
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

export const getProductCategories = async (
  page: number,
  pageSize: number,
  errHandlers?: Record<number, () => void>
) => {
  const token = getItemLocalStorage("token");
  return await useFetch<PaginationResponse<ProductCategory[]>>(
    `products/categories?page=${page}&pageSize=${pageSize}`,
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

export const createProduct = async (
  payload: CreateProduct,
  errHandlers?: Record<number, () => void>
) => {
  const token = getItemLocalStorage("token");
  return await useFetch(
    `products`,
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
