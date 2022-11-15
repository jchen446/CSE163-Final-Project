var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var rateById = d3.map();

var color = d3.scaleThreshold()
    .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
    .range(d3.schemeOrRd[9]);

var projection = d3.geoConicConformal()
    .scale(850)
    .rotate([15,1])
    .translate([200, 1650]);

var path = d3.geoPath()
    .projection(projection);
    
    var x = d3.scaleSqrt()
    .domain([0, 4500])
    .rangeRound([440, 950]);

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
    .await(ready);
    
 d3.select("button")
    .on("click", function(d, i) {
      var self = d3.select(this);
      if (self.text() == "Change to Blue") {
          self.text('Change to Red');
          color.range(d3.schemeGnBu[9]);
          d3.selectAll("rect")
            .style("fill", function(d) {return color(d[0]);})
          d3.selectAll("path")
            .style("fill", function(d) {return color(rateById.get(d.id));})
      }else{
          self.text('Change to Blue');
          color.range(d3.schemeOrRd[9]);
          d3.selectAll("rect")
            .style("fill", function(d) {return color(d[0]);})
          d3.selectAll("path")
            .style("fill", function(d) {return color(rateById.get(d.id));})
      }
  });
    
  d3.select("button")
    .on("click", function(d, i) {
      var self = d3.select(this);
      if (self.text() == "Turn County Off") {
          self.text('Turn County On');
          color.range(d3.schemeGnBu[9]);
          d3.selectAll("rect")
            .style("fill", function(d) {return color(d[0]);})
          d3.selectAll("path")
            .style("fill", function(d) {return color(rateById.get(d.id));})
      }else{
          self.text('Turn County Off');
          color.range(d3.schemeOrRd[9]);
          d3.selectAll("rect")
            .style("fill", function(d) {return color(d[0]);})
          d3.selectAll("path")
            .style("fill", function(d) {return color(rateById.get(d.id));})
      }
  });

var toggle = false;
function toggleboundaries(){
  if (!toggle) {
     d3.selectAll("path")
        .style("stroke", "#FFF")
     toggle = true           
  } else if (toggle) {
    d3.selectAll("path")
        .style("stroke", function(d) { if (rateById.has(d.id)){return "000"; }})
     toggle = false  
  }   
}

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
      .attr("fill", "#ADD8E6")
      .attr("d", path)
    .on("mouseover", function(d) {
           tooltip.transition()
             .duration(200)
             .style("opacity", .9);
           tooltip.html(d.properties.geounit ) 
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
      .attr("stroke-opacity", 0.3)
      .attr("d", path);
    
}
