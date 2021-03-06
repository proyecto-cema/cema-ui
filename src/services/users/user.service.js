import { httpUsers } from '../http-common'
import authHeader from '../auth/auth-header'

class UserService {
  getUserData () {
    return httpUsers.post('users', {}, { headers: authHeader() })
  }
  changeUserData (userName, user) {
    return httpUsers.put('users/' + encodeURIComponent(userName),
      user,{ params: {username: userName} , headers: authHeader() }
    )
  }
  getOwnerList (role) {
    return httpUsers.get('users/list/' + role, { headers: authHeader() })
  }
  getUserByUserName (userName) {
    return httpUsers.get('users/' + encodeURIComponent(userName),
        { params: {username: userName} , headers: authHeader() }
    )
  }
  setUser (user, password) {
    return httpUsers.post('users/register', user, { params: {password: password} , headers: authHeader() })
  }
  getUsersList (role) {
    return httpUsers.get('users/list/' + role, { headers: authHeader() })
  }
  deleteUser (userName) {
    return httpUsers.delete('users/' + encodeURIComponent(userName), { headers: authHeader() })
  }
}

export default new UserService()
