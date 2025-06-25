export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  companyId: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const getStoredAuth = (): { token: string | null; user: User | null } => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return { token, user };
};

export const setStoredAuth = (authResponse: AuthResponse) => {
  if (typeof window === 'undefined') return;

  localStorage.setItem('token', authResponse.access_token);
  localStorage.setItem('user', JSON.stringify(authResponse.user));
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  const { token } = getStoredAuth();
  return !!token;
};