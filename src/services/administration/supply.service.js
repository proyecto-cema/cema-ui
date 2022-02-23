import {httpEconomic, httpOperation} from '../http-common'
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

    getSuppliesList (page=0, size=10, supplyData={establishmentCuig:null}) {
        return httpOperation.post('supply/search', supplyData, { params:{page: page, size: size}, headers: authHeader() })
    }

    getCategoriesList () {
        return httpOperation.get('category/list', { params:{page: 0, size: 100}, headers: authHeader() })
    }
}

export default new SupplyService()

