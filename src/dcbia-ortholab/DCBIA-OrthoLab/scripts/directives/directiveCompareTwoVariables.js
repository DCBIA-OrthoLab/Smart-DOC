angular.module('cTRIVIAL')
.directive('compareTwoVariables', function($compile, $rootScope){
    
    return {
        restrict: 'E',
        template: '<div id="{{elementId}}" style="width:100%"></div>',
        scope:{
            height: '=',
            margin: '=',
            data: '=',            
            legendY: '=',
            legendX: '='
        },
        link: function(scope, element, attrs) {
            scope.elementId = _.uniqueId("chartArea");

            scope.refresh = function(data, carac1, carac2){

                var child = _.find(element.children(), function(el){
                    return el.id === scope.elementId;
                });

                if(scope.svg !== undefined){
                    d3.select("#" + scope.elementId).select('svg').remove();
                }
                var margin = scope.margin;
                var width = child.clientWidth - margin.left - margin.right;
                var height = scope.height - margin.top - margin.bottom;

                //creation of the drawing windaw
                scope.svg = d3.select("#" + scope.elementId).append("svg")
                .attr("class", "d3plot")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("class", "graph")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                var svg = scope.svg

                //### X axis ###
                var x = d3.scaleLinear().domain([d3.min(data, function(d) { return d[carac1]; }), d3.max(data, function(d) { return d[carac1]; })]).range([0, width]);

                var xAxis = d3.axisBottom()
                .scale(x);

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
                var y = d3.scaleLinear().domain([d3.min(data, function(d) { return d[carac2]; }), d3.max(data, function(d) { return d[carac2]; })]).range([height, 0]);

                var yAxis = d3.axisLeft()
                .scale(y);

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
                .attr("cx", function(d) {
                    return x(d[carac1]);})
                .attr("cy", function(d) {
                    return y(d[carac2]);})
                .attr("r", 5);
            }

            
            scope.$watch('data', function(){
                if(scope.data !== undefined){
                    scope.refresh(scope.data.data, scope.data.carac1.label, scope.data.carac2.label);
                }
            });
           
        }

    }
});