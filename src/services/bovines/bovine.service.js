import { httpBovines } from '../http-common'
import authHeader from '../auth/auth-header'

class BovineService {
  getBovineByTag (tag) {
    return httpBovines.get('bovines/' + tag, { headers: authHeader() })
  }

  setBovine (bovine, edit) {
    if (edit) {
      return httpBovines.put('bovines/' + bovine.tag, bovine, {params:{cuig: bovine.establishmentCuig}, headers: authHeader() })
    } else {
      return httpBovines.post('bovines/', bovine, { headers: authHeader() })
    }
  }

  deleteBovine (tag, cuig) {
    return httpBovines.delete('bovines/' + tag, { params:{cuig: cuig}, headers: authHeader() })
  }

  getBovineList (page=0, size=10, searchParams={tag:null, genre:null, taggingDate:null}) {
    return httpBovines.get('bovines/search', { params:{page:page, size:size, ...searchParams}, headers: authHeader() })
  }

  getBatchesList () {
    return httpBovines.get('batches/list', { headers: authHeader() })
  }

  addBovineToBatch (batchName,ListBovine,cuig) {
    return httpBovines.post('batches/'+batchName+'/add',ListBovine, {params:{cuig:cuig}, headers: authHeader() })
  }

  deleteBovineToBatches (batchName,ListBovine,cuig) {
    return httpBovines.post('batches/'+batchName+'/remove',ListBovine, {params:{cuig:cuig}, headers: authHeader() })
  }
  setBatch (data) {
    return httpBovines.post('batches/',data, { headers: authHeader() })
  }
  
  deleteBatch (name,cuig) {
    return httpBovines.delete('batches/' + name, {params:{cuig:cuig}, headers: authHeader() })
  }
}

export default new BovineService()
