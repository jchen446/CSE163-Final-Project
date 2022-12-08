//GEOMAP
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var rateByAmount = d3.map();
var rateByMinutes = d3.map();
var rateBySalaries = d3.map();

var AmountByYear = d3.map();

var color = d3.scaleThreshold()
    .domain([1, 2, 5, 10, 20, 30, 40, 50])
    .range(d3.schemeYlGn[9]);

var projection = d3.geoConicConformal()
    .scale(600)
    .rotate([15,1])
    .translate([100, 1200]);

var path = d3.geoPath()
    .projection(projection);
    
    var x = d3.scaleSqrt()
    .domain([0, 50])
    .rangeRound([200, 700]);

var g = svg.append("g")
    .attr("transform", "translate(-150,70)");

g.selectAll("rect")
  .data(color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return x(d[0]); })
    .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    .attr("fill", function(d) { return color(d[0]); });

g.append("text")
    .attr("class", "caption")
    .attr("x", x.range()[0])
    .attr("y", -6)
    .attr("fill", "#000")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text("Number of NBA Players");

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickValues(color.domain()))
  .select(".domain")
    .remove();

d3.queue()
    .defer(d3.json, "europe-10m.json")
    .defer(d3.csv, "player-density.csv", function(d) { rateByAmount.set(d.Country, +d.Amount);})
    .defer(d3.csv, "player-density.csv", function(d) { rateByMinutes.set(d.Country, +d.Minutes);})
    .defer(d3.csv, "player-density.csv", function(d) { rateBySalaries.set(d.Country, +d.Salaries);})
    .await(ready);

var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

//slider
var data = ['1985', '1990', '1995', '2000' ,'2005', '2010', '2015', '2020'];

  var sliderSimple = d3
    .sliderBottom()
    .min(d3.min(data))
    .max(d3.max(data))
    .width(300)
    .tickFormat(d3.format(''))
    .ticks(5)
    .step(5)
    .default('1985')
    .on('onchange', val => {
      d3.select('p#value-simple').text(val-5+'-' +d3.format('')(val));
      updateGeo(val);
        
    });

  var gSimple = d3
    .select('div#slider-simple')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');


  gSimple.call(sliderSimple);

  d3.select('p#value-simple').text('1980-2020');


function updateGeo(val){
    var ind = parseInt(val);
    ind = ind - 1980;
    //console.log(AmountByYear);//data to update into geomap
    
     d3.csv("players-timeline.csv", function(data) {

     if(data[ind].hasOwnProperty('year')){
        delete data[ind]['year']; 
     } 
     AmountByYear=data[ind];
     //data to update into geomap
    
     });
    
    
    d3.queue()
    .defer(d3.json, "europe-10m.json")
    .defer(d3.csv, "player-density.csv", function(d) { 
        
        
         
        rateByAmount.set(d.Country, +AmountByYear[d.Country])
     
        ;})
    .defer(d3.csv, "player-density.csv", function(d) { rateByMinutes.set(d.Country, +d.Minutes);})
    .defer(d3.csv, "player-density.csv", function(d) { rateBySalaries.set(d.Country, +d.Salaries);})
    .await(ready);
    
 

};
function reset(){
    
    d3.queue()
    .defer(d3.json, "europe-10m.json")
    .defer(d3.csv, "player-density.csv", function(d) { rateByAmount.set(d.Country, +d.Amount);})
    .defer(d3.csv, "player-density.csv", function(d) { rateByMinutes.set(d.Country, +d.Minutes);})
    .defer(d3.csv, "player-density.csv", function(d) { rateBySalaries.set(d.Country, +d.Salaries);})
    .await(ready);
      d3.select('p#value-simple').text('1980-2020');
}



function ready(error, europe) {
  if (error) throw error;
  density = svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(europe, europe.objects.continent_Europe_subunits).features)
    .enter().append("path")
      .attr("fill", function(d) { if (rateByAmount.get(d.properties.geounit)){return color(rateByAmount.get(d.properties.geounit)); } else {return "#FFF"}})
      .attr("stroke", "#000")
      .attr("stroke-opacity", 1)
      .attr("d", path)
    

    .on("mouseover", function(d) {
           tooltip.transition()
             .duration(200)
             .style("opacity", .9);
           tooltip.html("<strong>" + "<u>" + d.properties.geounit + "</u>" + "</strong>" + "<br>" + "<span style='float:left'>" + "# of NBA Players" + "</span>" + ":" + "<span style='float:right'>" +  rateByAmount.get(d.properties.geounit) + "</span>" + "<br>" + "<span style='float:left'>" + "Avg Minutes" + "</span>" + ":" + "<span style='float:right'>" +  rateByMinutes.get(d.properties.geounit) + "</span>" + "<br>" + "<span style='float:left'>" + "Total Income" + "</span>" + ":" + "<span style='float:right'>" + "$" + rateBySalaries.get(d.properties.geounit).toLocaleString() + "</span>") 
               .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
           })
          
    .on("mouseout", function(d) {
           tooltip.transition()
             .duration(500)
             .style("opacity", 0);
           }).on('click', function(d) {grayout(d.properties.geounit)});
    
    boundaries = svg.append("path")
      .attr("class", "counties")
      .datum(topojson.mesh(europe, europe.objects.continent_Europe_subunits, function(a, b) { return a != b; }))
      .attr("stroke", "#000")
      .attr("stroke-opacity", 1)
      .attr("d", path);
    
    labels = svg.selectAll("text")
        .data(topojson.feature(europe, europe.objects.continent_Europe_subunits).features)
        .enter()
        .append("text")
        .attr("x", function(d) { if(path.centroid(d)[0]){return path.centroid(d)[0]; }})
        .attr("y", function(d) { if(path.centroid(d)[1]){return path.centroid(d)[1]; }})
        .text(function(d){
            return d.properties.geounit;
        })
        .attr("text-anchor","middle")
        .attr('font-size','6pt');
    
}


