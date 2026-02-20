import axios from "axios";
import { API_BASE_URL, isValidJwt } from "../config/ApiConfig"; 
import { CLEAR_AUTH_ERROR, LOGOUT, REGISTER_FAILURE, REGISTER_REQUEST, REGISTER_SUCCESS } from "./ActionType";
import { LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS } from "./ActionType";
import { GET_USER_FAILURE, GET_USER_REQUEST, GET_USER_SUCCESS } from "./ActionType";

const extractToken = (payload) =>
    payload?.jwt ||
    payload?.token ||
    payload?.accessToken ||
    payload?.access_token ||
    payload?.data?.jwt ||
    payload?.data?.token ||
    payload?.data?.accessToken ||
    payload?.data?.access_token ||
    null;

const hasIdentityFields = (obj) =>
    Boolean(
        obj &&
        typeof obj === "object" &&
        (
            obj.firstName ||
            obj.firstname ||
            obj.first_name ||
            obj.lastName ||
            obj.lastname ||
            obj.last_name ||
            obj.name ||
            obj.fullName ||
            obj.full_name ||
            obj.email ||
            obj.id ||
            obj._id
        )
    );

const extractUser = (payload) => {
    const candidates = [
        payload?.user,
        payload?.data?.user,
        payload?.profile,
        payload?.data?.profile,
        payload
    ];
    return candidates.find((candidate) => hasIdentityFields(candidate)) || null;
};

// --- REGISTER ---
const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload: user });
const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });

export const register = (userData) => async (dispatch) => {
    dispatch(registerRequest());
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
        const payload = response.data;
        const jwt = extractToken(payload);
        const user = extractUser(payload);
        if (isValidJwt(jwt)) localStorage.setItem("jwt", jwt);
        else localStorage.removeItem("jwt");
        dispatch(registerSuccess({ jwt, user }));
    } catch (error) {
        const errMsg = error.response?.data?.message || error.message;
        dispatch(registerFailure(errMsg));
    }
};

// --- LOGIN ---
const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

export const login = (userData) => async (dispatch) => {
    dispatch(loginRequest());
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, userData);
        const payload = response.data;
        const jwt = extractToken(payload);
        const user = extractUser(payload);
        if (isValidJwt(jwt)) localStorage.setItem("jwt", jwt);
        else localStorage.removeItem("jwt");
        dispatch(loginSuccess({ jwt, user }));
    } catch (error) {
        const errMsg = error.response?.data?.message || error.message;
        dispatch(loginFailure(errMsg));
    }
};

// --- GET USER ---
const getUserRequest = () => ({ type: GET_USER_REQUEST });
const getUserSuccess = (user) => ({ type: GET_USER_SUCCESS, payload: user });
const getUserFailure = (error) => ({ type: GET_USER_FAILURE, payload: error });

export const getUser = () => async (dispatch) => {
    dispatch(getUserRequest());
    const token = localStorage.getItem("jwt");
    if (!isValidJwt(token)) {
        localStorage.removeItem("jwt");
        return dispatch(getUserFailure("Invalid token"));
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const user = extractUser(response.data);
        dispatch(getUserSuccess(user));
    } catch (error) {
        const errMsg = error.response?.data?.message || error.message;
        dispatch(getUserFailure(errMsg));
    }
};

// --- LOGOUT ---
export const logout = () => (dispatch) => {
    localStorage.removeItem("jwt");
    dispatch({ type: LOGOUT, payload: null });
};

export const clearAuthError = () => (dispatch) => {
    dispatch({ type: CLEAR_AUTH_ERROR });
};




