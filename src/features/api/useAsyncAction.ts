import axios, { AxiosResponse } from "axios";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "failed";

export const useAsyncAction = <TInput, TResult>(
  action: (input: TInput) => Promise<TResult>
) => {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<TResult | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const execute = async (input: TInput) => {
    setStatus("loading");
    setErr(null);

    try {
      const result = await action(input);
      setResult(result);
      setStatus("success");
      return result;
    } catch (error) {
      let message = "Something went wrong.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message;
      }
      setErr(message);
      setStatus("failed");
      throw message;
    }
  };

  return {
    status,
    result,
    err,
    execute,
  };
};
