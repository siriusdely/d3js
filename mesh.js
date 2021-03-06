var svg = d3.select('svg');

d3.json('https://d3js.org/us-10m.v1.json', function(error, us) {
  if (error) { throw error; }

  var path = d3.geoPath(),
    mesh = topojson.mesh(us),
    transform = topojson.transform(us);

  svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-width', 0.25)
    .attr('stroke-linejoin', 'round')
    .attr('d', path(mesh));

  svg.selectAll('circle')
  .data(us.arcs)
  .enter().append('circle')
  .attr('transform', function(d) {
    return 'translate(' + transform(d[0]) + ')';
  })
  .attr('r', 1.25);
});
