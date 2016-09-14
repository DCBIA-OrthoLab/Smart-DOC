var dcbiaPlots = angular.module('dcbia-plots');
dcbiaPlots
.directive('d3Plots', function($routeParams, $location, $rootScope, clusterauth, dcbia){

    function link($scope, element){

        $scope.elementId = _.uniqueId('d3Plots');
        element.attr("id", $scope.elementId);

        $scope.graph = {
          axis: {}
        };

        $scope.boxplotdata = {};

        $scope.height = 600;
          $scope.margin = {
            left: 80,
            right: 80,
            top: 40,
            bottom: 40
          };

        $scope.update = function(){

        }

        $scope.$watch('data', function(){
            if($scope.data){
                $scope.update();
            }
        })

        $scope.$watch('graph.axis.x', function(){
          var data = $scope.data;
                      
                      if($scope.svg != undefined){
                      // !!!!!!!!!!!!!! A modifier !!!!!!!!!!!!!!!!!!!!
                      if($scope.graph.type == 0) if (element.children()[2] != undefined) element.children()[2].remove();
                      }
                      
                      if($scope.graph.axis.x != undefined){
                      if($scope.graph.axis.y != undefined){
                      displayTwoCaracteristics(data, $scope.graph.axis.x, $scope.graph.axis.y)
                      }
                      }


                      });

        $scope.$watch('graph.axis.y', function(){
                      var data = $scope.data;
                      
                      if($scope.svg != undefined){
                      // !!!!!!!!!!!!!! A modifier !!!!!!!!!!!!!!!!!!!!
                      if($scope.graph.type == 0) if (element.children()[2] != undefined) element.children()[2].remove();
                      }

                      if($scope.graph.axis.x != undefined){
                      if($scope.graph.axis.y != undefined){
                      displayTwoCaracteristics(data, $scope.graph.axis.x, $scope.graph.axis.y)
                      }
                      }
        });


        $scope.$watch('graph.type', function(){

            var data = $scope.data;

            var allkeys = {};
            _.each(data, function(obj){ _.extend(allkeys, obj); });
            delete allkeys._id;
            delete allkeys._rev;
            delete allkeys.type;

            $scope.keys = _.map(_.keys(allkeys),function(v, i){
              return {
                id: i, 
                label: v
              }
            });

            if($scope.svg != undefined){
                // !!!!!!!!!!!!!! A modifier !!!!!!!!!!!!!!!!!!!!
                if($scope.graph.type == 0) if (element.children()[2] != undefined) element.children()[2].remove();
                if($scope.graph.type == 1) if(element.children()[1] != undefined)  element.children()[1].remove();

            }

            if($scope.graph.type == 0)
            {
                      if($scope.graph.axis.x != undefined){
                      if($scope.graph.axis.y != undefined){
                      displayTwoCaracteristics(data, $scope.graph.axis.x.label, $scope.graph.axis.y.label)
                      }
                      }
                      
            }
                      
            else
            {
                      $scope.displayAllCaracteristics(data)
            }

        });
           
        function displayTwoCaracteristics(data, carac1, carac2) {
          if(!data){
            return;
          }

          $scope.compareTwoVariables = {};
          $scope.compareTwoVariables.data = data;
          $scope.compareTwoVariables.carac1 = carac1;
          $scope.compareTwoVariables.carac2 = carac2;
          
       }

        $scope.circleAction = function(key){
          var data = _.find($scope.boxplotdata.data, function(d){
            return d._id === key;
          });

          
        }

        $scope.getMorphologicalDataByPatientId = function(pid){
          dcbia.getMorphologicalDataByPatientId(pid)
          .then(function(res){
            $scope.attachments = {};
            $scope.attachments.data = _.flatten(_.map(res.data, function(morphodata){
              return _.map(morphodata._attachments, function(att, key){
                return {
                  id: morphodata._id,
                  label: key 
                }
              });
            }));
          })
        }
           
        $scope.displayAllCaracteristics = function(data) {

          if(!data){
            return;
          }

          $scope.boxplotdata = {};

          $scope.boxplotdata.data = data;
          $scope.boxplotdata.normalize = $scope.graph.normalize;
          $scope.boxplotdata.circleAction = $scope.circleAction;
        }

        $scope.$watch("graph.normalize", function(){
          $scope.displayAllCaracteristics($scope.data);
        });

        $scope.$watch("attachments.selected", function(){
          if($scope.attachments && $scope.attachments.selected){
            dcbia.getAttachement($scope.attachments.selected.id, $scope.attachments.selected.label, "arraybuffer")
            .then(function(res){
              $scope.attachments.surface = res.data;
            });
          }
          
        })


        $scope.multiSeries = {
          subjects: {},
          selectedVariables: {}
        };
        $scope.multiSeries.addSubjects = function( data){
          if($scope.multiSeries.subjects === undefined){
            $scope.multiSeries.subjects = {};
          }
          _.each(data, function(d){
            $scope.multiSeries.subjects[d._id] = true;
          });
        }

        $scope.multiSeries.addVariables = function(variables){
          _.each(variables, function(v){
            $scope.multiSeries.selectedVariables[v.label] = true;
          })
        }

        $scope.multiSeries.update = function(){

          var selectedVariables  = _.compact(_.map($scope.multiSeries.selectedVariables, function(b, v){
            if(b){
              return v;
            }
          }));

          var data = _.map(selectedVariables, function(v){
              var obj = {};
              _.each($scope.multiSeries.subjects, function(b, key){
                if(b){
                  var d = _.find($scope.data, function(d){
                    return key === d._id;
                  });
                  obj[d.patientId] = d[v];
                }
              });
              return obj;
          });

          $scope.multiSeries.data = {};
          $scope.multiSeries.data.lines = _.compact(data);
          $scope.multiSeries.data.labels = selectedVariables;
          $scope.multiSeries.data.action = $scope.getMorphologicalDataByPatientId;

        }

    };

    return {
        restrict : 'E',
        link : link,
        scope: {
            data : "="
        },
        templateUrl: dcbiaPlots.paths.root + 'd3Plots.template.html'
    }

});

