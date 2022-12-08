
// Set the dimensions of the canvas / graph
var margin = {top: 50, right: 120, bottom: 100, left: 80},
    width = 950 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    
// Adds the svg canvas
var graph = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");


var color3 = d3.scaleOrdinal(["#a28f3e",
"#7964cc",
"#75b140",
"#c24dad",
"#52aa7e",
"#d8405c",
"#608ccb",
"#cc6d3a",
"#c684c3",
"#bb5e73"]);

var grayC = "FAKE"
var pStatus = 0;
var mStatus = 0;
var sStatus = 0;


function grayout(country) {
    grayC = country;
    if (mStatus) {
        mFunc();
    } else if (sStatus){
        sFunc();
    }else {
        pFunc();
    }
}

function compare(sub, c){
    if (grayC.localeCompare(sub) && grayC.localeCompare("FAKE")){
         return "#e7e7e7";
    } else {
      return c;
    }
}

function colorReset(){
    grayC = "FAKE"
    if (mStatus) {
        mFunc();
    } else if (sStatus){
        sFunc();
    }else {
        pFunc();
    }
}

// Parse the date / time
var parseTime = d3.timeParse("%Y");

// Set the ranges of x-y scales
var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

// Define x-y axis
var xAxis = d3.axisBottom(x).ticks(12);
var yAxis = d3.axisLeft(y).ticks(5);

// Define the line
var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.amount); });

// x grid lines
function gridXaxis() {
    return d3.axisBottom(x).ticks(5);
}

// y grid lines
function gridYaxis() {
  return d3.axisLeft(y).ticks(5);

}

// Get the data
d3.csv("players-timeline.csv", type, function(error, data) {
    if (error) throw error;
    var countries = data.columns.slice(1).map(function(id) {
        return {
          id: id,
          values: data.map(function(d) {
            return {year: d.year, amount: d[id]};
          })
        };
    });

    
 // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([
        d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.amount; }); }),
        d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.amount; }); })
    ]);
    z.domain(countries.map(function(c) { return c.id; }));

// Draw the x Grid lines
    graph.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(gridXaxis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

    // Draw the y Grid lines
    graph.append("g")            
        .attr("class", "grid")
        .call(gridYaxis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    // Add the valueline path.

    // Add the X Axis
    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", 780)
        .attr("y", 5)     
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Year");

    // Add the Y Axis
    graph.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -120)
        .attr("y", -60)     
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Number of NBA Players per Country");
    
    var country = graph.selectAll(".country")
        .data(countries)
        .enter().append("g")
          .attr("class", "country");
    
    var path = country.append("path")
        .attr("class", "line")
        .attr("d", function(d) {  return line(d.values); })
        .style("stroke", function(d) { return color3(d.id); })
    var pathLength = path.node().getTotalLength();
        path
        .attr("stroke-dasharray", pathLength + " " + pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
            .duration(4000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    
    country.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.amount) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .style("stroke", function(d) { return compare(d.id,color3(d.id));})
        .text(function(d) { return d.id; });
});

function type(d, _, columns) {
  d.year = parseTime(d.year);
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}

var pButton = d3.select("#pButton")
        .on("click", pFunc)
function pFunc(){
    pStatus = 1;
    mStatus = 0;
    sStatus = 0;
    graph.selectAll("*").remove();
    d3.csv("players-timeline.csv", type, function(error, data) {
    if (error) throw error;
    var countries = data.columns.slice(1).map(function(id) {
        return {
          id: id,
          values: data.map(function(d) {
            return {year: d.year, amount: d[id]};
          })
        };
    });

    
 // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([
        d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.amount; }); }),
        d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.amount; }); })
    ]);
    z.domain(countries.map(function(c) { return c.id; }));

