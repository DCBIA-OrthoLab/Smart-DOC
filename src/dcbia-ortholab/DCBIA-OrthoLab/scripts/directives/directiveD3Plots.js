
angular.module('cTRIVIAL')
.directive('d3Plots', function($routeParams, $location, $rootScope, clusterauth, dcbia){

    function link($scope, element){

        $scope.elementId = _.uniqueId('d3Plots');
        element.attr("id", $scope.elementId);

        $scope.graph = {
          axis: {}
        };

        $scope.boxplotdata = {};

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

            console.log($scope.graph.type);

            var data = $scope.data;

            var allkeys = {};
            _.each(data, function(obj){ _.extend(allkeys, obj); });
            delete allkeys._id;
            delete allkeys._rev;
            delete allkeys.type;

            $scope.keys = _.keys(allkeys);

            if($scope.svg != undefined){
                // !!!!!!!!!!!!!! A modifier !!!!!!!!!!!!!!!!!!!!
                if($scope.graph.type == 0) if (element.children()[2] != undefined) element.children()[2].remove();
                if($scope.graph.type == 1) if(element.children()[1] != undefined)  element.children()[1].remove();

            }

            if($scope.graph.type == 0)
            {
                      if($scope.graph.axis.x != undefined){
                      if($scope.graph.axis.y != undefined){
                      displayTwoCaracteristics(data, $scope.graph.axis.x, $scope.graph.axis.y)
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
          // definition of the size of the window
          var margin = {top: 80, right: 80, bottom: 80, left: 80};
          var width = 1000 - margin.left - margin.right;
          var height = 600 - margin.top - margin.bottom;

          //creation of the drawing windaw
          $scope.svg = d3.select("#" + $scope.elementId).append("svg")
          .attr("class", "d3plot")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("class", "graph")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          var svg = $scope.svg

          //### X axis ###
          var x = d3.scale.linear().domain([d3.min(data, function(d) { return d[carac1]; }), d3.max(data, function(d) { return d[carac1]; })]).range([0, width]);

          var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

          svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("x", 6)
          .attr("dx", width + 40)
          .attr("dy", "1.22em")
          .style("text-anchor", "end")
          .text(carac1);

          //### Y axis ###
          var y = d3.scale.linear().domain([d3.min(data, function(d) { return d[carac2]; }), d3.max(data, function(d) { return d[carac2]; })]).range([height, 0]);

          var yAxis = d3.svg.axis()
          .scale(y).
          orient("left");

          svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0,0)")
          .call(yAxis)
          .append("text")
          .attr("y", 6)
          .attr("dy", "-2em")
          .style("text-anchor", "end")
          .text(carac2);

          // drow circles

          var circ = svg.selectAll(".bar").data(data).enter();

          circ.append("circle")
          .attr("class", "circl")
          .attr("cx", function(d) {return x(d[carac1]);})
          .attr("cy", function(d) {return y(d[carac2]);})
          .attr("r", 5);
       }

        $scope.circleAction = function(key){
          var data = _.find($scope.boxplotdata.data, function(d){
            return d._id === key;
          });

          dcbia.getMorphologicalDataByPatientId(data.patientId)
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
          $scope.width = 1000;
          $scope.height = 400;
          $scope.margin = {
            left: 40,
            right: 40,
            top: 40,
            bottom: 40
          };
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

    };

    return {
        restrict : 'E',
        link : link,
        scope: {
            data : "="
        },
        templateUrl: 'views/directives/directiveD3Plots.html'
    }

});

