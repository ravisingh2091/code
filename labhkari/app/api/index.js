import axios from "axios";
import store from "../redux";
import { logoutUser } from './../redux/actions/AllAction'

const instance = axios.create({
  baseURL: 'http://15.206.250.185:2025/api/v1/'
})

instance.interceptors.request.use(
  async (request) => {
    console.log("[Request]", { [request.url]: request.data })
    const token = store.getState().auth.user && store.getState().auth.user.jwtToken
    if (token) {
      request.headers.Authorization = token
    }
    return request
  },
  (error) => {
    Promise.reject(error)
  }
)


instance.interceptors.response.use(async (response) => {
  console.log("[Response]", { [response.config.url]: response.data })
  if (response.data.status == 401) {
    const { dispatch } = store;
    dispatch(logoutUser());
    return response
  } else {
    return response
  }
}, error => {
  console.log({ error })
  return Promise.reject(error)
})
export default instance
