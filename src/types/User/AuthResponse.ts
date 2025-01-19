export interface AuthResponse {
    status: number;
    token: string;
    role: string; 
    acls: string[]; 
    emailUser: string;
  }