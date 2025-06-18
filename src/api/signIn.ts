import type { SignInResponse } from "../interface";
import { useFetch } from "../utils";

export const signIn = async (
  formData: Record<string, any>,
  errHandlers?: Record<number, (message?: string) => void>
) => {
  return useFetch<SignInResponse>(
    "auth/login",
    {
      method: "POST",
      body: formData,
    },
    errHandlers
  );
};
