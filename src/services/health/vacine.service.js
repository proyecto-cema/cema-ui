import { httpActivity } from '../http-common'
import authHeader from '../auth/auth-header'

class VaccinationService {
  getVaccination (id) {
    return httpActivity.get('inoculations/' + id, { headers: authHeader() })
  }

  setVaccination (vaccination, edit) {
    if (edit) {
      return httpActivity.put('inoculations/' + id, vaccination,{params:{cuig: vaccination.establishmentCuig}, headers: authHeader() })
    } else {
      return httpActivity.post('inoculations/', vaccination, {params:{cuig: vaccination.establishmentCuig}, headers: authHeader() })
    }
  }

  deleteVaccination (cuig) {
    return httpActivity.delete('inoculations/' + cuig, { headers: authHeader() })
  }
  
  
}

export default new VaccinationService()
