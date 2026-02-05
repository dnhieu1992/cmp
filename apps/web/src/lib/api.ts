import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";

const DEFAULT_API_BASE_URL = "http://localhost:3001/api";

const SERVER_API_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? SERVER_API_BASE_URL;

function createApiClient(baseURL: string, config?: AxiosRequestConfig): AxiosInstance {
  return axios.create({
    baseURL,
    withCredentials: true,
    ...config,
  });
}

export const apiClient = createApiClient(API_BASE_URL);

export async function getServerApiClient(): Promise<AxiosInstance> {
  const { cookies } = await import("next/headers");
  const cookie = (await cookies()).toString();

  return createApiClient(SERVER_API_BASE_URL, {
    headers: cookie ? { cookie } : undefined,
  });
}

export async function serverGet<T>(url: string, config?: AxiosRequestConfig) {
  const api = await getServerApiClient();
  return api.get<T>(url, config);
}

export async function serverPost<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const api = await getServerApiClient();
  return api.post<T>(url, data, config);
}

export async function serverPut<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const api = await getServerApiClient();
  return api.put<T>(url, data, config);
}

export async function serverPatch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  const api = await getServerApiClient();
  return api.patch<T>(url, data, config);
}

export async function serverDelete<T>(url: string, config?: AxiosRequestConfig) {
  const api = await getServerApiClient();
  return api.delete<T>(url, config);
}

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
