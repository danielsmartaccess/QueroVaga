export interface Resident {
  id?: number;
  name: string;
  apartment: string;
  email: string;
  is_admin?: boolean;
}

export interface ResidentCreate extends Resident {
  password: string;
}

export interface ResidentUpdate {
  name?: string;
  apartment?: string;
  email?: string;
  password?: string;
}
