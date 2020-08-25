import {
    LOADER_SHOW,
    LOADER_HIDE,
    OTP_ERROR,
    OTP_SUCCESS,
    OTP_VERIFY_SUCCESS,
    OTP_VERIFY_ERROR,
    PROFILE_CREATE_ERROR,
    PROFILE_CREATE_SUCCESS,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    SKIP_TO_EXPLORE,
    LOGOUT_SUCCESS,
    EXIT_TO_EXPLORE,
    UPDATE_USER,
    UPDATE_CART,
    UPDATE_DEFAULT_SELLER,
    DEFAULT_ADDRESS,
    UPDATE_DEFAULT_LATLONG
} from '../actionTypes';


const INITIAL_STATE = {
    user: null,
    error: '',
    loading: false,
    isAuth: false,
    isGaust: false,
    cartProduct: {},
    seller: {},
    defaultAddress: {},
    latLong: {}
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADER_SHOW:
            return { ...state, loading: true, error: '' };
        case LOADER_HIDE:
            return { ...state, loading: false };
        case OTP_ERROR:
            return { ...state, error: action.payload };
        case OTP_SUCCESS:
            return { ...state, error: '' };
        case OTP_VERIFY_ERROR:
            return { ...state, error: action.payload };
        case OTP_VERIFY_SUCCESS:
            return { ...state, error: '' };
        case PROFILE_CREATE_SUCCESS:
            return { ...state, error: '' };
        case PROFILE_CREATE_ERROR:
            return { ...state, error: action.payload };
        case LOGIN_ERROR:
            return { ...state, error: action.payload };
        case LOGIN_SUCCESS:
            return { ...state, isAuth: true, user: action.payload };
        case UPDATE_USER:
            return { ...state, user: action.payload };
        case SKIP_TO_EXPLORE:
            return { ...state, isGaust: true };
        case EXIT_TO_EXPLORE:
            return {
                ...state,
                user: null,
                error: '',
                loading: false,
                isAuth: false,
                isGaust: false,
            };
        case LOGOUT_SUCCESS:
            return INITIAL_STATE;
        case UPDATE_CART:
            return { ...state, cartProduct: action.payload }
        case UPDATE_DEFAULT_SELLER:
            return { ...state, seller: action.payload }
        case DEFAULT_ADDRESS:
            return { ...state, defaultAddress: action.payload }
        case UPDATE_DEFAULT_LATLONG:
            return { ...state, latLong: action.payload }
        default:
            return state;
    }
};