var svgWidth = 700;
var svgHeight = 500;
var margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below

d3.csv("assets/data/data.csv").then(function (data) {
  data.forEach(function (data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
  });
  console.log(data);

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3
    .scaleLinear()
    .domain([6, d3.max(data, (d) => d.poverty+2)])
    .range([0, width]);
  var yLinearScale = d3
    .scaleLinear()
    .domain([28, d3.max(data, (d) => d.age+2)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  chartGroup.append("g").call(leftAxis);

  // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xLinearScale(d.poverty))
    .attr("cy", (d) => yLinearScale(d.age))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", "0.75");

// Add abbreviation labels to circles
    var circleLabels = chartGroup.selectAll(null).data(data).enter().append("text");
    circleLabels
    .attr("x", function(d) {
        return xLinearScale(d.poverty);
    })
    .attr("y", function(d) {
        return yLinearScale(d.age);
    })
    .text(function(d) {
        return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

  //Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      return `${d.state} <br>Poverty(%): ${d.poverty} <br>Age: ${d.age}`;
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  circlesGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup
    .on("mouseover", function (data) {
      toolTip.show(data);
    })

    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height-15) / 2)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("% Poverty");
  chartGroup
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
    .attr("class", "axisText")
    .text("Age");
  //   }).catch(function(error) {
  //     console.log(error);
});