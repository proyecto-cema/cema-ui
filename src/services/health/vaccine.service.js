import { httpActivity } from '../http-common'
import authHeader from '../auth/auth-header'

class VaccinationService {
  getVaccination (id) {
    return httpActivity.get('inoculations/' + id, { headers: authHeader() })
  }

  setVaccination (vaccine, edit) {
    if (edit) {
      return httpActivity.put('inoculations/' + vaccine.id, vaccine,{params:{cuig: vaccine.establishmentCuig}, headers: authHeader() })
    } else {
      return httpActivity.post('inoculations/', vaccine, {params:{cuig: vaccine.establishmentCuig}, headers: authHeader() })
    }
  }

  deleteVaccination (id) {
    return httpActivity.delete('inoculations/' + id, { headers: authHeader() })
  }
  
  
}

export default new VaccinationService()
