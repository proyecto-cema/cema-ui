import {httpHealth} from '../http-common'
import authHeader from '../auth/auth-header'


class DiseaseService {
    setDisease (disease, edit) {
        if (edit) {
            return httpHealth.put('disease/' + disease.name , disease, { params:{cuig: disease.establishmentCuig}, headers: authHeader() })
        } else {
            return httpHealth.post('disease/', disease,{ headers: authHeader() })
        }
    }

    getDisease (disease, cuig) {
        return httpHealth.get('disease/'+ disease.name, { params:{cuig: cuig}, headers: authHeader() })
    }

    deleteDisease (name, cuig) {
        return httpHealth.delete('disease/'+ name, { params:{cuig: cuig}, headers: authHeader() })
    }

    listDisease (page=0,size=10) {
        return httpHealth.get('disease/list', { params:{page: page, size: size}, headers: authHeader() })
    }
}

export default new DiseaseService()

