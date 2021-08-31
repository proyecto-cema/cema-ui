import {httpUsers} from "../http-common";


class AuthService {
    login(user) {
        return httpUsers.post("authenticate", {
                username: user.username,
                password: user.password
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                console.log(response.data)
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

}

export default new AuthService();