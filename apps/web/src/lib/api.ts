import axios from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:3001/api";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export type HealthStatus = {
  status: string;
  timestamp: string;
};

export async function getHealth(): Promise<HealthStatus | null> {
  try {
    const response = await apiClient.get<HealthStatus>("/health", {
      headers: { "Cache-Control": "no-store" },
    });
    return response.data;
  } catch {
    return null;
  }
}
