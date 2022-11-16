//GEOMAP
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var rateById = d3.map();

var color = d3.scaleThreshold()
    .domain([1, 2, 5, 10, 20, 30, 40, 50])
    .range(d3.schemeYlGn[9]);

var projection = d3.geoConicConformal()
    .scale(600)
    .rotate([15,1])
    .translate([200, 1200]);

var path = d3.geoPath()
    .projection(projection);
    
    var x = d3.scaleSqrt()
    .domain([0, 50])
    .rangeRound([200, 700]);

var g = svg.append("g")
    .attr("transform", "translate(0,40)");

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
    .text("Population per square mile");

g.call(d3.axisBottom(x)
    .tickSize(13)
    .tickValues(color.domain()))
  .select(".domain")
    .remove();

d3.queue()
    .defer(d3.json, "europe-10m.json")
    .defer(d3.csv, "Player-Density.csv", function(d) { rateById.set(d.Country, +d.Amount);})
    .await(ready);

var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
function ready(error, europe) {
  if (error) throw error;

  density = svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(europe, europe.objects.continent_Europe_subunits).features)
    .enter().append("path")
      .attr("fill", function(d) { if (rateById.get(d.properties.geounit)){return color(rateById.get(d.properties.geounit)); } else {return "#FFF"}})
      .attr("stroke", "#000")
      .attr("stroke-opacity", 1)
      .attr("d", path)
    .on("mouseover", function(d) {
           tooltip.transition()
             .duration(200)
             .style("opacity", .9);
           tooltip.html(d.properties.geounit + "<br>" + "<span style='float:left'>" + "Number of NBA Players" + "</span>" + ":" + "<span style='float:right'>" +  rateById.get(d.properties.geounit) + "</span>") 
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
           })
    .on("mouseout", function(d) {
           tooltip.transition()
             .duration(500)
             .style("opacity", 0);
           });
    
    boundaries = svg.append("path")
      .attr("class", "counties")
      .datum(topojson.mesh(europe, europe.objects.continent_Europe_subunits, function(a, b) { return a != b; }))
      .attr("stroke", "#000")
      .attr("stroke-opacity", 1)
      .attr("d", path);
    
}
