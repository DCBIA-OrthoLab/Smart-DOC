export default class DcbiaReactService {

  constructor(){
    this.http = {};
  }

  setHttp(http){
    this.http = http;
  }

  getClinicalDataCollections(){
    return this.http({
      method: 'GET',
      url: '/dcbia/clinical/collections'
    });
  }

  getClinicalDataCollection(id){
    return this.http({
      method: 'GET',
      url: '/dcbia/clinical/collection/' + id
    });
  }

  createClinicalDataCollection (data) {
    return this.http({
      method: 'POST',
      url: '/dcbia/clinical/collection',
      data: data
    });
  }

  updateClinicalDataCollection (data) {
    return this.http({
      method: 'PUT',
      url: '/dcbia/clinical/collection',
      data: data
    });
  }

  deleteClinicalDataCollection (id) {
    return this.http({
      method: 'DELETE',
      url: '/dcbia/clinical/collection/' + id
    });
  }

  getAllClinicalData(){
    return this.http({
      method: 'GET',
      url: '/dcbia/clinical/collection/data'
    });
  }

  getClinicalData(id){
    return this.http({
      method: 'GET',
      url: '/dcbia/clinical/collection/data/' + id
    });
  }

  getClinicalDataOwners(){
    return this.http({
      method: 'GET',
      url: '/dcbia/clinical/data/owner'
    });
  }

  getClinicalDataOwner(email){
    return this.http({
      method: 'GET',
      url: '/dcbia/clinical/data/owner?email=' + email
    });
  }

  createClinicalData (data) {
    return this.http({
      method: 'POST',
      url: '/dcbia/clinical/data',
      data: data
    });
  }

  updateClinicalData (data) {
    return this.http({
      method: 'PUT',
      url: '/dcbia/clinical/data',
      data: data
    });
  }

  deleteClinicalData (id) {
    return this.http({
      method: 'DELETE',
      url: '/dcbia/clinical/data/' + id
    });
  }

  getMorphologicalDataCollections(){
    return this.http({
      method: 'GET',
      url: '/dcbia/morphological/collections'
    });
  }

  getMorphologicalDataCollection(id){
    return this.http({
      method: 'GET',
      url: '/dcbia/morphological/collection/' + id
    });
  }

  createMorphologicalDataCollection (data) {
    return this.http({
      method: 'POST',
      url: '/dcbia/morphological/collection',
      data: data
    });
  }

  updateMorphologicalDataCollection (data) {
    return this.http({
      method: 'PUT',
      url: '/dcbia/morphological/collection',
      data: data
    });
  }

  deleteMorphologicalDataCollection (id) {
    return this.http({
      method: 'DELETE',
      url: '/dcbia/morphological/collection/' + id
    });
  }

  getAllMorphologicalData(){
    return this.http({
      method: 'GET',
      url: '/dcbia/morphological/collection/data'
    });
  }

  getMorphologicalData(id){
    return this.http({
      method: 'GET',
      url: '/dcbia/morphological/collection/data/' + id
    });
  }

  createMorphologicalData (data) {
    return this.http({
      method: 'POST',
      url: '/dcbia/morphological/data',
      data: data
    });
  }

  addAttachement (id, filename, data) {
    return this.http({
      method: 'PUT',
      url: '/dcbia/' + id + '/' + filename,
      data: data
    });
  }

  getAttachement (id, filename, responseType) {
    return this.http({
      method: 'GET',
      url: '/dcbia/' + id + '/' + filename,
      responseType: responseType
    });
  }

  updateMorphologicalData (data) {
    return this.http({
      method: 'PUT',
      url: '/dcbia/morphological/data',
      data: data
    });
  }

  deleteMorphologicalData (id) {
    return this.http({
      method: 'DELETE',
      url: '/dcbia/morphological/data/' + id
    });
  }

  getMorphologicalDataByPatientId(id){
    return this.http({
      method: 'GET',
      url: '/dcbia/morphological/data/patientId/' + id
    });
  }

  getProjects(){
    return this.http({
      method: 'GET',
      url: '/dcbia/projects'
    });
  }

  getProject(id){
    return this.http({
      method: 'GET',
      url: '/dcbia/project/' + id
    });
  }

  createProject(data) {
    return this.http({
      method: 'POST',
      url: '/dcbia/projects',
      data: data
    });
  }

  updateProject(data) {
    return this.http({
      method: 'PUT',
      url: '/dcbia/projects',
      data: data
    });
  }

  deleteProject(id) {
    return this.http({
      method: 'DELETE',
      url: '/dcbia/project/' + id
    });
  }

  getMorphologicalDataByCollectionIdPatientId(collectionId, patientId){
    return this.http({
      method: 'GET',
      url: '/dcbia/morphological/data/' + collectionId + '/patient/' + patientId
    });
  }










  // uploadZipFile(data){
  //   return this.http({
  //     method: 'POST',
  //     url: '/dcbia/uploadZipFile',
  //     data: data
  //   });
  // }

  uploadFile(path, data){
    return this.http({
      method: 'POST',
      url: '/dcbia/upload/' + path,
      data: data
    });
  }

  renameFile(infos){
    return this.http({
      method: 'PUT',
      url: '/dcbia/rename',
      data: infos
    })
  }

  getDirectoryMap(username) {
    return this.http({
      method: 'GET',
      url: 'dcbia/map', 
      // + username ? username : '',
    });
  }

 deleteFile(path){
  return this.http({
    method: 'DELETE',
    url: '/dcbia/delete/' + path
  })
 }

 searchFiles(data){
  return this.http({
    method: 'GET',
    url: '/dcbia/search/' + data,
  })
 }

 createFolder(newfolder) {
  return this.http({
    method: 'POST',
    url: '/dcbia/createfolder/' + newfolder
  })
 }

 downloadFiles(file) {
  return this.http({
    method: 'GET',
    url: '/dcbia/download/' + file,
    responseType: 'blob'
  })
 }

 shareFiles(infos) {
  return this.http({
    method: 'POST',
    url: '/dcbia/shareFiles',
    data: infos
  })
 }

 moveFiles(infos) {
  return this.http({
    method: 'PUT',
    url: '/dcbia/moveFiles',
    data: infos
  });
 }

 copyFiles(infos) {
  return this.http({
    method: 'PUT',
    url: '/dcbia/copyFiles',
    data: infos
  });
 }



}