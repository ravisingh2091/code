import { Platform } from "react-native";
import axios from "axios";
import moment from "moment";
import store from "../utils/store";
import DeviceInfo from "react-native-device-info";

let API_BASE_URL = "http://13.229.158.9:3000";

let API_BASE_URL_SOCKET="http://13.229.158.9:4000";
if (!__DEV__) {
API_BASE_URL = "http://13.229.158.9:3000";
}


let NEW_API_BASE_URL = "http://13.229.158.9:3000";
let CASHFREE_APP_ID = "4266316b86143383be42108a6624";
let CASHFREE_URL =
  "https://s3.ap-south-1.amazonaws.com/binbillpaymentgateway-prod/index.html";

export { API_BASE_URL, CASHFREE_APP_ID, CASHFREE_URL,API_BASE_URL_SOCKET };

const APP_VERSION_FOR_API = 201032;

const platform = Platform.OS

const CancelToken = axios.CancelToken;
const apiRequest = async ({
  newurl,
  token,
  method,
  url,
  queryParams={},
  data = null,
  headers = {},
  onUploadProgress,
  onDownloadProgress,
  responseType = "json",
  timeout,
  requestType,
}) => {
 //debugger
  try {
    console.log(store.getState().localStates.loginuserToken)
    const token = store.getState().localStates.loginuserToken;
    console.log(token)
    
    if (typeof token == "string" ) {
      headers.Authorization = token;
    }

    // const language = store.getState().ui.language;
    // if (language) {
    //   headers.language = language.code;
    // }

    if (Platform.OS == "ios") {
      headers.ios_app_version = APP_VERSION_FOR_API; //DeviceInfo.getBuildNumber();
    } else {
      headers["app-version"] = APP_VERSION_FOR_API; //android app version
    }
    // headers['Content-Type']='application/x-www-form-urlencoded'
    if(data){
        data.deviceType=platform
        data.systemVersion = DeviceInfo.getSystemVersion();
        data.buildNumber = DeviceInfo.getBuildNumber();
    }else{
        //let custome={}
        queryParams.deviceType=platform
        queryParams.systemVersion = DeviceInfo.getSystemVersion();
        queryParams.buildNumber = DeviceInfo.getBuildNumber();
        //data=custome

    }
    
    if (__DEV__) {
      var apiRequestTime = moment();
      console.log(
        "API Request: ", method, API_BASE_URL + url,
        "\nheaders: ", headers,
        "\ndata:\n", data,
        "\nqueryParams: ", queryParams
      );
    }


    
  ////////////axios ///////////////
    const r = await axios.request({
      baseURL: API_BASE_URL, method, url,
      params: queryParams, data, headers,
      onUploadProgress,
      onDownloadProgress,
      timeout: timeout || 300000, //300 seconds
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
       // cancel = c;
      })
    });
  ////////////////////////////fetch library ///////////////////

    if (__DEV__) {
      console.log("API Response for ",method,  (newurl=='yes'?NEW_API_BASE_URL:API_BASE_URL) + url,
        " API call took : ", moment().diff(apiRequestTime),
        "milliseconds \n", r.data);
    }

  

    return r.data;
  } catch (e) {
    if (__DEV__) {
      console.log("API exception for ",method,  API_BASE_URL + url,
        " API call took : ", moment().diff(apiRequestTime),
        "milliseconds \n", e,e.statusCode,e.response.status);
    }
    let error = {
        message: e.originalMessage || "Something went wrong, please try again!"
    }
     
   /// );

    error.statusCode = e.response.status || 0;

    if (error.statusCode == 0) {
      error.message = "Please check internet connection";
    }

    if (e.response) {
      if (__DEV__) {
        console.log("e.response.data: ", e.response.data);
      }
      error.statusCode = e.response.status;
      error.data = e.response.data;
      error.message= e.response.data.message
      error.data.statusCode=error.statusCode
    }
    if (error.statusCode == 0) {
        error.data.message = "Please check internet connection";
      }

   

    if (error.statusCode == 409) {
      
      

    }
    if (error.statusCode == 404) {
      
  

    store.dispatch(
          actions.setLoggedInUserStatus(null)
        );
        store.dispatch(
          actions.setLoggedInUserType(null)
        );
      
      return error.data;

    }
    console.log(error)
   return error.data;
  }
};




