import axios from 'axios';
import {BASE_URL, LOGIN_CONTEXT, LOGIN_VERSION} from "../constants";
import UserService from "./user.service";


class AuthService {
    login(user) {
        return axios
            .post(BASE_URL + LOGIN_CONTEXT + LOGIN_VERSION +"authenticate", {
                username: user.username,
                password: user.password
            })
            .then(response => {
                console.log(response.data)
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    UserService.getUserData().then(
                        (userResponse) => {
                            localStorage.setItem('user', JSON.stringify({...userResponse.data, ...response.data}));
                        }
                    );

                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

}

export default new AuthService();