import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export type AsyncActionStatus = "idle" | "loading" | "success" | "failed";

export const useAsyncAction = <TInput, TResult>(
  action: (input: TInput) => Promise<TResult>
) => {
  const [status, setStatus] = useState<AsyncActionStatus>("idle");
  const [result, setResult] = useState<TResult | null>(null);
  const [errMessage, setErrMessage] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const execute = async (input: TInput) => {
    setStatus("loading");
    setErrMessage(null);

    try {
      const result = await action(input);
      setResult(result);
      setStatus("success");
      return result;
    } catch (error) {
      let message = "Something went wrong.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message;
        if (error.response?.data?.error?.name === "TokenExpiredError") {
          logout();
          navigate("/login");
        }
      }
      setErrMessage(message);
      setStatus("failed");
      throw error;
    }
  };

  return {
    status,
    result,
    errMessage,
    execute,
  };
};
