// @TODO: YOUR CODE HERE!

var svgWidth = 1180;
var svgHeight = 700;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom - 60;

// SVG wrapper, append SVG group
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// var abbrGroup = svg.append("g")
//   .attr("transform", function(d){return "translate("+d.x+",80)"});
var currentXAxis = "poverty"

//X xis scale functions for current selection
function xScale(healthData, currentXAxis) {
  //create scale
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[currentXAxis] * 0.9),
      d3.max(healthData, d => d[currentXAxis])])
    .range([0, width]);

  return xLinearScale;


}

//update circles
function renderCircles(circlesGroup, newXScale, currentXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[currentXAxis]));

  return circlesGroup;
}


//update circle labels
function renderLabels(abbrsGroup, newXScale, currentXAxis) {

  abbrsGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[currentXAxis]));

  return abbrsGroup;
}

  //function to update x axis variable with event click
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
    }

// function used for updating circles group with new tooltip
function updateToolTip(currentXAxis, circlesGroup) {

  var label;

  if (currentXAxis === "age") {
    label = "Age (Median):";
  }
  else if (currentXAxis === "income") {
    label = "Income (Median):"
  }
  else {
    label = "In Poverty(%):";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Obesity(%): ${d.obesity}<br>${label} ${d[currentXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Import Data
d3.csv("healthData.csv").then(function (healthData, err) {
  if (err) throw err;

  //Parse Data
  healthData.forEach(function (data) {
    data.obesity = +data.obesity;
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.age = +data.age;
    data.income = +data.income;

    // console.log(data);
  });
  var xLinearScale = xScale(healthData, currentXAxis);

  // function YScale(healthData, currentYAxis)
  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(healthData, d => d.obesity)])
    .range([height,0]);

  //Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  //Append Axes to the chart
  //append x axis
  // chartGroup.append("g")
  //   .attr("transform", `translate(0, ${height})`)
  //   .call(bottomAxis);
  //append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append Circle

  var circlesGroup = chartGroup
    .selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[currentXAxis]))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("class", "stateCircle")

  // Create Circle Label
  var abbrsGroup = chartGroup
    .selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .attr("class", "stateText")
    .attr("x", d => xLinearScale(d[currentXAxis]))
    .attr("y", d => (yLinearScale(d.obesity) + 5))
    .text(function (d) {
      return (`${d.abbr}`);
    });
  ;


  //code that didnt work
  //add text element to svg to create state abbr labels 
  // var taxtLabel = chartGroup
  //     .selectAll('text')
  //     .data(healthData)
  //     .enter()
  //     .append('text')
  //     .attr('x', function (d) {
  //       return xLinearScale(d.obesity);
  //     })
  //     .attr('y', function (d) {
  //       return yLinearScale(d.poverty);
  //     })return (`${d.abbr}`)
  //     .attr("class", "stateText")
  //     .html(function(d) { 
  //       ;
  //     })
  //     var text = circlesGroup
  //       .selectAll("text")
  //       .enter()
  //       .append("text")
  // //add label attributes
  //       .attr("class","stateText")
  //       .text( function (d) { 
  //      return (`${d.abbr}`);
  //       });

  //Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>${label} ${d.poverty}<br>${label} ${d.obesity}`);
    });

  //Create tooltip in the chart

  chartGroup.call(toolTip);

  //tooltip event listeners
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });


  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 30})`)
    .attr("class", "aText");

  //  // updateToolTip function above csv import
  var povLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty Rate");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income (Median)");


  //append y axis
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .attr("class", "aText")
  .text("Obesity Rate"); 

  var circlesGroup = updateToolTip(currentXAxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== currentXAxis) {

        // replaces currentXAxis with value
        currentXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, currentXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, currentXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(currentXAxis, circlesGroup);

        //update circle label of state abbr.
        abbrsGroup = renderLabels(abbrsGroup, xLinearScale, currentXAxis);

        // changes classes to change bold text
        if (currentXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else if (currentXAxis === "income") {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          povLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else {
          povLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
}).catch(function (error) {
  console.log(error);
});
