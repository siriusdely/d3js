// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 235},
  width = 600 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format('%Y').parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
  .orient('bottom').ticks(5);

var yAxis = d3.svg.axis().scale(y)
  .orient('left').ticks(5);

// Define the lines
var valueline1 = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d['Age_Under18']); });

var valueline2 = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d['Age18_34']); });

var valueline3 = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d['Age35_64']); });

var valueline4 = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d['Age65_Over']); });

// Adds the svg canvas
var svg = d3.select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform',
    'translate(' + margin.left + ',' + margin.top + ')');

// Get the data
d3.csv('data/boston-data-transposed.csv', function(error, data) {
  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d['Age_Under18'] = +d['Age_Under18'];
    d['Age18_34'] = +d['Age18_34'];
    d['Age35_64'] = +d['Age35_64'];
    d['Age65_Over'] = +d['Age65_Over'];
  });

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d['Age18_34']; })]);

  // Add the valueline1 path.
  svg.append('path')
    .attr('class', 'line')
    .style('stroke', '#1f77b4')
    .attr('d', valueline1(data));

  // Add the scatterplot
  svg.selectAll('dot')
    .data(data)
    .enter().append('circle')
    .attr('r', 3.5)
    .attr('cx', function(d) { return x(d.date); })
    .attr('cy', function(d) { return y(d['Age_Under18']); });

  // Add the valueline2 path.
  svg.append('path')
    .attr('class', 'line')
    .style('stroke', '#ff7f0e')
    .attr('d', valueline2(data));

  // Add the scatterplot
  svg.selectAll('dot')
    .data(data)
    .enter().append('circle')
    .attr('r', 3.5)
    .attr('cx', function(d) { return x(d.date); })
    .attr('cy', function(d) { return y(d['Age18_34']); });

  // Add the valueline3 path.
  svg.append('path')
    .attr('class', 'line')
    .style('stroke', '#aec7e8')
    .attr('d', valueline3(data));

  // Add the scatterplot
  svg.selectAll('dot')
    .data(data)
    .enter().append('circle')
    .attr('r', 3.5)
    .attr('cx', function(d) { return x(d.date); })
    .attr('cy', function(d) { return y(d['Age35_64']); });

  // Add the valueline4 path.
  svg.append('path')
    .attr('class', 'line')
    .style('stroke', '#ffbb78')
    .attr('d', valueline4(data));

  // Add the scatterplot
  svg.selectAll('dot')
    .data(data)
    .enter().append('circle')
    .attr('r', 3.5)
    .attr('cx', function(d) { return x(d.date); })
    .attr('cy', function(d) { return y(d['Age65_Over']); });

  // Add the X Axis
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  // Add the Y Axis
  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);
});
