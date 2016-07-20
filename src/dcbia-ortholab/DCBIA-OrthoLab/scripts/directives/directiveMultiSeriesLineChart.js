angular.module('cTRIVIAL')
.directive('multiSeriesLineChart', function($compile, $rootScope){
    
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

            scope.refresh = function(data, xlabels){

                var child = _.find(element.children(), function(el){
                    return el.id === scope.elementId;
                });

                if(scope.svg !== undefined){
                    d3.select("#" + scope.elementId).select('svg').remove();
                }
                var margin = scope.margin;
                var width = child.clientWidth - margin.left - margin.right;
                var height = scope.height - margin.top - margin.bottom;
                var datakeys = [];

                if(data.length > 0){
                    datakeys = _.keys(data[0]);
                }

                var parseTime = d3.timeParse("%Y%m%d");

                var x = d3.scaleLinear().range([0, width]),
                    y = d3.scaleLinear().range([height, 0]),
                    z = d3.scaleOrdinal(d3.schemeCategory10);

                var line = d3.line()
                    .curve(d3.curveBasis)
                    .x(function(d) { 
                        return x(d.x); 
                    })
                    .y(function(d) { 
                        return y(d.y); 
                    });

                var cities = _.map(datakeys, function(id) {
                    return {
                      id: id,
                      values: _.map(_.pluck(data, id), function(y, x){
                        if(!_.isNumber(y) || _.isNaN(y)){
                            y = 0;
                        }
                        if(!_.isNumber(x) || _.isNaN(x)){
                            x = 0;
                        }
                        return{
                            x: x,
                            y: y
                        }
                      })
                    };
                });
                   

                x.domain([0, xlabels.length]);

                y.domain([
                    d3.min(cities, function(c) { 
                        return d3.min(c.values, function(d) { return d.y; }); 
                    }),
                    d3.max(cities, function(c) { 
                        return d3.max(c.values, function(d) { return d.y; }); 
                    })
                ]);

                z.domain(cities.map(function(c) { return c.id; }));

                //creation of the drawing windaw
                scope.svg = d3.select("#" + scope.elementId).append("svg")
                .attr("class", "d3plot")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

                var svg = scope.svg;

                var xaxis = d3.axisBottom(x)
                .tickFormat(function(i) { 
                    return xlabels[i]; 
                });

                var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(xaxis);


                g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(y))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("fill", "#000");

                var city = g.selectAll(".city")
                .data(cities)
                .enter().append("g")
                .attr("class", "city");

                city.append("path")
                .attr("class", "line")
                .attr("d", function(d) { 
                    return line(d.values); 
                })
                .style("stroke", function(d) { 
                    return z(d.id); 
                });
                

                // adding legend

                var legend = svg.append("g")
                                .attr("class","legend")
                                .attr("x", width)
                                .attr("y", 100)
                                .attr("height", 100)
                                .attr("width",100);

                legend.selectAll("g")
                .data(datakeys)
                      .enter()
                      .append('g')
                      .each(function(d,i){

                        var g = d3.select(this);
                        g.append("rect")
                            .attr("x", width - 15)
                            .attr("y", i*40 + 10)
                            .attr("width", 10)
                            .attr("height",10)
                            .style("fill", z(d))
                            .on("click", function (d) {
                                if(_.isFunction(scope.data.action)){
                                    scope.data.action(d);
                                }
                            });

                        g.append("text")
                         .attr("x", width)
                         .attr("y", i*40 + 20)
                         .attr("height",30)
                         .attr("width",100)
                         .style("fill", z(d))
                         .text(d);
                      });

            }

            
            scope.$watch('data', function(){
                if(scope.data !== undefined){
                    scope.refresh(scope.data.lines, scope.data.labels);
                }
            });
           
        }

    }
});