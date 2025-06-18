import type { SignUp } from "../interface";
import { useFetch } from "../utils";

export const signUp = async (
  payload: SignUp,
  errHandlers?: Record<number, (message?: string) => void>
) => {
  return await useFetch(
    `auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    },
    errHandlers
  );
};
