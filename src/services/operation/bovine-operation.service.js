import {httpOperation} from '../http-common'
import authHeader from '../auth/auth-header'


class BovineOperationService {
    setOperation (operation, edit) {
        if (edit) {
            return httpOperation.put('bovine-operations/' + operation.id , operation, { params:{cuig: operation.establishmentCuig}, headers: authHeader() })
        } else {
            return httpOperation.post('bovine-operations/', operation,{ headers: authHeader() })
        }
    }

    getOperation (operation, cuig) {
        return httpOperation.get('bovine-operations/'+ operation.name, { params:{cuig: cuig}, headers: authHeader() })
    }

    deleteOperation (operation, cuig) {
        return httpOperation.delete('bovine-operations/'+ operation.name, { params:{cuig: cuig}, headers: authHeader() })
    }

    listOperation (page=0,size=10) {
        return httpOperation.get('bovine-operations/list', { params:{page: page, size: size}, headers: authHeader() })
    }
}

export default new BovineOperationService()

