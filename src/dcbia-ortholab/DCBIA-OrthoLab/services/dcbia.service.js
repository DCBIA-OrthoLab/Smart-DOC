angular.module('cTRIVIAL')
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
    }
  }
});