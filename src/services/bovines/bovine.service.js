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

  addBovineToBatch (batch,ListBovine) {
    return httpBovines.get('batches/'+batch+'/add', {params:ListBovine, headers: authHeader() })
  }

  deleteBovineToBatches (batch,ListBovine) {
    return httpBovines.get('batches/'+batch+'/remove', {params:ListBovine, headers: authHeader() })
  }
  sabeBatch (batchName,ListBovine,batchDescrip,establishmentCuig) {
    return httpBovines.get('batches', {params:{batchName: batchName , bovineTags: ListBovine,description:batchDescrip, establishmentCuig:establishmentCuig }, headers: authHeader() })
  }
}

export default new BovineService()
