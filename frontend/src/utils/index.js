import { jwtDecode } from 'jwt-decode';

export const categories = {
  community: 'paguyuban',
  health: 'kesehatan',
  retirement: 'pensiun',
}

export const getUserInfoFromToken = (key, token = localStorage.getItem('token')) => {
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded[key] || null;
}