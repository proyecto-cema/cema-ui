import axios from 'axios';
import authHeader from './auth-header';
import {BASE_URL, LOGIN_CONTEXT, LOGIN_VERSION} from "../constants";


class UserService {
    getUserData() {
        return axios.post(BASE_URL + LOGIN_CONTEXT + LOGIN_VERSION + 'users', {},{ headers: authHeader() });
    }
}

export default new UserService();