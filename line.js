var margin = { top: 60, right: 20, bottom: 30, left: 50 },
  width = 700 - margin.left - margin.right,
  height = 365 - margin.top - margin.bottom;

var parseDate = d3.time.format('%b %Y').parse,
  // Adjust parsing of data to properly show tooltip
  bisectDate = d3.bisector(function(d) {
    return d.date;
  }).left,
  formatValue = d3.format(',.2f'),
  formatCurrency = function(d) {
    return formatValue(d) + '%';
  };

var x = d3.time.scale()
  .range([0, width]);

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom');

var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left');

var line = d3.svg.line()
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.rate);
  });

var svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.csv('data/unemployment_2005_2015.csv', function(err, data) {
  if (err) { throw err; }
  console.log(data);

  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.rate = +d.rate;
  });

  x.domain(d3.extent(data, function(d) {
    return d.date;
  }));

  y.domain(d3.extent(data, function(d) {
    return d.rate;
  }));

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('Unemployment Rate (%)');

  // Start Animation on Click
  d3.select('#start').on('click', function() {
    var path = svg.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line);

    // Variable to Hold Total Length
    var totalLength = path.node().getTotalLength();

    // Set Properties of Dash Array and Dash Offset and initiate Transition
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition() // Call transition method
      .duration(4000) // Set Duration timing (ms)
      .ease('linear') // Set Easing option
      .attr('stroke-dashoffset', 0); // Set final value of dash-offset for transition

    // Create SVG for Tooltip and Circle on Mouseover
    var focus = svg.append('g')
    .attr('class', 'focus')
    .style('display', 'none');

    // Append circle to show on Mouseover
    focus.append('circle')
    .attr('r', 4.5);

    // Append text to show on Mouseover
    focus.append('text')
    .attr('x', 9)
    .attr('dy', '.35em');

    // Append overlay rectangle as container for Circle and Tooltips
    // that allows user to hover anywhere on graphic
    svg.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .on('mouseover', function() {
        focus.style('display', null);
      })
      .on('mouseout', function() {
        focus.style('display', 'none');
      })
      .on('mousemove', mousemove);

    // Mousemove function that sets location and changes properties of Focus SVG
    function mousemove() {
      var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;

      focus.attr('transform', 'translate(' + x(d.date) + ',' + y(d.rate) + ')');
      focus.select('text').text(formatCurrency(d.rate));
    }
  });

  // Reset Animation
  d3.select('#reset').on('click', function() {
    d3.select('.line').remove();
  });

});
