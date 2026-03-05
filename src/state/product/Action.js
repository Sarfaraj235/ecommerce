import { fetchNewArrivals, fetchProductById, fetchProductsList } from "./productApi";
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
    const parseProductList = (responseData) =>
      (Array.isArray(responseData?.content) && responseData.content) ||
      (Array.isArray(responseData?.products) && responseData.products) ||
      (Array.isArray(responseData?.data) && responseData.data) ||
      (Array.isArray(responseData) && responseData) ||
      [];

    const buildParams = (categoryValue) => {
      const params = new URLSearchParams();

      (colors ? colors.split(",").filter(Boolean) : []).forEach((c) =>
        params.append("color", c)
      );
      (sizes ? sizes.split(",").filter(Boolean) : []).forEach((s) =>
        params.append("size", s)
      );

      const normalizedCategory =
        typeof categoryValue === "string" ? categoryValue.trim() : categoryValue;
      if (normalizedCategory) {
        params.append("category", normalizedCategory);
      }
      params.append("minPrice", String(minPrice ?? 0));
      params.append("maxPrice", String(maxPrice ?? 100000));
      params.append("minDiscount", String(minDiscount ?? 0));
      params.append("sort", sort ?? "");
      params.append("stock", stock ?? "");
      params.append("pageNumber", String(pageNumber ?? 0));
      params.append("pageSize", String(pageSize ?? 12));
      return params;
    };

    const categoryAliasMap = {
      womens_top: ["women_top", "womens_tops", "women_tops", "womens tops", "women tops", "top", "tops"],
      women_top: ["womens_top", "womens_tops", "women_tops", "womens tops", "women tops", "top", "tops"],
      womens_tops: ["women_tops", "womens_top", "women_top", "womens tops", "women tops", "top", "tops"],
      women_tops: ["womens_tops", "womens_top", "women_top", "womens tops", "women tops", "top", "tops"],
      womens_dress: ["women_dress", "womens_dresses", "women_dresses", "womens dresses", "women dresses", "dress", "dresses"],
      women_dress: ["womens_dress", "womens_dresses", "women_dresses", "womens dresses", "women dresses", "dress", "dresses"],
      womens_dresses: ["women_dresses", "womens_dress", "women_dress", "womens dresses", "women dresses", "dress", "dresses"],
      women_dresses: ["womens_dresses", "womens_dress", "women_dress", "womens dresses", "women dresses", "dress", "dresses"],
      womens_pant: ["women_pant", "womens_pants", "women_pants", "womens pants", "women pants", "pant", "pants", "trouser", "trousers"],
      women_pant: ["womens_pant", "womens_pants", "women_pants", "womens pants", "women pants", "pant", "pants", "trouser", "trousers"],
      womens_pants: ["women_pants", "womens_pant", "women_pant", "womens pants", "women pants", "pant", "pants", "trouser", "trousers"],
      women_pants: ["womens_pants", "womens_pant", "women_pant", "womens pants", "women pants", "pant", "pants", "trouser", "trousers"],
      mens_watch: ["men_watch", "mens_watches", "men_watches", "mens watch", "men watch", "watches", "watch"],
      men_watch: ["mens_watch", "mens_watches", "men_watches", "mens watch", "men watch", "watches", "watch"],
      mens_watches: ["men_watches", "mens_watch", "men_watch", "mens watches", "men watches", "watch", "watches"],
      men_watches: ["mens_watches", "mens_watch", "men_watch", "mens watches", "men watches", "watch", "watches"],
      mens_jackets: ["mens_jacket", "men_jackets", "men_jacket", "mens jacket", "men jacket", "jacket", "jackets"],
      mens_kurta: ["men_kurta", "mens kurta", "men kurta"],
    };

    if (typeof category === "string") {
      const categoryKey = category.trim().toLowerCase();
      const feedSegmentMap = {
        men_all: "men",
        women_all: "women",
        all: "all",
      };
      const mappedSegment = feedSegmentMap[categoryKey];

      if (mappedSegment) {
        const arrivalsParams = new URLSearchParams();
        arrivalsParams.append("segment", mappedSegment);
        arrivalsParams.append("pageNumber", String(pageNumber ?? 0));
        arrivalsParams.append("pageSize", String(pageSize ?? 12));
        if (sort) arrivalsParams.append("sort", sort);

        const { data } = await fetchNewArrivals(arrivalsParams);
        dispatch({
          type: FIND_PRODUCTS_SUCCESS,
          payload: data,
        });
        return;
      }
    }

    const { data } = await fetchProductsList(buildParams(category));

    const content = parseProductList(data);

    // Fallback for backends that store category names with spaces instead of underscores.
    if (
      content.length === 0 &&
      typeof category === "string" &&
      category.trim() &&
      category.includes("_")
    ) {
      const categoryWithSpaces = category.replace(/_/g, " ");
      const retry = await fetchProductsList(buildParams(categoryWithSpaces));
      dispatch({
        type: FIND_PRODUCTS_SUCCESS,
        payload: retry.data,
      });
      return;
    }

    // Retry common category aliases when the primary category returns no products.
    if (content.length === 0 && typeof category === "string" && category.trim()) {
      const key = category.trim().toLowerCase();
      const aliases = categoryAliasMap[key] || [];
      for (const alias of aliases) {
        try {
          const retry = await fetchProductsList(buildParams(alias));
          const retryContent = parseProductList(retry.data);
          if (retryContent.length > 0) {
            dispatch({
              type: FIND_PRODUCTS_SUCCESS,
              payload: retry.data,
            });
            return;
          }
        } catch {
          // Continue trying other aliases.
        }
      }
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
    const { data } = await fetchProductById(productId);
    
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
