import {httpEconomic,httpOperation} from '../http-common'
import authHeader from '../auth/auth-header'


class SupplyService {
    setSupply (supply, edit) {
        if (edit) {
            return httpOperation.put('supply/' + encodeURIComponent(supply.previousName), supply,
                { params:{cuig: supply.establishmentCuig}, headers: authHeader() }
            )
        } else {
            return httpOperation.post('supply/', supply,{headers: authHeader()})
        }
    }

    getSupply (supply, cuig) {
        return httpOperation.get('supply/'+ encodeURIComponent(supply.name),
            { params:{cuig: cuig}, headers: authHeader() }
        )
    }

    deleteSupply (supply, cuig) {
        return httpOperation.delete('supply/'+ encodeURIComponent(supply.name),
            { params:{cuig: cuig}, headers: authHeader() }
        )
    }

    getSuppliesList (page=0, size=10) {
        return httpEconomic.get('supply/list', { params:{page: page, size: size}, headers: authHeader() })
    }

    getCategoriesList () {
        return httpEconomic.get('category/list', { params:{page: 0, size: 100}, headers: authHeader() })
    }
}

export default new SupplyService()

