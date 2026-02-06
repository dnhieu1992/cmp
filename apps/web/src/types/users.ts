import type { Role } from "@/types/roles";

export type User = {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  roles?: Role[];
  updated_at?: string | Date | null;
  is_deleted?: boolean;
  status?: string | null;
};