export const demoCall = async ({mcid,seller_id,offer_only}) => {
  
  return await apiRequest({
    token:'no',
    method: "post",
    url: `/main/${mcid}/categories`,
    queryParams:{
      seller_id:seller_id,
      has_offers:offer_only
    }
  });
};


export const signup = async (reqData) => {
    
    return await apiRequest({
      token:'no',
      method: "post",
      url: `/register`,
      data:reqData
    });
  };

  export const verifyOtp = async (reqData) => {
    
    return await apiRequest({
      token:'no',
      method: "post",
      url: `/otp/verify`,
      data:reqData
    });
  };


  export const resendOtp = async (reqData) => {
    
    return await apiRequest({
      token:'no',
      method: "post",
      url: `/otp/resend`,
      data:reqData
    });
  };

  export const sendOtp = async (reqData) => {
    
    return await apiRequest({
      token:'no',
      method: "post",
      url: `/child/otp/send`,
      data:reqData
    });
  };

  export const resendEmail = async (reqData) => {
    
    return await apiRequest({
      token:'no',
      method: "post",
      url: `/email/resend`,
      data:reqData
    });
  };
  export const login = async (reqData) => {
    
    return await apiRequest({
      token:'no',
      method: "post",
      url: `/login`,
      data:reqData
    });
  };


  export const forgetPassword = async ({email}) => {
    
    return await apiRequest({
      token:'no',
      method: "post",
      url: `/forgetPassword`,
      data:{email}
    });
  };
  export const updateuser = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/user/updateUser`,
      data:reqData
    });
  };


  export const getCards = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/card`,
    });
  };

  export const addChild = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/child/add`,
      data:reqData
    });
  };

  export const emailVerifyChild = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/child/verify/otp`,
      data:reqData
    });
  };

  export const emailResendChild = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/child/otp/resend`,
      data:reqData
    });
  };

  export const getChildList = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/user/child/info`,
    });
  };


  export const updateChildLimit = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/user/child/spend-limit`,
      data:reqData
    });
  };


  export const updateChildAllow = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/user/child/allowance-set`,
      data:reqData
    });
  };

  export const saveCardDetils = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/user/stripeToken/save`,
      data:reqData
    });
  };

  export const initialTopUp = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/wallet/topup`,
      data:reqData
    });
  };

  export const getUserDetails = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/user/detail`
    });
  };

  export const createTask = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/user/task/add`,
      data:reqData
    });
  };

  export const getCategoryList = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/user/category`
    });
  };


  export const getTaskList = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/user/task/list`
    });
  };


  export const getTaskListChild = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/child/task/list`
    });
  };


  export const acceptTask = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/user/task/accept`,
      data:reqData
    });
  };


  export const getUnreadTaskList = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/user/task/unread`
    });
  };


  export const getTaskDetails = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/user/task/${id}`
    });
  };


  export const createEvent = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/event/add`,
      data:reqData
    });
  };


  export const getNotificationList = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/user/notification/list`
    });
  };


  export const readNotification = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "put",
      url: `/user/notification/read`,
      data:reqData
    });
  };



  export const getEventList = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/event/parent/list`
    });
  };


  export const getEventListChild = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/event/child/list`
    });
  };


  export const acceptEvent= async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/event/accept`,
      data:reqData
    });
  };


  export const createBadge = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/user/badge/add`,
      data:reqData
    });
  };


  export const getBadgeList = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `user/badge/list`
    });
  };

  export const createSavingPlanForChild = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/saving/add`,
      data:reqData
    });
  };


  export const getBadgesDetails = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/user/badge/${id}`
    });
  };


  export const activateCard = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/active-card`,
      data:reqData
    });
  };


  export const reactiveCard = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/reactive-card`,
      data:reqData
    });
  };

  export const lockCard = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/lock-card`,
      data:reqData
    });
  };


  export const getAnyUserDetails = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/user/detail`,
      queryParams:reqData
    });
  };


  export const childCardTopup = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/child/card/topup`,
      data:reqData
    });
  };

  export const childUpdate = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "put",
      url: `/child/update`,
      data:reqData
    });
  };


  export const updateTask = async (reqData,id) => {
    
    return await apiRequest({
      token:'yes',
      method: "put",
      url: `/user/task/${id}`,
      data:reqData
    });
  };



  export const getBadgeListChild = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/child/badge/list`
    });
  };


  export const updateBadge = async (reqData,id) => {
    
    return await apiRequest({
      token:'yes',
      method: "put",
      url: `/user/badge/${id}`,
      data:reqData
    });
  };


  export const getAcchivement = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/child/badge/achievements`
    });
  };


  export const getAccountHistory = async (page, child) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/child/card/transaction/history?page=${page}&childId=${child}`
    });
  };

  export const getCardList = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/stripe/card/list`,
    });
  };

  export const getTransactionChildsideHistory = async (page) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/child-side/transaction/history?page=${page}`
    });
  };

  export const getTransactionHistory = async (page) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `child/card/transaction/history?page=${page}`
    });
  };
  export const getTransactionHistoryAccount = async (page) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/stripe/transaction/history`
    });
  };


  export const getSavingList = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/saving/list`
    });
  };


  export const taskRewardAndComplte = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/task/reward/send`,
      data:reqData
    });
  };


  export const badgeRewardAndComplte = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/badge/reward/send`,
      data:reqData
    });
  };



  export const parentRecation = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/txtreaction/add`,
      data:reqData
    });
  };

  export const childRecation = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/txtreaction/add/child`,
      data:reqData
    });
  };



  export const getSavingDetails = async (page) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `child/card/transaction/history?page=${page}`
    });
  };


  export const updateSaving = async (reqData,id) => {
    
    return await apiRequest({
      token:'yes',
      method: "put",
      url: `/saving/update/${id}`,
      data:reqData
    });
  };


  export const getShaving = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/saving/detail/${id}`
    });
  };


  export const getTrasactionDetails = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/txtreaction/details/${id}`
    });
  };


  export const getEventDetails = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/event/child/details/${id}`
    });
  };

  export const setUpPaymentMethode = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/user/setup-payment-method`,
      data:reqData
    });
  };


  export const deleteimagepath = async (reqData) => {
    
    return await apiRequest({
      token:'no',
      method: "delete",
      url: `/fileUpload`,
      data:reqData
    });
  };

  export const saveMoneyCardtoPocket = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/saving/transfer-to-saving-category`,
      data:reqData
    });
  };

  export const saveMoneyPockettoCard = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/saving/transfer-to-default-category`,
      data:reqData
    });
  };


  export const getChildDashBoardData = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/child/dashboard`
    });
  };

  export const getChilEarning = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/child/earning`
    });
  };

  export const getChatHistory = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/chat/list`,
      queryParams:reqData
    });
  };



  export const getChatRoomId = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/room/list`,
    });
  };


  export const getSavingListParent = async (page) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/saving/parent/list?page=${page}`
    });
  };


  export const markFavSavingParent = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/saving/favorite/${id}`
    });
  };

  export const getChildEarningPrent = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/child/earning?childId=${id}`
    });
  };


  export const getChildChatList= async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/child/chat/list`
    });
  };


  export const getEducationList= async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/education/list`
    });
  };


  export const educationFavourite = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/education/favorite/${id}`
    });
  };

  export const specilaReward = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/child/task/special`
    });
  };


  export const genrateCvvApi = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/create-cvv`,
      queryParams:reqData
    });
  };

  export const deleteRequestByChild = async () => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/delete-card-request`
    });
  };

  export const deleteByParent = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "delete",
      url: `/delete-card/${id}`
    });
  };



  export const addNeWcard = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/child/new-card-activate`,
      data:reqData
    });
  };



  export const deleteAccountByParent = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "delete",
      url: `/child/${id}`
    });
  };

  export const getNotificationCount = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/notification/count`
    });
  };

  export const geniPINOTP = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/send-ipin-otp`
    });
  };



  export const changeiPIN = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/generate-ipin`,
      data:reqData
    });
  };

  export const getSubscription = async (id) => {
    
    return await apiRequest({
      token:'yes',
      method: "get",
      url: `/stripe/subscription`
    });
  };

  export const postSubscription = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "post",
      url: `/stripe/subscription`,
      data:reqData
    });
  };

  export const changeSubscription = async (reqData) => {
    
    return await apiRequest({
      token:'yes',
      method: "put",
      url: `/stripe/subscription`,
      data:reqData
    });
  };

  export const logOut = async () => {
    
    return await apiRequest({
      token:'no',
      method: "get",
      url: `/logout`,
    });
  };