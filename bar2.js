var w = 150, h = 105;
var m = 30;

var svg = d3.select('#chart')
  .append('svg')
  .attr('width', w)
  .attr('height', h)

var xAxisLength = 100,
  yAxisLength = 100;

d3.csv('data/rat-data.csv', function(d) {
  return {
    city: d.city,
    rats: +d.rats
  };
}, function(error, rows) {
  createVisualization(rows);
});

function createVisualization(data) {

  var dataLength = data.length;
  var maxValue = d3.max(data, function(d) {
    return +d.rats;
  });

  var yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, yAxisLength]);

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
      return i * (xAxisLength / dataLength) + m;
    })
    .attr('y', function(d) {
      return h - yScale(d.rats) - 5;
    })
    .attr('width', (xAxisLength / dataLength) - 1)
    .attr('height', function(d) {
      return yScale(d.rats);
    })
    .attr('fill', 'steelblue')
    .on('mouseover', function(d) {
      return tooltip.style('visibility', 'visible')
        .text(d.city + ': ' + d.rats);
    })
    .on('mousemove', function(d) {
      return tooltip.style('top', (d3.event.pageY - 10) + 'px')
        .style('left', (d3.event.pageX + 10) + 'px')
        .text(d.city + ': ' + d.rats);
    })
    .on('mouseout', function(d) {
      return tooltip.style('visibility', 'hidden');
    });

  svg.append('line')
    .attr('x1', m)
    .attr('y1', 0)
    .attr('x2', m)
    .attr('y2', yAxisLength)
    .attr('stroke-width', 2)
    .attr('stroke', 'black');

  svg.append('line')
    .attr('x1', m)
    .attr('y1', yAxisLength)
    .attr('x2', xAxisLength + m)
    .attr('y2', yAxisLength)
    .attr('stroke-width', 2)
    .attr('stroke', 'black');

  svg.append('text')
    .attr('class', 'y label')
    .attr('text-anchor', 'end')
    .attr('transform', 'translate(20, 20) rotate(-90)')
    .text('No. of Rats');

  var tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('font-family', "'Open Sans', sans-serif")
    .style('font-size', '12px')
    .style('z-index', '10')
    .style('visibility', 'hidden');

}

function updateData(data) {
  var maxValue = d3.max(data, function(d) {
    return +d.rats;
  });

  var yScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, yAxisLength]);

  svg.selectAll('rect')
    .data(data)
    .transition()
    .attr('y', function(d) {
      return h - yScale(d.rats) - 5;
    })
    .attr('height', function(d) {
      return yScale(d.rats);
    })
  /*
  svg.selectAll('rect')
    .on('mouseover', function(d) {
      return tooltip.style('visibility', 'visible')
        .text(d.city + ': ' + d.rats);
    })
    .on('mousemove', function(d) {
      return tooltip.style('top', (d3.event.pageY - 10) + 'px')
        .style('left', (d3.event.pageX + 10) + 'px')
        .text(d.city + ': ' + d.rats);
    })
    .on('mouseout', function(d) {
      return tooltip.style('visibility', 'hidden');
    });
  */
}

d3.select('#start').on('click', function() {
  d3.csv('data/rat-data-v2.csv', function(d) {
    return {
      city: d.city,
      rats: d.rats
    };
  }, function(error, rows) {
    updateData(rows);
  });
});

d3.select('#reset').on('click', function() {
  d3.csv('data/rat-data.csv', function(d) {
    return {
      city: d.city,
      rats: d.rats
    };
  }, function(error, rows) {
    updateData(rows);
  });
});

