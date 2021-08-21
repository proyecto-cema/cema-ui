import axios from 'axios';
import {BASE_URL, LOGIN_CONTEXT, LOGIN_VERSION} from "../constants";


class AuthService {
    login(user) {
        return axios
            .post(BASE_URL + LOGIN_CONTEXT + LOGIN_VERSION +"authenticate", {
                username: user.username,
                password: user.password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

}

export default new AuthService();