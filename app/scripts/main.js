var width = 960,
    height = 600;

var path = d3.geo.path().projection(null);

var svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height);

d3.json('scripts/counties.json', (error, us) => {
    if (error) return console.error(error);

    svg.append('path')
        .datum(topojson.mesh(us))
        .attr('d', path);
});