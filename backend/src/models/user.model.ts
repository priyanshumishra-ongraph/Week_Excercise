export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

// In-memory store
export const users: User[] = [];
