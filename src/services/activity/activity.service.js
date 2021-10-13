import { httpActivity } from '../http-common'
import authHeader from '../auth/auth-header'

class ActivityService {
    setActivity(activity, edit, activity_url) {
        if (edit) {
            return httpActivity.put(activity_url + '/' + activity.id, activity,{params:{cuig: activity.establishmentCuig}, headers: authHeader() })
        } else {
            return httpActivity.post(activity_url + '/', activity, {params:{cuig: activity.establishmentCuig}, headers: authHeader() })
        }
    }

    deleteActivity(id, cuig, activity_url) {
        return httpActivity.delete(activity_url + '/' + id, {params:{cuig: cuig}, headers: authHeader() })
    }

}

export default new ActivityService()
