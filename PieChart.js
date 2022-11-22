function rowConverter(data) {
    return { 
        country: data.country,
        amount: +data.amount,
        minutes: +data.minutes,
        salaries: +data.salaries
    }
}
d3.csv("Player-Density.csv", type, function(error, data) {
    if (error) throw error;
    rowConverter(data);
    //console.log(data)
});


var data = {UK: 9, Croatia: 20, France:30, Germany:8, Lithuania:12};
var width2 = 450,
    height2 = 450,
    radius = Math.min(width2, height2) / 2;

var color2 = d3.scaleOrdinal()
    .domain(data)
    .range(d3.schemeSet2);

var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.pie()
    .value(function(d) { return d.value; });

var data_ready = pie(d3.entries(data))

var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

var svg2 = d3.select("body").append("svg")
    .attr("width", width2)
    .attr("height", height2)
  .append("g")
    .attr("transform", "translate(" + width2 / 2 + "," + height2 / 2 + ")");

  var g = svg2.selectAll(".arc")
      .data(data_ready)
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .attr("stroke", "black")
      .style("stroke-width", "1.5px")
      .style("opacity", 0.8)
      .style("fill", function(d) { return color2(d.data.key); })
      .on("mouseover", function(d) {
           tooltip.transition()
             .duration(200)
             .style("opacity", .9);
           tooltip.html("<strong>" + "<u>" + d.data.key + "</u>" + "</strong>" + "<br>" + "<span style='float:left'>" + "# of NBA Players" + "</span>" + ":" + "<span style='float:right'>" +  d.data.value + "</span>" + "<br>" + "<span style='float:left'>" + "Avg Minutes" + "</span>" + ":" + "<span style='float:right'>" +  0 + "</span>" + "<br>" + "<span style='float:left'>" + "Total Income" + "</span>" + ":" + "<span style='float:right'>" + "$" + 0 + "</span>") 
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY - 28) + "px");
           })
    .on("mouseout", function(d) {
           tooltip.transition()
             .duration(500)
             .style("opacity", 0);
           });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size", 17)
      .text(function(d) { return d.data.key;});
