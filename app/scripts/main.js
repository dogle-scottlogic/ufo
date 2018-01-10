const width = 960,
    height = 600;

const state = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'DC': 'District of Columbia',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
};

const getStateName = (stateCode) => state[stateCode.toUpperCase()];  

const path = d3.geo.path().projection(null);

const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

const svg = d3.select('#chart').append('svg')
    .attr('width', width)
    .attr('height', height);

d3.json('scripts/states.json', (error, us) => {
    if (error) return console.error(error);

    svg.append('path')
        .datum(topojson.mesh(us))
        .attr('class', 'land')
        .attr('d', path);

    svg.append('path')
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr('class', 'border border--state')
        .attr('d', path);

    const radius = d3.scale.sqrt()
        .domain([0, 10000])
        .range([0, 50]);

    const elm = svg.append('g')
        .attr('class', 'bubble')
        .selectAll('g')
        .data(topojson.feature(us, us.objects.states).features
            .sort((a, b) => b.properties.sightings - a.properties.sightings));

    const showtooltip = (d, i, s) => {
        tooltip.transition()
            .duration(200)
            .style('opacity', 1);
        tooltip.html('<ul><li><strong>State: ' + getStateName(d.properties.name) + '</strong></li><li>Number of sightings: ' + d.properties.sightings + '</li></ul>');
    };

    const hidetooltip = (d, i, s) => {
        tooltip.transition()
            .duration(200)
            .style('opacity', 0);
    };

    const enterElm = elm.enter()
        .append('g')
        .attr('transform', (d) => 'translate(' + path.centroid(d) + ')')
        .on('mouseover', showtooltip)
        .on('mouseleave', hidetooltip);


    const circle = enterElm.append('circle')
        .attr('r', (d) => d.properties.sightings ? radius(d.properties.sightings) : 0)
        .on('mouseover', function (d, i) {
            d3.select(this).attr({
                fill: '#0000ff'
            });
        })
        .on('mouseleave', function (d, i) {
            d3.select(this).attr({
                fill: '#18cf27'
            });
        });

    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (width - 50) + ',' + (height - 20) + ')')
        .selectAll('g')
        .data([100, 1000, 5000, 10000])
        .enter().append('g');

    legend.append('circle')
        .attr('cy', (d) => -radius(d))
        .attr('r', radius);

    legend.append('text')
        .attr('y', (d) => (-2 * radius(d)))
        .attr('dy', '1.3em')
        .text(d3.format('.1s'));
});