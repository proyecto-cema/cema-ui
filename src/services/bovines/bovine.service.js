import { httpBovines } from '../http-common'
import authHeader from '../auth/auth-header'

class BovineService {
  getBovineByTag (tag) {
    return httpBovines.get('bovines/' + tag, { headers: authHeader() })
  }

  setBovine (bovine, edit) {
    if (edit) {
      return httpBovines.put('bovines/' + bovine.tag, bovine, { headers: authHeader() })
    } else {
      return httpBovines.post('bovines/', bovine, { headers: authHeader() })
    }
  }

  deleteBovine (tag) {
    return httpBovines.delete('bovines/' + tag, { headers: authHeader() })
  }
}

export default new BovineService()
