import axios from "../axios";

const url = "/auth";

const login = (email: string, password: string) => {
    return axios.post(`${url}/panel/login`, { email, password });
}

export { login };