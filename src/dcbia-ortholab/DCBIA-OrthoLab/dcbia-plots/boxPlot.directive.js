var dcbiaPlots = angular.module('dcbia-plots');

dcbiaPlots
.directive('boxPlotChart', function($compile, $rootScope){
    
    return {
        restrict: 'E',
        template: '<div id="{{elementId}}" style="width:100%"></div>',
        scope:{
            height: '=height',
            margin: '=margin',
            boxdata: '=data',
            boxPlotTitle: '=',
            legendY: '=',
            legendX: '='
            // title: '@title'
        },
        link: function(scope, element, attrs) {
            scope.elementId = _.uniqueId("chartArea");

            scope.refresh = function(){

                var child = _.find(element.children(), function(el){
                    return el.id === scope.elementId;
                });

                    var min = Infinity,
                        max = -Infinity; 

                    scope.width = child.clientWidth;

                    var data = [];
                    var datalabels = [];
                    var dataurl = [];
                    var dataemail = [];
                    var dataimageId = [];
                    var datauserDataId = [];
                    var datasegname = [];
                    var dataimageName = [];

                    var n = 0;
                    var keys;
                    if(scope.boxdata.data.length > 0){
                        keys = _.keys(scope.boxdata.data[0]);
                    }
                    var ids = _.pluck(scope.boxdata.data, "_id");
                    var queryobj = _.object(ids,scope.boxdata.data );
                    _.each(keys, function(key){
                        if(key !== "_id" && key !== "_rev"){
                            var d = _.map(_.pluck(scope.boxdata.data, key), function(v, i){
                                var obj = {
                                    key: ids[i],
                                    value: v
                                };
                                return obj;
                            })
                            d = _.filter(d, function(obj){
                                return _.isNumber(obj.value) && !_.isNaN(obj.value);
                            });
                            if(d.length > 0){
                                data[n] = d;

                                if(scope.boxdata.normalize){
                                    data = _.map(data, function(d){
                                        var max = _.max(_.pluck(d, "value"));
                                        return _.map(d, function(dd){
                                            dd.value = dd.value/max;
                                            return dd;
                                        });
                                    });
                                    max = 1;
                                    min = 0;
                                }else{
                                    _.each(data[n], function(s){
                                        if (s.value> max) max = s.value;
                                        if (s.value < min) min = s.value;
                                    });
                                }
                                
                                n++;
                            }
                            
                        }
                    });

                    var chart = d3.box()
                                .whiskers(iqr(1.5))
                                .width(scope.width)
                                .height(scope.height);

                    chart.domain([min, max]);

                    // Returns a function to compute the interquartile range.
                    function iqr(k) {
                      return function(d, i) {
                        var q1 = d.quartiles[0],
                            q3 = d.quartiles[2],
                            iqr = (q3 - q1) * k,
                            i = -1,
                            j = d.length;
                        while (d[++i] < q1 - iqr);
                        while (d[--j] > q3 + iqr);
                        return [i, j];
                      };
                    }


                    // Add

                    if(scope.svg !== undefined){
                        d3.select("#" + scope.elementId).select('svg').remove();
                    }

                    var pad = 40, left_pad = 100;
                    var w = scope.width - left_pad;
                    var h = scope.height + scope.margin.top + scope.margin.bottom;

                    scope.svg = d3.select(child).insert("svg")
                        .attr("id", "svgImage")
                        .attr("width", w)
                        .attr("height", h)
                        .attr("class", "box")    
                        .append("g")
                  

                    // the x-axis
                    var x = d3.scale.ordinal()     
                        .domain( data.map(function(d,i) {
                            return i; })) 
                            // return dataimageName && dataimageName[i] && dataimageName[i][0] ? dataimageName[i][0] : i; }))      
                        .rangeRoundBands([0 , scope.width], 0.7, 0.3);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .tickFormat(function(d,i) {
                            return dataimageName && dataimageName[i] && dataimageName[i][0] ? dataimageName[i][0] : datalabels[d];
                        });

                    // the y-axis
                    var y = d3.scale.linear()
                        .domain([min, max])
                        .range([scope.height + scope.margin.top, scope.margin.bottom]);
                    
                    var yAxis = d3.svg.axis().scale(y).orient("left"); 

                    // draw the boxplots  
                    scope.svg.selectAll(".box")
                      .data(_.map(data, function(d){return _.pluck(d, "value");}))
                      .enter()
                      .append("g")
                      .attr("transform", function(d,i) { 
                        return "translate(" + (left_pad+x(i))  + "," + scope.margin.top + ")"; 
                        } )
                      .call(chart.width(x.rangeBand())); 
                    
                          
                    // add a title
                    scope.svg.append("text")
                        .attr("x", (scope.width / 2))             
                        .attr("y", (scope.margin.top / 2))
                        .attr("text-anchor", "middle")  
                        .style("font-size", "18px") 
                        //.style("text-decoration", "underline")  
                        .text(scope.boxPlotTitle);
                 
                     // draw y axis
                    // scope.svg.append("g")
                    //     .attr("class", "axis")
                    //     .call(yAxis)
                    //     .append("text") // and text1
                        
                    //       .attr("y", scope.margin.top/2)
                    //       .attr("dy", ".71em")
                    //       .attr("x", 10)
                    //       .style("text-anchor", "end")
                    //       .style("font-size", "14px") 
                    //       .text(scope.legendY);

                  scope.svg.append("g")
                      .attr("class", "axis")
                      .attr("transform", "translate("+left_pad+"," + h + ")")
                      .call(xAxis)
                      .append('text')
                      .attr('transform', 'rotate(-90)')
                      .attr('x', h/2)
                      .attr('y', -left_pad)
                      .style("text-anchor", "middle")
                      .style("font-size", "14px") 
                      .text(scope.legendY);
                    
                    // draw x axis  
                    
                    // scope.svg.append("g")
                    //   .attr("class", "x axis")
                    //   .attr("transform", "translate(0," + h + ")")
                    //   .call(xAxis)
                    //   .append("text")             // text label for the x axis
                    //     .attr("x", (scope.width + scope.margin.left) + 5 )
                    //     .attr("dy", ".71em")
                    //     .style("text-anchor", "end")
                    //     .style("font-size", "14px") 
                    //     .text(scope.legendX);

                  scope.svg.append("g")
                      .attr("class", "axis")
                      .attr("transform", "translate("+(left_pad-pad)+", 0)")
                      .call(yAxis)
                      .append('text')
                      .style("text-anchor", "middle")
                      .attr('x', w / 2)
                      .attr('y', h + pad)
                      .attr("dy", ".71em")
                      .style("font-size", "14px") 
                      .text(scope.legendX);

                    //draw circles

                    var circledata = [];

                    for(var i = 0; i < data.length; i++){
                        for(var j = 0; j < data[i].length; j++){
                            var circle = {};
                            circle.index = i;
                            circle.data = data[i][j].value;
                            circle.key = data[i][j].key;
                            // circle.url = dataurl && dataurl[i] && dataurl[j]? dataurl[i][j]: "";
                            // circle.userEmail = dataemail[i][j];
                            // circle.imageId = dataimageId[i][j];
                            // circle.userDataId = datauserDataId[i][j];
                            // circle.segname = datasegname[i][j];
                            // circle.imageName = dataimageName[i][j];
                            circledata.push(circle);
                        }
                    }

                    scope.svg.selectAll("circle")
                    .data(circledata)
                    .enter()
                    .append("circle")
                    .attr("class", "circle")
                    .attr("style", "cursor: pointer;")
                    .attr("cx", function (d) {
                        return x(d.index) + x.rangeBand()/2 + left_pad; })
                    .attr("cy", function (d) { 
                        return y(d.data); })
                    .attr("r", 4)
                    .attr("id", function (d) {
                        d.uniqueId = _.uniqueId('svgCircle_')
                        return d.uniqueId;})
                    .on("click", function (d, i) {
                        if(_.isFunction(scope.boxdata.circleAction)){
                            scope.boxdata.circleAction(d.key);
                        }
                        //return 'window.open("' + d.url + '", "_blank");'
                    })
                    .append("svg:title")
                    .text(function (d) { 
                        return queryobj[d.key].patientId + ": " + d.data 
                    })
                    .transition()
                    .duration(800)                    
            }

            
            scope.$watch('boxdata', function(){
                if(scope.boxdata !== undefined){
                    scope.refresh();
                }
            });
           
        }

    }
});