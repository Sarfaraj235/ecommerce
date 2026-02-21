import { api } from "../config/ApiConfig";
import { 
  FIND_PRODUCTS_FAILURE, 
  FIND_PRODUCTS_REQUEST, 
  FIND_PRODUCTS_SUCCESS 
} from "./ActionType";

import { 
  FIND_PRODUCT_BY_ID_FAILURE, 
  FIND_PRODUCT_BY_ID_REQUEST, 
  FIND_PRODUCT_BY_ID_SUCCESS 
} from "./ActionType";


export const findProducts = (reqData) => async (dispatch) => {
  dispatch({ type: FIND_PRODUCTS_REQUEST });

  const {
    colors,
    sizes,
    minPrice,
    maxPrice,
    minDiscount,
    category,
    stock,
    sort,
    pageNumber,
    pageSize,
  } = reqData;

  try {
    const buildParams = (categoryValue) => {
      const params = new URLSearchParams();

      (colors ? colors.split(",").filter(Boolean) : []).forEach((c) =>
        params.append("color", c)
      );
      (sizes ? sizes.split(",").filter(Boolean) : []).forEach((s) =>
        params.append("size", s)
      );

      params.append("category", categoryValue ?? "");
      params.append("minPrice", String(minPrice ?? 0));
      params.append("maxPrice", String(maxPrice ?? 100000));
      params.append("minDiscount", String(minDiscount ?? 0));
      params.append("sort", sort ?? "");
      params.append("stock", stock ?? "");
      params.append("pageNumber", String(pageNumber ?? 0));
      params.append("pageSize", String(pageSize ?? 12));
      return params;
    };

    const { data } = await api.get(`/api/products?${buildParams(category).toString()}`);

    const content = Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data)
        ? data
        : [];

    // Fallback for backends that store category names with spaces instead of underscores.
    if (content.length === 0 && typeof category === "string" && category.includes("_")) {
      const categoryWithSpaces = category.replace(/_/g, " ");
      const retry = await api.get(`/api/products?${buildParams(categoryWithSpaces).toString()}`);
      dispatch({
        type: FIND_PRODUCTS_SUCCESS,
        payload: retry.data,
      });
      return;
    }

    console.log("product data: ", data);
    
    dispatch({
      type: FIND_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("findProducts error:", error.response?.data || error.message);
    dispatch({
      type: FIND_PRODUCTS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};


export const findProductsById = (reqData) => async (dispatch) => {
  dispatch({ type: FIND_PRODUCT_BY_ID_REQUEST });
  
  const { productId } = reqData;
  
  try {
    // API call to fetch a single product by its ID
    const { data } = await api.get(`/api/products/id/${productId}`);
    
    dispatch({ 
      type: FIND_PRODUCT_BY_ID_SUCCESS, 
      payload: data 
    });
  } catch (error) {
    dispatch({ 
      type: FIND_PRODUCT_BY_ID_FAILURE, 
      payload: error.message 
    });
  }
};
