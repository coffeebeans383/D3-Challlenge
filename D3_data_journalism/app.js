// @TODO: YOUR CODE HERE!
var svgWidth = 780;
var svgHeight = 600;

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

//declare initial axes variables
var currentXAxis = "poverty"
var currentYAxis = "obesity"

//X xis scale functions for current selection
function xScale(healthData, currentXAxis) {
  //create scale
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[currentXAxis]) * 0.9,
      d3.max(healthData, d => d[currentXAxis]) * 1.1])
    .range([0, width]);

  return xLinearScale;
}

//X xis scale functions for current selection
function yScale(healthData, currentYAxis) {
  //create scale
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[currentYAxis]) * 0.9,
      d3.max(healthData, d => d[currentYAxis]) * 1.1])
    .range([height,0]);

  return yLinearScale;
}

//update circles with x axis label
function xrenderCircles(circlesGroup, newXScale, currentXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[currentXAxis]))
    .attr("cy", d => newYScale(d[currentYAxis]));

  return circlesGroup;
}

//update circles with y-axis label
function yrenderCircles(circlesGroup, newYScale, currentYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[currentXAxis]))
    .attr("cy", d => newYScale(d[currentYAxis]));

  return circlesGroup;
}


//update individual circle state abbr labels with x axis labels
function xrenderLabels(abbrsGroup, newXScale, currentXAxis) {

  abbrsGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[currentXAxis]))
    .attr("y", d => newYScale(d[currentYAxis]));

  return abbrsGroup;
}

//update y individual circle state abbr labels with y axis labells
function yrenderLabels(abbrsGroup, newYScale, currentYAxis) {

  abbrsGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[currentXAxis]))
    .attr("y", d => newYScale(d[currentYAxis]));

  return abbrsGroup;
}
  //function to update x axis variable with event click
function xrenderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
    }
  //function to update y axis variable with event click
  function yrenderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    xAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
      }
// function used for updating circles group with new tooltip
function updateToolTip(currentXAxis, currentYAxis, circlesGroup) {

  var label;

  if (currentXAxis === "age") {
    label = "Age (Median)";
  }
  else if (currentXAxis === "income") {
    label = "Income (Median):"
  }
  else if (currentXAxis === "poverty") {
    label = "In Poverty:";
  }
  else if(currentYAxis === "obesity"){
    label = "Obesity Rate:";
  }
  else if(currentYAxis === "healthcare"){
    label = "% with Healthcare:";
  }
  else {
    label = "% Smokes:";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${label} ${d[currentYAxis]}<br>${label} ${d[currentXAxis]}`);
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

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, currentXAxis);
  // yLinearScale function above csv import
  var yLinearScale = yScale(healthData, currentYAxis);
  
  // function YScale(healthData, currentYAxis)
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(healthData, d => d.obesity)])
  //   .range([height, 0]);

  //Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xAxis = chartGroup.append("g")
    .classed("aText", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  //Append Axes to the chart
  //append x axis
  // chartGroup.append("g")
  //   .attr("transform", `translate(0, ${height})`)
  //   .call(bottomAxis);
  //append y axis
  var yAxis = chartGroup.append("g")
    .classed("aText", true)
    .attr("transform", `translate(0,0)`)
    .call(leftAxis);

  // append Circle

  var circlesGroup = chartGroup
    .selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[currentXAxis]))
    .attr("cy", d => yLinearScale(d[currentYAxis]))
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
    .attr("y", d => (yLinearScale(d[currentYAxis]) + 5))
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
      return (`<br>x: ${d[currentXAxis]}<br>y: ${d[currentYAxis]}`);
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

  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 30})`)
    .attr("class", "aText");

  //  // updateToolTip function above csv import
  var povLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty Rate");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Income (Median)");


  //append y axis
  var yLabelsGroup = chartGroup.append("g")
  .attr("class", "aText")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em");

  var obesityLabel = yLabelsGroup
  .append("text")
  .attr("y", 0 - margin.left + 20)
  .attr("x", 0 - (height / 2))
  .text("Obese(%)"); 

  var healthcareLabel = yLabelsGroup.append("text")
  .attr("y", 0 - margin.left + 40)
  .attr("x", 0 - (height / 2))
  .text("Healthcare(%)"); 

  var smokeLabel = yLabelsGroup.append("text")
  .attr("y", 0 - margin.left + 60)
  .attr("x", 0 - (height / 2))
  .text("Smokes(%)"); 

  var circlesGroup = updateToolTip(currentXAxis, circlesGroup);
  // x axis labels event listener
  xLabelsGroup.selectAll("text")
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
        xAxis = xrenderAxes(xLinearScale, xAxis);
        // updates circles with new x values
        circlesGroup = xrenderCircles(circlesGroup, xLinearScale, currentXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(currentXAxis, circlesGroup);

        //update circle label of state abbr.
        abbrsGroup = xrenderLabels(abbrsGroup, xLinearScale, currentXAxis);
        
       
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
  
    var circlesGroup = updateToolTip(currentYAxis, circlesGroup);
  // x axis labels event listener
  yLabelsGroup.selectAll("text")
    .on("click", function () {
      if (value !== currentYAxis) {
        // replaces currentYAxis with value
        currentYAxis = value;
        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(healthData, currentYAxis);
        // updates y axis with transition
        yAxis = yrenderAxes(yLinearScale, yAxis);
        // updates circles with new y values
        circlesGroup = yrenderCircles(circlesGroup, yLinearScale, currentYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(currentYAxis, circlesGroup);

        //update circle label of state abbr.
        abbrsGroup = yrenderLabels(abbrsGroup, yLinearScale, currentYAxis);

        // changes classes to change bold text
        if (currentYAxis === "obesity") {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          smokeLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else if (currentYAxis === "smokes") {
          smokeLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokeLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
}).catch(function (error) {
  console.log(error);
});
