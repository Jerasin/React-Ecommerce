export const useFetch = async <T>(
  path: string,
  options?: {
    headers?: Record<string, any>;
    method: string;
    body?: Record<string, any>;
  }
): Promise<T | undefined> => {
  const { headers, method, body } = options ?? {};
  const apiUrl = import.meta.env.VITE_API_URL;
  const payload = {
    method,
    headers,
  } as any;

  if (body) {
    payload["body"] = JSON.stringify(body);
  }

  const response = await fetch(`${apiUrl}/${path}`, payload);

  const result = await response.json();

  console.log("result",result)

  if (!response.ok) {
    throw new Error(result.response_message || "Something went wrong");
  }

  return result as T;
};
