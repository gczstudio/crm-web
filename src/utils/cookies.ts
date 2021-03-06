import Cookies from "js-cookie";

// User
const tokenKey = "edmp_access_token";
export const getToken = () => Cookies.get(tokenKey);
export const setToken = (token: string) => Cookies.set(tokenKey, token);
export const removeToken = () => Cookies.remove(tokenKey);