// Draw the x Grid lines
    graph.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(gridXaxis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

    // Draw the y Grid lines
    graph.append("g")            
        .attr("class", "grid")
        .call(gridYaxis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    // Add the valueline path.

    // Add the X Axis
    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", 780)
        .attr("y", 5)     
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Year");

    // Add the Y Axis
    graph.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -120)
        .attr("y", -60)     
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Number of NBA Players per Country");
    
    var country = graph.selectAll(".country")
        .data(countries)
        .enter().append("g")
          .attr("class", "country");
    
    var path = country.append("path")
        .attr("class", "line")
        .attr("d", function(d) {  return line(d.values); })
        .style("stroke", function(d) { return compare(d.id,color3(d.id));})
    
    var pathLength = path.node().getTotalLength();
        path
        .attr("stroke-dasharray", pathLength + " " + pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
            .duration(4000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    
    country.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.amount) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .style("stroke", function(d) { return compare(d.id,color3(d.id));})
        .text(function(d) { return d.id; });
});
}

var mButton = d3.select("#mButton")
        .on("click", mFunc)
function mFunc(){
    pStatus = 0;
    mStatus = 1;
    sStatus = 0;
    graph.selectAll("*").remove();
    d3.csv("minutes-timeline.csv", type, function(error, data) {
    if (error) throw error;
    var countries = data.columns.slice(1).map(function(id) {
        return {
          id: id,
          values: data.map(function(d) {
            return {year: d.year, amount: d[id]};
          })
        };
    });

    
 // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([
        d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.amount; }); }),
        d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.amount; }); })
    ]);
    z.domain(countries.map(function(c) { return c.id; }));

// Draw the x Grid lines
    graph.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(gridXaxis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

    // Draw the y Grid lines
    graph.append("g")            
        .attr("class", "grid")
        .call(gridYaxis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    // Add the valueline path.

    // Add the X Axis
    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", 780)
        .attr("y", 5)     
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Year");

    // Add the Y Axis
    graph.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -120)
        .attr("y", -60)     
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Average Minutes Played per Country (MPG)");
    
    var country = graph.selectAll(".country")
        .data(countries)
        .enter().append("g")
          .attr("class", "country");
    
    var path = country.append("path")
        .attr("class", "line")
        .attr("d", function(d) {  return line(d.values); })
        .style("stroke", function(d) { return compare(d.id,color3(d.id)); })
    
    var pathLength = path.node().getTotalLength();
        path
        .attr("stroke-dasharray", pathLength + " " + pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
            .duration(4000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    
    country.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.amount) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .style("stroke", function(d) { return compare(d.id,color3(d.id));})
        .text(function(d) { return d.id; });
});
}

var sButton = d3.select("#sButton")
        .on("click", sFunc)
function sFunc(){
    pStatus = 0;
    mStatus = 0;
    sStatus = 1;
    graph.selectAll("*").remove();
    d3.csv("salaries-timeline.csv", type, function(error, data) {
    if (error) throw error;
    var countries = data.columns.slice(1).map(function(id) {
        return {
          id: id,
          values: data.map(function(d) {
            return {year: d.year, amount: d[id]};
          })
        };
    });

    
 // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year; }));
    y.domain([
        d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.amount; }); }),
        d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.amount; }); })
    ]);
    z.domain(countries.map(function(c) { return c.id; }));

// Draw the x Grid lines
    graph.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(gridXaxis()
            .tickSize(-height, 0, 0)
            .tickFormat("")
        )

    // Draw the y Grid lines
    graph.append("g")            
        .attr("class", "grid")
        .call(gridYaxis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
        )

    // Add the valueline path.

    // Add the X Axis
    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("x", 780)
        .attr("y", 5)     
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Year");

    // Add the Y Axis
    graph.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -120)
        .attr("y", -80)     
        .attr("dy", "0.71em")
        .attr("fill", "#000")
        .text("Total NBA Income per Country ($)");
    
    var country = graph.selectAll(".country")
        .data(countries)
        .enter().append("g")
          .attr("class", "country");
    
    var path = country.append("path")
        .attr("class", "line")
        .attr("d", function(d) {  return line(d.values); })
        .style("stroke", function(d) { return compare(d.id,color3(d.id)); })
    
    var pathLength = path.node().getTotalLength();
        path
        .attr("stroke-dasharray", pathLength + " " + pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
            .duration(4000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    
    country.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.amount) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .style("stroke", function(d) { return compare(d.id,color3(d.id));})
        .text(function(d) { return d.id; });
});
}
