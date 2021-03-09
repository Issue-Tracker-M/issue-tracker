import decode from "jwt-decode";

const KEY = "cfa8ebf4";

export const setToken = (token: string): void => {
  const item = JSON.stringify(token);
  localStorage.setItem(KEY, item);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decode<{ exp: number }>(token);
    if (decoded.exp < Date.now() / 1000) return true;
    return false;
  } catch (error) {
    return false;
  }
};
