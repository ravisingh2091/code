import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4000'
});
instance.interceptors.request.use(
    config => {
        config.headers.Authorization = localStorage.getItem("token");
        return config;
    }
)
instance.interceptors.response.use((response) => {
    return response
}, error => {
    if (401 === error.response.status) {
        localStorage.clear()
        window.location.assign("/");
        // return Promise.reject(error)
    } else {
        return Promise.reject(error)
    }
})
export default instance;