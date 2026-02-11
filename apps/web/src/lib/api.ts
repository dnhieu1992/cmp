import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

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

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

function isUnauthorizedError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

function shouldSkipRefresh(url?: string): boolean {
  if (!url) return false;
  return url.includes("/login") || url.includes("/register") || url.includes("/refresh");
}

function parseCookieHeader(cookieHeader: string | undefined): Map<string, string> {
  const map = new Map<string, string>();
  if (!cookieHeader) return map;

  for (const chunk of cookieHeader.split(";")) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!key) continue;
    map.set(key, value);
  }

  return map;
}

function mergeCookieHeader(
  originalCookieHeader: string | undefined,
  setCookieHeaders: string | string[] | undefined,
): string | undefined {
  if (!setCookieHeaders) return originalCookieHeader;

  const cookies = parseCookieHeader(originalCookieHeader);
  const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];

  for (const setCookie of headers) {
    const firstPart = setCookie.split(";")[0]?.trim();
    if (!firstPart) continue;

    const eqIndex = firstPart.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = firstPart.slice(0, eqIndex).trim();
    const value = firstPart.slice(eqIndex + 1).trim();
    if (!key) continue;

    cookies.set(key, value);
  }

  const merged = [...cookies.entries()].map(([key, value]) => `${key}=${value}`);
  return merged.length ? merged.join("; ") : undefined;
}

if (typeof window !== "undefined") {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!isUnauthorizedError(error)) {
        return Promise.reject(error);
      }

      const originalRequest = error.config as RetriableRequestConfig | undefined;
      if (!originalRequest || originalRequest._retry || shouldSkipRefresh(originalRequest.url)) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      await apiClient.post("/refresh");
      return apiClient.request(originalRequest);
    },
  );
}

export async function getServerApiClient(): Promise<AxiosInstance> {
  const { cookies } = await import("next/headers");
  const cookie = (await cookies()).toString();

  return createApiClient(SERVER_API_BASE_URL, {
    headers: cookie ? { cookie } : undefined,
  });
}

async function serverRequest<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> {
  const api = await getServerApiClient();
  const requestConfig: AxiosRequestConfig =
    method === "get" || method === "delete" ? { ...config } : { ...config, data };

  try {
    return await api.request<T>({
      ...requestConfig,
      method,
      url,
    });
  } catch (error) {
    if (!isUnauthorizedError(error) || shouldSkipRefresh(url)) {
      throw error;
    }

    const originalCookieHeader = (requestConfig.headers as Record<string, string> | undefined)
      ?.cookie;
    const refreshResponse = await api.post("/refresh");
    const mergedCookieHeader = mergeCookieHeader(
      originalCookieHeader,
      refreshResponse.headers["set-cookie"],
    );

    const retriedHeaders = {
      ...(requestConfig.headers ?? {}),
      ...(mergedCookieHeader ? { cookie: mergedCookieHeader } : {}),
    };

    return api.request<T>({
      ...requestConfig,
      headers: retriedHeaders,
      method,
      url,
    });
  }
}

export async function serverGet<T>(url: string, config?: AxiosRequestConfig) {
  return serverRequest<T>("get", url, undefined, config);
}

export async function serverPost<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  return serverRequest<T>("post", url, data, config);
}

export async function serverPut<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  return serverRequest<T>("put", url, data, config);
}

export async function serverPatch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
  return serverRequest<T>("patch", url, data, config);
}

export async function serverDelete<T>(url: string, config?: AxiosRequestConfig) {
  return serverRequest<T>("delete", url, undefined, config);
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
