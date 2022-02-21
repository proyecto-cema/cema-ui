import {httpAdministration} from '../http-common'
import authHeader from '../auth/auth-header'

class EstablishmentService {
  getEstablishmentByCuig (cuig) {
    return httpAdministration.get('establishment/' + cuig, { headers: authHeader() })
  }

  setEstablishment (establishment, edit) {
    if (edit) {
      return httpAdministration.put('establishment/' + establishment.cuig, establishment, { headers: authHeader() })
    } else {
      return httpAdministration.post('establishment/', establishment, { headers: authHeader() })
    }
  }

  deleteEstablishment (cuig) {
    return httpAdministration.delete('establishment/' + cuig, { headers: authHeader() })
  }

  getEstablishmentList () {
    return httpAdministration.get('establishment/list', { headers: authHeader() })
  }

  getSubscriptionsList (cuig, page=0, size=10) {
    return httpAdministration.get(`establishment/${cuig}/subscriptions`, {
      params:{ page: page, size: size }, headers: authHeader()
    })
  }

  validateSubscription(){
    return httpAdministration.get(`establishment/validate/${cuig}`, { headers: authHeader() })
  }
}

export default new EstablishmentService()
