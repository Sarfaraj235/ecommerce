import {
  ADD_ITEM_TO_CART_FAILURE,
  ADD_ITEM_TO_CART_REQUEST,
  ADD_ITEM_TO_CART_SUCCESS,
  GET_CART_FAILURE,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  REMOVE_CART_ITEM_FAILURE,
  REMOVE_CART_ITEM_REQUEST,
  REMOVE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAILURE,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
} from "./ActionType";

const initialState = {
  cart: null,
  loading: false,
  error: null,
  cartItems: [],
};

const extractCartPayload = (payload) => {
  const root = payload?.data || payload || null;
  const cart =
    root?.cart ||
    root?.result ||
    root?.payload ||
    root || null;

  if (Array.isArray(cart)) {
    return { cart: null, cartItems: cart };
  }

  const cartItems =
    cart?.cartItems ||
    cart?.cartItem ||
    cart?.items ||
    cart?.cart_items ||
    cart?.cart?.cartItems ||
    cart?.cart?.cartItem ||
    cart?.cart?.items ||
    root?.cartItems ||
    root?.cartItem ||
    root?.items ||
    cart?.data?.cartItems ||
    cart?.data?.items ||
    [];

  return {
    cart,
    cartItems: Array.isArray(cartItems) ? cartItems : [],
  };
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM_TO_CART_REQUEST:
    case GET_CART_REQUEST:
    case REMOVE_CART_ITEM_REQUEST:
    case UPDATE_CART_ITEM_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_ITEM_TO_CART_SUCCESS:
      if (action.payload && typeof action.payload === "object") {
        const parsed = extractCartPayload(action.payload);
        return {
          ...state,
          loading: false,
          error: null,
          cart: parsed.cart ?? state.cart,
          cartItems: parsed.cartItems,
        };
      }
      return {
        ...state,
        loading: false,
        error: null,
        cartItems: state.cartItems,
      };

    case GET_CART_SUCCESS:
      {
      const parsed = extractCartPayload(action.payload);
      return {
        ...state,
        loading: false,
        error: null,
        cartItems: parsed.cartItems,
        cart: parsed.cart,
      };
      }

    case REMOVE_CART_ITEM_SUCCESS:
      if (action.payload && typeof action.payload === "object") {
        const parsed = extractCartPayload(action.payload);
        return {
          ...state,
          loading: false,
          error: null,
          cart: parsed.cart ?? state.cart,
          cartItems: parsed.cartItems,
        };
      }
      return {
        ...state,
        loading: false,
        error: null,
        cartItems: state.cartItems.filter(
          (item) =>
            item.id !== action.payload &&
            item._id !== action.payload &&
            item.cartItemId !== action.payload
        ),
      };

    case UPDATE_CART_ITEM_SUCCESS:
      if (action.payload && typeof action.payload === "object") {
        const parsed = extractCartPayload(action.payload);
        if (parsed.cartItems.length > 0) {
          return {
            ...state,
            loading: false,
            error: null,
            cart: parsed.cart ?? state.cart,
            cartItems: parsed.cartItems,
          };
        }
        return {
          ...state,
          loading: false,
          error: null,
          cart: parsed.cart ?? state.cart,
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload?.id ||
            item._id === action.payload?._id ||
            item.cartItemId === action.payload?.cartItemId
              ? action.payload
              : item
          ),
        };
      }
      return {
        ...state,
        loading: false,
        error: null,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload?.id ||
          item._id === action.payload?._id ||
          item.cartItemId === action.payload?.cartItemId
            ? action.payload
            : item
        ),
      };

    case ADD_ITEM_TO_CART_FAILURE:
    case GET_CART_FAILURE:
    case REMOVE_CART_ITEM_FAILURE:
    case UPDATE_CART_ITEM_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
