import { api, publicApi } from "../config/ApiConfig";

const RETRYABLE_STATUS = new Set([401, 403, 404]);

const isRetryableError = (error) => RETRYABLE_STATUS.has(error?.response?.status);

const requestFromCandidates = async ({ paths, queryString = "" }) => {
  let lastError = null;

  for (const path of paths) {
    for (const client of [api, publicApi]) {
      try {
        const endpoint = queryString ? `${path}?${queryString}` : path;
        return await client.get(endpoint);
      } catch (error) {
        lastError = error;
        if (!isRetryableError(error)) {
          throw error;
        }
      }
    }
  }

  throw lastError || new Error("Unable to fetch product data.");
};

export const fetchProductsList = async (params) => {
  const queryString = params?.toString?.() || "";
  const paths = [
    "/api/products",
  ];

  return requestFromCandidates({ paths, queryString });
};

export const fetchNewArrivals = async (params) => {
  const queryString = params?.toString?.() || "";
  const paths = [
    "/api/products/new-arrivals",
  ];

  return requestFromCandidates({ paths, queryString });
};

export const fetchProductById = async (productId) => {
  const paths = [
    `/api/products/id/${productId}`,
  ];

  return requestFromCandidates({ paths });
};
