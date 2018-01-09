var width = 960,
    height = 600;

var path = d3.geo.path().projection(null);

var svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height);

d3.json("scripts/states.json", function (error, us) {
    if (error) return console.error(error);

    svg.append("path")
        .datum(topojson.mesh(us))
        .attr("class", "land")
        .attr("d", path);

    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function (a, b) {
            return a !== b;
        }))
        .attr("class", "border border--state")
        .attr("d", path);

    var radius = d3.scale.sqrt()
        .domain([0, 1e6])
        .range([0, 500]);

    svg.append("g")
        .attr("class", "bubble")
        .selectAll("circle")
        .data(topojson.feature(us, us.objects.states).features
            .sort((a, b) => b.properties.sightings - a.properties.sightings))
        .enter().append("circle")
        .attr("transform", function (d) {
            return "translate(" + path.centroid(d) + ")";
        })
        .attr("r", function (d) {
            
            return d.properties.sightings ? radius(d.properties.sightings) : 0;
        });
    
    // var legend = svg.append("g")
    //     .attr("class", "legend")
    //     .attr("transform", "translate(" + (width - 50) + "," + (height - 20) + ")")
    //     .selectAll("g")
    //     .data([1e6, 3e6, 6e6])
    //     .enter().append("g");

    // legend.append("circle")
    //     .attr("cy", function (d) { return -radius(d); })
    //     .attr("r", radius);

    // legend.append("text")
    //     .attr("y", function (d) { return -2 * radius(d); })
    //     .attr("dy", "1.3em")
    //     .text(d3.format(".1s"));
});