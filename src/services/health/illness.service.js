import {httpHealth} from '../http-common'
import authHeader from '../auth/auth-header'


class IllnessService {
    setIllness (illness, edit) {
        if (edit) {
            return httpHealth.put('illness/' + illness.id , illness, { params:{cuig: illness.establishmentCuig}, headers: authHeader() })
        } else {
            return httpHealth.post('illness/', illness,{ headers: authHeader() })
        }
    }

    getIllness (id, cuig) {
        return httpHealth.get('illness/'+ id, { params:{cuig: cuig}, headers: authHeader() })
    }

    deleteIllness (id) {
        return httpHealth.delete('illness/'+ id, { headers: authHeader() })
    }

    listIllness (page=0,size=10) {
        return httpHealth.get('illness/list', { params:{page: page, size: size}, headers: authHeader() })
    }
}

export default new IllnessService()

