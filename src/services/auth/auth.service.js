import {httpUsers} from "../http-common";


class AuthService {
    login(user) {
        return httpUsers.post("authenticate", {
                username: user.username,
                password: user.password
            })
            .then(response => {
                let allData = null;
                if (response.data.token) {
                    allData = httpUsers.post('users', {},{ headers: { Authorization: 'Bearer ' + response.data.token } }).then(
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