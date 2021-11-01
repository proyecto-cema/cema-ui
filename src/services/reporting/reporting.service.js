import { httpReporting } from '../http-common'
import authHeader from '../auth/auth-header'

class ReportingService {
    getReport (report_name, yearsFrom, yearsTo) {
        return httpReporting.get('reporting/' + report_name, {
            params:{yearsFrom: yearsFrom, yearsTo: yearsTo},  headers: authHeader()
        })
    }
}

export default new ReportingService()
