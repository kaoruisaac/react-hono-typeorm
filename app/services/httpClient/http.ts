import axios from "./axios";
import * as auth from "./api/auth";

class Http {
    axios = axios;
    auth = auth;
}

const http = new Http();

export default http;
