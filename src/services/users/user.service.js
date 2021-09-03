import { httpUsers } from '../http-common'
import authHeader from '../auth/auth-header'

class UserService {
  getUserData () {
    return httpUsers.post('users', {}, { headers: authHeader() })
  }
  getOwnerList (role) {
    return httpUsers.get('users/list/'+role, { headers: authHeader() })
  }
}

export default new UserService()
