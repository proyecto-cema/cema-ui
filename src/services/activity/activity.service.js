import { httpActivity, httpOperation } from '../http-common';
import authHeader from '../auth/auth-header'

class ActivityService {
    setActivity(activity, edit, activity_url) {
        if (edit) {
            return httpActivity.put(
              activity_url + '/' + activity.id, activity,
              { params:{ cuig: activity.establishmentCuig }, headers: authHeader() }
            )
        } else {
            return httpActivity.post(
              activity_url + '/', activity,
              { params:{ cuig: activity.establishmentCuig }, headers: authHeader() }
            )
        }
    }

    deleteActivity(id, cuig, activity_url) {
        return httpActivity.delete(activity_url + '/' + id, { params: { cuig: cuig }, headers: authHeader() })
    }

    getActivity(id, cuig, activity_url) {
        return httpActivity.get(activity_url + '/' + id, { params: { cuig: cuig },  headers: authHeader() })
    }
    getActivitiesList (name, activity_url, cuig ) {
      return httpActivity.post(
        activity_url +'/search',
        { cuig: cuig, name: name },
        { params:{ size: 1000 },  headers: authHeader() }
      )
    }
    getActivityNotifications(cuig) {
        return httpActivity.post(
          'activities/search',
          { establishmentCuig: cuig },
          { params:{ pastLimit: 0, futureLimit: 7 },  headers: authHeader() }
        )
    }
    getFeedingSupplies(page=0, size=10, search){
        return httpOperation.post(
          'supply/search',
          search,
          { params:{ page: page, size: size }, headers: authHeader() }
        )
    }
}

export default new ActivityService()
