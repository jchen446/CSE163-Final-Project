function rowConverter(data) {
    return { 
        country: data.country,
        amount: +data.amount,
        minutes: +data.minutes,
        salaries: +data.salaries
    }
}
 var getAngle = function (d) {
      return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
  };
var width2 = 450,
    height2 = 450,
    radius = Math.min(width2, height2) / 2;

var color2 = d3.scaleOrdinal(["#a28f3e",
"#7964cc",
"#75b140",
"#c24dad",
"#52aa7e",
"#d8405c",
"#608ccb",
"#cc6d3a",
"#c684c3",
"#bb5e73"]);

var arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(0);

var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);
    
var pie = d3.pie()
    .value(function(d) 
    { if(d.Amount > 0){
        return d.Amount
    }});

var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

var svg2 = d3.select("body").append("svg")
    .attr("width", width2)
    .attr("height", height2)
  .append("g")
    .attr("transform", "translate(" + width2 / 2 + "," + height2 / 2 + ")");


d3.csv("pie-data.csv", type, function(error, data) {
    if (error) throw error;
    rowConverter(data);

var g = svg2.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .attr("stroke", "black")
      .style("stroke-width", "1.5px")
      .style("opacity", 0.8)
    .style("fill", function(d) {
      if(d.data.Amount > 0){
          return color2(d.data.Amount)
      };})

      .on("mouseover", function(d) {
           tooltip.transition()
             .duration(200)
             .style("opacity", .9);
           tooltip.html("<strong>" + "<u>" + d.data.Country + "</u>" + "</strong>" + "<br>" + "<span style='float:left'>" + "# of NBA Players" + "</span>" + ":" + "<span style='float:right'>" +  d.data.Amount + "</span>" + "<br>" + "<span style='float:left'>" + "Avg Minutes" + "</span>" + ":" + "<span style='float:right'>" +  d.data.Minutes + "</span>" + "<br>" + "<span style='float:left'>" + "Total Income" + "</span>" + ":" + "<span style='float:right'>" + "$" + d.data.Salaries.toLocaleString()+ "</span>") 
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
      .style("font-size", function(d) { return (45 / (42/d.data.Amount)) } )
      .text(function(d) { return d.data.Country;});

});
