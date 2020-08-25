import * as types from "./actionTypes";
import defaultState from "./states";

/**
 * Reducer
 */

export default function parentFlowReducer(
    state = defaultState.localStates,
    action
) {
    switch (action.type) {
        case types.LOGGED_IN_USER_SET_AUTH_TOKEN:
            return {
                ...state,
                loginuserToken: action.payload.loginuserToken
            };
        case types.USER_DETAILS:
            return {
                ...state,
                userDetails: action.payload.userDetails
            };
        case types.LOGIN_STATUS:
            return {
                ...state,
                loginStatus: action.payload.loginStatus
            };
        case types.LOGIN_STATUS:
            return {
                ...state,
                loginStatus: action.payload.loginStatus
            };
        case types.USER_TYPE:
            return {
                ...state,
                loginUserType: action.payload.loginUserType
            };

        case types.INTRO_STATUS:
            return {
                ...state,
                introstatus: action.payload.introstatus
            };

        case types.CHILD_CHAT_REQ:
            return {
                ...state,
                childchatreq: action.payload.childchatreq
         };

        case types.PARENT_CHAT_REQ:
                return {
                    ...state,
                    parentchatreq: action.payload.parentchatreq
        };
        default:
            return state;
    }
}

/**
 * Actions
 */
export const actions = {

    setLoggedInUserAuthToken: loginuserToken => {
        return {
            type: types.LOGGED_IN_USER_SET_AUTH_TOKEN,
            payload: { loginuserToken: loginuserToken }
        };
    },
    setLoggedInUserDetails: userDetails => {
        console.log(userDetails)
        return {
            type: types.USER_DETAILS,
            payload: { userDetails: userDetails }
        };
    },
    setLoggedInUserStatus: loginStatus => {
        console.log(loginStatus)
        return {
            type: types.LOGIN_STATUS,
            payload: { loginStatus: loginStatus }
        };
    },
    setLoggedInUserType: loginUserType => {
        console.log(loginUserType)
        return {
            type: types.USER_TYPE,
            payload: { loginUserType: loginUserType }
        };
    },
    setIntroStatsStatus: introstatus => {
        console.log(introstatus)
        return {
            type: types.INTRO_STATUS,
            payload: { introstatus: introstatus }
        };
    },
    setChildChatReq: childchatreq => {
        console.log(childchatreq)
        return {
            type: types.CHILD_CHAT_REQ,
            payload: { childchatreq: childchatreq }
        };
    },
    setParentChatReq: parentchatreq => {
        console.log(parentchatreq)
        return {
            type: types.PARENT_CHAT_REQ,
            payload: { parentchatreq: parentchatreq }
        };
    },
} 