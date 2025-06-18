import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

export const useFetch = async <T = any>(
  path: string,
  options?: {
    headers?: Record<string, any>;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: Record<string, any>;
  },
  errHandlers?: Record<number, (message?: string) => void>
): Promise<T> => {
  const { headers = {}, method, body } = options ?? {};
  const apiUrl = import.meta.env.VITE_API_URL;
  const url = `${apiUrl}/${path}`;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    data: body,
  };

  try {
    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error: any) {
    if (errHandlers != null && errHandlers[error?.response?.status] != null) {
      const errorRes = error?.response?.data ?? null;
      if (errorRes?.response_message) {
        errHandlers[error?.response?.status](errorRes.response_message);
      } else {
        errHandlers[error?.response?.status](JSON.stringify(errorRes));
      }
    }

    throw error.response || error;
  }
};
