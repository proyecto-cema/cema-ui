import {httpUsers} from "../http-common"
import authHeader from "../auth/auth-header";


class UserService {
    getUserData() {
        return httpUsers.post("users", {}, authHeader())
    }
}

export default new UserService();