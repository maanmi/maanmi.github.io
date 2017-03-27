(function() {
var margin = {top: 20, right: 60, bottom: 60, left: 60},
    width = 960 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var main = d3.select("body")
    .append("div")
      .style("width", width + margin.left + margin.right + "px")
      .style("margin", "0 auto")

main.append("h2")
  .text("Assignment 2A: SF Incidents")

var year = '2015'

var switcher = main.append("p")
  .text("Loading data..")
  .style("color", "blue")
  .style("text-decoration", "underline")
  .style("cursor", "pointer")

var svg = main.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

main.append("p").html("<b>Figure 2A:</b> Scatter plot of the number of prostitution \
incidents (on x-axis) and vehicle theft incidents (on y-axis) reported by SFPD. \
Area of each circle corresponds to the total number of crimes. \
Each axis is fixed on the common data to make comparisons easier and not misleading.")

<!-- Axes -->

//We always go from 0, since the values can't be negative
var xScale = d3.scale.linear().range([0, width]);
var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var yScale = d3.scale.linear().range([height, 0]);
var yAxis = d3.svg.axis().scale(yScale).orient("left");

var rScale = d3.scale.linear().range([0, 10]);
var cScale = d3.scale.category20();

<!-- -->

d3.csv("assignment2a.csv", function(error, data) {
  // "Typecast" numbers
  data.forEach(function(d, i) {
    var numeric_fields = [
      'Total 2013', 'Total 2015',
      'Prostitution 2013', 'Prostitution 2015',
      'Vehicle theft 2013', 'Vehicle theft 2015',
    ]
    for (var f = 0; f < numeric_fields.length; f++)
      d[numeric_fields[f]] = +d[numeric_fields[f]];

    d.i = i;
  });

  console.log(data);

  var xMax2013 = d3.max(data, function(d){ return d["Prostitution 2013"] });
  var xMax2015 = d3.max(data, function(d){ return d["Prostitution 2015"] });

  var yMax2013 = d3.max(data, function(d){ return d["Vehicle theft 2013"] });
  var yMax2015 = d3.max(data, function(d){ return d["Vehicle theft 2015"] });

  var rMax2013 = d3.max(data, function(d){ return d["Total 2013"] });
  var rMax2015 = d3.max(data, function(d){ return d["Total 2015"] });

  xScale.domain([0, d3.max([xMax2015, xMax2013])]);
  yScale.domain([0, d3.max([yMax2015, yMax2013])]);
  rScale.domain([0, Math.sqrt(d3.max([rMax2015, rMax2013]) / (2 * Math.PI))]);

  // Draw x-axis with label
  svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
     .append("text")
        .attr("class", "label")
        .attr("x", width/2)
        .attr("y", margin.bottom - 30)
        .style("text-anchor", "middle")
        .text("Prostitution incidents");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -45)
      .attr("dy", ".71em")
      .attr("x", -height/2)
      .style("text-anchor", "middle")
      .text("Vehicle theft incidents");

  var dotGroups = svg.selectAll(".dot")
      .data(data)
    .enter()
      .append("g")
      .attr("class", "dot")

  var circles = dotGroups.append("circle")
      .attr("r", 4)
      .style("fill", function(d){ return cScale(d.i) });

  dotGroups.append("text")
    .attr("transform", "translate(7, -7)")
    .text(function(d){ return d["District"] })
    .style("fill", function(d){ return cScale(d.i) });

  function draw() {
    getXValue = function(d) { return d['Prostitution ' + year]}
    getYValue = function(d) { return d['Vehicle theft ' + year]}
    getRValue = function(d) { return Math.sqrt(d['Total ' + year] / (2 * Math.PI))}

    dotGroups.transition()
      .attr("transform", function(d){
        var dx = xScale(getXValue(d));
        var dy = yScale(getYValue(d));
        return "translate(" + dx + "," + dy + ")"
      })

    circles.transition()
      .attr("r", function(d){ return rScale(getRValue(d))});

    year = (year == "2013" ? "2015" : "2013");
    switcher.text("Load " + year + " data");
  }

  draw();

  switcher.on("click", draw);

});

<!-- -->

})()