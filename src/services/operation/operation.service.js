import {httpOperation} from '../http-common'
import authHeader from '../auth/auth-header'


class OperationService {
    setOperation (operation, edit) {
        if (edit) {
            return httpOperation.put('operation/' + operation.id , operation, { headers: authHeader() })
        } else {
            return httpOperation.post('operation/', operation,{headers: authHeader()
            })
        }
    }

    getOperation (operation, cuig) {
        return httpOperation.get('operation/'+ operation.name, { params:{cuig: cuig}, headers: authHeader() })
    }

    deleteOperation (operation, cuig) {
        return httpOperation.delete('operation/'+ operation.name, { params:{cuig: cuig}, headers: authHeader() })
    }

    listOperation (page=0,size=10) {
        return httpOperation.get('operation/list', { params:{page: page, size: size}, headers: authHeader() })
    }
}

export default new OperationService()

