import { http } from './http';

export type User = {
  username: string;
  role: 'ROLE_CONSERJE' | 'ROLE_ADMIN';
};

export async function login(username: string, password: string): Promise<User> {
  const data = await http('/api/login', {
    method: 'POST',
    body: { username, password },
  });

  // Guardamos el token JWT en localStorage
  localStorage.setItem('token', data.token);

  return {
    username: data.username,
    role: data.role,
  };
}

export async function logout(): Promise<void> {
  // En JWT stateless basta con borrar el token
  localStorage.removeItem('token');
}

export async function me(): Promise<User | null> {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const data = await http('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { username: data.username, role: data.role };
  } catch (err: any) {
    if (err.status === 401) {
      // Token inválido o expirado
      return null;
    }
    throw err;
  }
}