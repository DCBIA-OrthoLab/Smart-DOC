angular.module('data-collections')
.factory('dcbia', function ($q, $http, $location) {
  return {
    getClinicalDataCollections: function(){
      return $http({
        method: 'GET',
        url: '/dcbia/clinical/collections'
      });
    },
    getClinicalDataCollection: function(id){
      return $http({
        method: 'GET',
        url: '/dcbia/clinical/collection/' + id
      });
    },
    createClinicalDataCollection: function (data) {
      return $http({
        method: 'POST',
        url: '/dcbia/clinical/collection',
        data: data
      });
    },
    updateClinicalDataCollection: function (data) {
      return $http({
        method: 'PUT',
        url: '/dcbia/clinical/collection',
        data: data
      });
    },
    deleteClinicalDataCollection: function (id) {
      return $http({
        method: 'DELETE',
        url: '/dcbia/clinical/collection/' + id
      });
    },
    getAllClinicalData: function(){
      return $http({
        method: 'GET',
        url: '/dcbia/clinical/collection/data'
      });
    },
    getClinicalData: function(id){
      return $http({
        method: 'GET',
        url: '/dcbia/clinical/collection/data/' + id
      });
    },
    getClinicalDataOwners: function(){
      return $http({
        method: 'GET',
        url: '/dcbia/clinical/data/owner'
      });
    },
    getClinicalDataOwner: function(email){
      return $http({
        method: 'GET',
        url: '/dcbia/clinical/data/owner?email=' + email
      });
    },
    createClinicalData: function (data) {
      return $http({
        method: 'POST',
        url: '/dcbia/clinical/data',
        data: data
      });
    },
    updateClinicalData: function (data) {
      return $http({
        method: 'PUT',
        url: '/dcbia/clinical/data',
        data: data
      });
    },
    deleteClinicalData: function (id) {
      return $http({
        method: 'DELETE',
        url: '/dcbia/clinical/data/' + id
      });
    },
    getMorphologicalDataCollections: function(){
      return $http({
        method: 'GET',
        url: '/dcbia/morphological/collections'
      });
    },
    getMorphologicalDataCollection: function(id){
      return $http({
        method: 'GET',
        url: '/dcbia/morphological/collection/' + id
      });
    },
    createMorphologicalDataCollection: function (data) {
      return $http({
        method: 'POST',
        url: '/dcbia/morphological/collection',
        data: data
      });
    },
    updateMorphologicalDataCollection: function (data) {
      return $http({
        method: 'PUT',
        url: '/dcbia/morphological/collection',
        data: data
      });
    },
    deleteMorphologicalDataCollection: function (id) {
      return $http({
        method: 'DELETE',
        url: '/dcbia/morphological/collection/' + id
      });
    },
    getAllMorphologicalData: function(){
      return $http({
        method: 'GET',
        url: '/dcbia/morphological/collection/data'
      });
    },
    getMorphologicalData: function(id){
      return $http({
        method: 'GET',
        url: '/dcbia/morphological/collection/data/' + id
      });
    },
    createMorphologicalData: function (data) {
      return $http({
        method: 'POST',
        url: '/dcbia/morphological/data',
        data: data
      });
    },
    addAttachement: function (id, filename, data) {
      return $http({
        method: 'PUT',
        url: '/dcbia/' + id + '/' + filename,
        data: data
      });
    },
    getAttachement: function (id, filename, responseType) {
      return $http({
        method: 'GET',
        url: '/dcbia/' + id + '/' + filename,
        responseType: responseType
      });
    },
    updateMorphologicalData: function (data) {
      return $http({
        method: 'PUT',
        url: '/dcbia/morphological/data',
        data: data
      });
    },
    deleteMorphologicalData: function (id) {
      return $http({
        method: 'DELETE',
        url: '/dcbia/morphological/data/' + id
      });
    },
    getMorphologicalDataByPatientId: function(id){
      return $http({
        method: 'GET',
        url: '/dcbia/morphological/data/patientId/' + id
      });
    },
    getProjects: function(){
      return $http({
        method: 'GET',
        url: '/dcbia/projects'
      });
    },
    getProject: function(name){
      return $http({
        method: 'GET',
        url: '/dcbia/projects?name=' + name
      });
    },
    createProject: function (data) {
      return $http({
        method: 'POST',
        url: '/dcbia/projects',
        data: data
      });
    }
  }
});