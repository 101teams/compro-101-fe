export const BASE_API = process.env.NEXT_PUBLIC_BASE_API;

const ENDPOINT = {
  SERVICES: `${BASE_API}/api/services`,
  CATEGORY: `${BASE_API}/api/categories`,
  WORKS: `${BASE_API}/api/works`,
  CLIENTS: `${BASE_API}/api/clients`,
};

export default ENDPOINT;
