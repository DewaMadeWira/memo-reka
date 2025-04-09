export type User = {
  id: number;
  name: string;
  role_id: number;
  division_id: number;
  email: string;
  password: string;
  remember_token?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};