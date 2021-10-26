import { httpReporting } from '../http-common'
import authHeader from '../auth/auth-header'

class ReportingService {
    getReport (report_name, years) {
        return httpReporting.get('reporting/' + report_name, { params:{years: years},  headers: authHeader() })
    }
}

export default new ReportingService()
