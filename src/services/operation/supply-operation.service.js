import {httpOperation} from '../http-common'
import authHeader from '../auth/auth-header'


class SupplyOperationService {
    setSupplyOperation (supplyOperation, edit) {
        if (edit) {
            return httpOperation.put('supply-operations/' + supplyOperation.id , supplyOperation, { params:{cuig: supplyOperation.establishmentCuig}, headers: authHeader() })
        } else {
            return httpOperation.post('supply-operations/', supplyOperation,{ headers: authHeader() })
        }
    }

    getSupplyOperation (id, cuig) {
        return httpOperation.get('supply-operations/'+ id, { params:{cuig: cuig}, headers: authHeader() })
    }
    getSupplyOperationAvailable (supplyName, cuig) {
        return httpOperation.get('supply-operations/available/'+ supplyName, { params:{cuig: cuig}, headers: authHeader() })
    }

    listSupplyOperation (page=0,size=10) {
        return httpOperation.get('supply-operations/list', { params:{page: page, size: size}, headers: authHeader() })
    }
}

export default new SupplyOperationService()

