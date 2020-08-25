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
    LOGOUT_SUCCESS,
    SKIP_TO_EXPLORE,
    EXIT_TO_EXPLORE,
    UPDATE_USER,
    UPDATE_CART,
    UPDATE_DEFAULT_SELLER,
    DEFAULT_ADDRESS,
    UPDATE_DEFAULT_LATLONG
} from '../actionTypes';

import store from '../index'

import axios from '../../api/'
import { navigate } from '../../utils/navigationRef'


// check Phone no and send otp
export const checkAndSendOtp = (countryCode, mobileNumber, referalCode) => {
    return async dispatch => {
        try {
            dispatch({ type: LOADER_SHOW })
            let response = await axios.post('/user/checkUserMobileNumber', {
                countryCode, mobileNumber, referalCode
            });

            dispatch({ type: LOADER_HIDE })
            if (response && response.data.status == 200) {
                dispatch({ type: OTP_SUCCESS })
                navigate('OtpVerificationScreen', { countryCode, mobileNumber, referalCode })
            } else {
                dispatch({ type: OTP_ERROR, payload: response.data.message })
            }

        } catch (error) {
            dispatch({ type: LOADER_HIDE })
            console.log("API ERROR", { error })
        }
    }
}


export const otpVerify = (otp, params) => {
    return async dispatch => {
        try {
            const { mobileNumber, countryCode } = params
            let response = await axios.post('/user/otpVerification', {
                countryCode, mobileNumber, otp
            })
            dispatch({ type: LOADER_HIDE })
            if (response && response.data.status == 200) {
                dispatch({ type: OTP_VERIFY_SUCCESS })
                navigate('CreateProfileScreen', params)
            } else {
                dispatch({ type: OTP_VERIFY_ERROR, payload: response.data.message })
            }
        } catch (error) {
            dispatch({ type: LOADER_HIDE })
            console.error("API ERROR", { error })
        }
    }
}

export const createProfile = (data) => {
    // console.log(data)
    return async dispatch => {
        try {
            dispatch({ type: LOADER_SHOW })
            let formData = new FormData()
            formData.append('name', data.name)
            formData.append('email', data.email)
            formData.append('address', data.address)
            formData.append('password', data.password)
            formData.append('mobileNumber', data.mobileNumber)
            formData.append('countryCode', data.countryCode)
            formData.append('latitude', data.latitude)
            formData.append('longitude', data.longitude)
            let response = await axios.post('user/userSignup', formData, {
                headers: { 'content-type': 'multipart/form-data' }
            })

            dispatch({ type: LOADER_HIDE })
            if (response && response.data.status == 200) {
                dispatch({ type: PROFILE_CREATE_SUCCESS })
                navigate('LoginScreen')
            } else {
                dispatch({ type: PROFILE_CREATE_ERROR, payload: response.data.message });
            }

        } catch (error) {
            dispatch({ type: LOADER_HIDE })
            console.error("API ERROR", { error })
        }
    };
};
export const loginUser = (data) => {
    return async (dispatch) => {
        try {
            dispatch({ type: LOADER_SHOW })
            let response = await axios.post('user/userLogin', data)
            if (response && response.data.status == 200) {

                dispatch({ type: LOGIN_SUCCESS, payload: response.data.data });
                let cartProduct = store.getState().auth.cartProduct
                if (Object.keys(cartProduct).length) {
                    let productsList = []
                    for (let product in cartProduct) {
                        productsList.push({
                            "productMeasurementId": product,
                            "productId": cartProduct[product].productId,
                            "quantity": cartProduct[product].quantity,
                        })
                    }
                    await axios.post('user/addToCartOffline', { productsList })
                }
            } else {
                dispatch({ type: LOGIN_ERROR, payload: response.data.message });
            }
            dispatch({ type: LOADER_HIDE })

        } catch (error) {
            dispatch({ type: LOADER_HIDE })
            console.log("API ERROR", { error })
        }
    };
};
export const skipToExplore = () => {
    return (dispatch) => {
        dispatch({ type: SKIP_TO_EXPLORE });
    };
};
export const exitToExplore = () => {
    return {
        type: EXIT_TO_EXPLORE
    };
}
export const logoutUser = () => {
    return async (dispatch) => {
        dispatch({ type: LOGOUT_SUCCESS });
        await axios.get('user/userLogout')
    };
};

export const userUpdate = (user) => {
    return {
        type: UPDATE_USER,
        payload: user
    };
}

export const updateCart = (productCart) => {
    return {
        type: UPDATE_CART,
        payload: productCart
    }
}

export const setDefaultSeller = (seller) => {
    return {
        type: UPDATE_DEFAULT_SELLER,
        payload: seller
    }
}
export const setLotLong = (latLong) => {
    return {
        type: UPDATE_DEFAULT_LATLONG,
        payload: latLong
    }
}

export const setDefaultAddress = (address) => {
    return {
        type: DEFAULT_ADDRESS,
        payload: address
    }
}