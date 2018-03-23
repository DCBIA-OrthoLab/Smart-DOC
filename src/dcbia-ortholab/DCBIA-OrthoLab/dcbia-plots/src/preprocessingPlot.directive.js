angular.module('dcbia-plots')
.directive('preprocessingPlotChart', function($compile, $rootScope){

  function link($scope, element, attrs){
          
    $scope.plotID = _.uniqueId("preprocessingPlot");
  

    var datapearsoncorr = [];
    var datapvalues = [];
    $scope.svg = null;
    // $scope.data = {
    //   namesx: [], //nx array matrix with names for x,
    //   namesy: [], //ny array with names,
    //   heat_map: [[]], //nx * ny matrix
    //   heat_emit: [[]], //Broadcast that value
    //   heat_func: [[]] //Callbacks
    // } 
     
    $scope.drawHeatMap = function(data){
      var w = window.innerWidth;
      var h = window.innerHeight;
      
      var colors = data.attributes.colors;
      var scale = data.attributes.scale;

      w = 1100;
      var margin = { top: 50, right: 0, bottom: 0, left: 95 },
            width = w - margin.left - margin.right,
            gridSize = Math.floor(width / data.namesx.length),
            height = width + 200 - margin.top - margin.bottom,
            legendElementWidth = gridSize*2,
            buckets = 4;

      var svg = $scope.svg;
      var div = $scope.div;

      if(!$scope.svg){
          div = d3.select("#" + $scope.plotID).append("div")
                      .attr("class", "tooltip")       
                      .style("opacity", 0);

          svg = d3.select("#" + $scope.plotID).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          
          $scope.div = div;
          $scope.svg = svg;
      }

      svg.selectAll("*").remove(); 

      var num_componentsLabels = svg.selectAll(".num_componentsLabel")
          .data(data.namesy)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "num_componentsLabel mono axis axis-num_components" : "num_componentsLabel mono axis"); });
      
      var covariatesLabels = svg.selectAll(".covariatesLabel")
          .data(data.namesx)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "covariatesLabel mono axis axis-covariates" : "covariatesLabel mono axis"); });
      
      var colorScale = d3.scaleQuantile()
          .domain(scale)
          .range(colors);


        
      for (i=0; i<data.namesy.length; i++){
        for(j=0; j<data.namesx.length; j++){

          var cards = svg.selectAll(".pvalues")
              .data(data.heat_map, function(d) {return d[i][j];});
          cards.append("title");
          var valx = '';
          var valy = '';
          cards.enter().append("rect")
              .attr("x",j *gridSize)
              .attr("y",i * gridSize)
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "covariates bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              .style("fill",colorScale(data.heat_map[i][j]))
              .on("mouseover", function(d) { 
                  div.transition()    
                      .duration(200)    
                      .style("opacity", .6)
                  div.html(Math.round(data.heat_map[(this.y.animVal.value)/gridSize][(this.x.animVal.value)/gridSize]*10000)/10000)
                     .style('left', this.x.animVal.value + margin.left + "px")
                     .style('top', this.y.animVal.value + margin.top + gridSize/2 + 14  + "px"); 
                  });  
                
          cards.exit().remove();
          div.exit().remove();
          var legend = svg.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; });
          legend.enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", data.namesy.length * gridSize + 25)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d,i) { return "≥ " + scale[i]; })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", data.namesy.length * gridSize + 25 + gridSize);
          legend.exit().remove();

        }
      }
    }

    $scope.$watch('data', function(data){
      if(data!=null && data.heat_map!=null){
        if(!data.attributes){
          data.attributes = {
            colors : ["#ff0000", "#ffff00","#008000", "#0000ff"],
            scale : [0, 0.01, 0.05, 0.05001,1]
          }
        }
        $scope.drawHeatMap(data);
      }
    }, true);

  }

  return {
    restrict: 'E',
    scope:{
        preprocessingPlotTitle: '=',
        data: '='
    },
    link : link,
    templateUrl: './src/preprocessingPlot.template.html'
  }

});