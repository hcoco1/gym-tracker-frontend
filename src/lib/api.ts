const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const api = {
  workouts: {
    getAll: () => `${API_BASE_URL}/workouts/`,
    create: () => `${API_BASE_URL}/workouts/`,
    delete: (id: number) => `${API_BASE_URL}/workouts/${id}`,
  },
  auth: {
    login: () => `${API_BASE_URL}/auth/token`,
    register: () => `${API_BASE_URL}/auth/register`,
  },
};

export const authHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});