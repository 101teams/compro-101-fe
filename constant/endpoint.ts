export const BASE_API = "https://compro-api.101team.eu";

const ENDPOINT = {
  SERVICES: `${BASE_API}/api/services?populate=*`,
  CATEGORY: `${BASE_API}/api/categories`,
  WORKS: `${BASE_API}/api/works?populate=*`,
};

export default ENDPOINT;
