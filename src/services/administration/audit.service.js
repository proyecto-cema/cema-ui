import {httpAdministration} from '../http-common'
import authHeader from '../auth/auth-header'

class AuditService {
  getAuditsList (page=0, size=10) {
    return httpAdministration.get('audit/list', { params:{page: page, size: size}, headers: authHeader() })
  }
}

export default new AuditService()
