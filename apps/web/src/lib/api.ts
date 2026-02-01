const DEFAULT_API_BASE_URL = 'http://localhost:3001/api';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;

export type HealthStatus = {
  status: string;
  timestamp: string;
};

export async function getHealth(): Promise<HealthStatus | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return (await response.json()) as HealthStatus;
  } catch {
    return null;
  }
}
