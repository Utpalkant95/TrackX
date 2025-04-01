import axios from "axios";
import { IREQLOGIN, IREQREGISTER, IUPDATEPASSWORD } from "./interfaces/Request";
import { IRES } from "./interfaces/Response";

const API_BASE_URL = "https://trackx-backend.onrender.com/api/v1"

export const Register = async (data : IREQREGISTER) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data, {
        withCredentials : true
    });
    return response.data as IRES;
}

export const Login = async (data : IREQLOGIN) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data, {
        withCredentials : true
    });
    return response.data as IRES;
}

export const Logout = async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/logout`, {
        withCredentials : true
    })
    return response.data as IRES;
}

export const CheckAuth = async () => {
    const response = await axios.get(`${API_BASE_URL}/auth/check-auth`, {
        withCredentials : true
    });
    return response.data;
}

export const UpdatePassword = async (data : IUPDATEPASSWORD) => {
    const response = await axios.put(`${API_BASE_URL}/auth/update-password`, data, {
        withCredentials : true
    });
    return response.data as IRES;
}

export const EraseAccount = async () => {
    const response = await axios.delete(`${API_BASE_URL}/auth/erase-account`, {
        withCredentials : true
    });
    return response.data as IRES;
}