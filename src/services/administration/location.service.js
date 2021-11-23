import {httpActivity} from '../http-common'
import authHeader from '../auth/auth-header'


class LocationService {
    setLocation (location, edit) {
        if (edit) {
            return httpActivity.put('locations/' + location.previousName, location, {
                params:{cuig: location.establishmentCuig}, headers: authHeader()
            })
        } else {
            return httpActivity.post('locations/', location,{headers: authHeader()})
        }
    }

    getLocation (location, cuig) {
        return httpActivity.get('locations/'+ location.name, { params:{cuig: cuig}, headers: authHeader() })
    }

    deleteLocation (location, cuig) {
        return httpActivity.delete('locations/'+ location.name, { params:{cuig: cuig}, headers: authHeader() })
    }

    listLocation (cuig) {
        return httpActivity.get('locations/list', { params:{cuig: cuig}, headers: authHeader() })
    }
}

export default new LocationService()

