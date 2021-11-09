import { httpUsers } from '../http-common'
import authHeader from '../auth/auth-header'

class UserService {
  getUserData () {
    return httpUsers.post('users', {}, { headers: authHeader() })
  }
  getOwnerList (role) {
    return httpUsers.get('users/list/'+role, { headers: authHeader() })
  }
  getUserByUserName (userName) {
    return httpUsers.get('users/'+userName, { params: {username:userName} , headers: authHeader() })
  }
  setUser (user,password) {
    return httpUsers.post('users/register', user, { params: {password:password} , headers: authHeader() })
  }
  getUsersList (role) {
    return httpUsers.get('users/list/'+role, { headers: authHeader() })
  }
  deleteUser (userName) {
    return httpUsers.delete('users/' + userName, { headers: authHeader() })
  }
}

export default new UserService()
