import axios from 'axios';
import {BASE_URL, LOGIN_CONTEXT, LOGIN_VERSION} from "../../constants";
import UserService from "../users/user.service";
import authHeader from "./auth-header";


class AuthService {
    login(user) {
        return axios
            .post(BASE_URL + LOGIN_CONTEXT + LOGIN_VERSION +"authenticate", {
                username: user.username,
                password: user.password
            })
            .then(response => {
                let allData = null;
                if (response.data.token) {
                    allData = axios.post(BASE_URL + LOGIN_CONTEXT + LOGIN_VERSION + 'users', {},{ headers: { Authorization: 'Bearer ' + response.data.token } }).then(
                        (userResponse) => {
                            allData = {...userResponse.data, ...response.data};
                            localStorage.setItem('user', JSON.stringify(allData));
                            return allData;
                        }
                    );

                }
                console.log(allData)
                return allData !== null ? allData : response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

}

export default new AuthService();