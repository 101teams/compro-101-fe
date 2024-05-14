export const BASE_API = "http://127.0.0.1:1337";

const ENDPOINT = {
  SERVICES: `${BASE_API}/api/services?populate=*`,
  CATEGORY: `${BASE_API}/api/categories`,
  WORKS: `${BASE_API}/api/works?populate=*`,
};

export default ENDPOINT;
