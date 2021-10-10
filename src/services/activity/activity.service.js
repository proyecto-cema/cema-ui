import { httpActivity } from '../http-common'
import authHeader from '../auth/auth-header'

class ActivityService {
    getActivity(id, activity_url) {
        return httpActivity.get(activity_url + '/' + id, { headers: authHeader() })
    }

    setActivity(activity, edit, activity_url) {
        if (edit) {
            return httpActivity.put(activity_url + '/' + activity.id, activity,{params:{cuig: activity.establishmentCuig}, headers: authHeader() })
        } else {
            return httpActivity.post(activity_url + '/', activity, {params:{cuig: activity.establishmentCuig}, headers: authHeader() })
        }
    }

    deleteActivity(id, activity_url) {
        return httpActivity.delete(activity_url + '/' + id, { headers: authHeader() })
    }

}

export default new ActivityService()
