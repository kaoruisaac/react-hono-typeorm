import Axios from "axios";
import i18next from "i18next";

const axios = Axios.create({
    baseURL: '/api',
    headers: {
        language: i18next.language,
    },
});

axios.interceptors.response.use(res  => res, err => Promise.reject(err?.response?.data));

export default axios;