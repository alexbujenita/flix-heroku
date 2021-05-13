import Cookies from "js-cookie";

/**
 * Temporary solution to know if a user is logged in
 * @return {string} - the cookie
 */
export default function isLogged() {
  return Boolean(localStorage.getItem("JWT_TOKEN"));
}