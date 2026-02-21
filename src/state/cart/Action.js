import { api } from "../config/ApiConfig";
import { 
    ADD_ITEM_TO_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, 
    GET_CART_FAILURE, GET_CART_REQUEST, GET_CART_SUCCESS, 
    REMOVE_CART_ITEM_FAILURE, REMOVE_CART_ITEM_REQUEST, REMOVE_CART_ITEM_SUCCESS, 
    UPDATE_CART_ITEM_FAILURE, UPDATE_CART_ITEM_REQUEST, UPDATE_CART_ITEM_SUCCESS 
} from "./ActionType";

const cartItemPaths = (cartItemId) => [
    `/api/cart_items/${cartItemId}`,
    `/api/cart_item/${cartItemId}`,
    `/api/cart-item/${cartItemId}`,
];

const isNotFoundError = (error) => error?.response?.status === 404;

// Get User's Cart
export const getCart = () => async (dispatch) => {
    dispatch({ type: GET_CART_REQUEST });
    try {
        let response;
        try {
            response = await api.get("/api/cart/");
        } catch {
            response = await api.get("/api/cart");
        }
        const { data } = response;
        dispatch({ type: GET_CART_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_CART_FAILURE, payload: error.response?.data?.message || error.message });
    }
};

// Add Item to Cart
export const addItemToCart = (reqData) => async (dispatch) => {
    dispatch({ type: ADD_ITEM_TO_CART_REQUEST });
    try {
        const { data } = await api.put("/api/cart/add", reqData);
        dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data });
        return data;
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        dispatch({ type: ADD_ITEM_TO_CART_FAILURE, payload: message });
        throw new Error(message);
    }
};

// Remove Item from Cart
export const removeCartItem = (cartItemId) => async (dispatch) => {
    dispatch({ type: REMOVE_CART_ITEM_REQUEST });
    try {
        let response;
        let lastError;

        for (const path of cartItemPaths(cartItemId)) {
            try {
                response = await api.delete(path);
                break;
            } catch (error) {
                lastError = error;
                if (!isNotFoundError(error)) throw error;
            }
        }

        if (!response) throw lastError || new Error("Unable to remove cart item");

        const { data } = response;
        dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: data || cartItemId });
    } catch (error) {
        dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: error.response?.data?.message || error.message });
    }
};

// Update Cart Item (Quantity)
export const updateCartItem = (reqData) => async (dispatch) => {
    dispatch({ type: UPDATE_CART_ITEM_REQUEST });
    try {
        let response;
        let lastError;

        for (const path of cartItemPaths(reqData.cartItemId)) {
            try {
                response = await api.put(path, reqData.data);
                break;
            } catch (error) {
                lastError = error;
                if (!isNotFoundError(error)) throw error;
            }
        }

        if (!response) throw lastError || new Error("Unable to update cart item");

        const { data } = response;
        dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: error.response?.data?.message || error.message });
    }
};
