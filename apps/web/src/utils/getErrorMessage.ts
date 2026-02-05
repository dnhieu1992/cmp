import axios from "axios";

export function getErrorMessage(error: unknown, fallback = "Unable to sign in") {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
