const graph_data = {
    "nodes": [
        {id: "Napoleon", group: 1, node_radius: 5},
        {id: "Louis", group: 2, node_radius: 10},
        {id: "Ferdinand", group: 3, node_radius: 20},
        {id: "Charles", group: 4, node_radius: 15}
    ],
    "links": [
        {source: "Napoleon", target: "Louis", value: 3},
        {source: "Napoleon", target: "Ferdinand", value: 1},
        {source: "Louis", target: "Ferdinand", value: 1},
        {source: "Charles", target: "Ferdinand", value: 1},
        {source: "Charles", target: "Louis", value: 1}
    ]
}

const parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%S%Z");

const height = 600;
const width = 600;

const svg = d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");


d3.json('hashed1000.json').then(function(data) { 
    // convert dates to Dates
    const converted_links = []
    let minDate = new Date()
    let maxDate = new Date()
    for (let link of data.links) {
        let date = parseTime(link.date)

        if (date < minDate) {
            minDate = date
        }

        if (date > maxDate) {
            maxDate = date
        }
        
        converted_links.push({'source': link.source, 'target': link.target,
                              'date': date, 'value': link.value})
    }
    data.links = converted_links
    
    dateSlider(minDate, maxDate, data)

    // let chart = ForceGraph(graph_data, {
    //     nodeId: d => d.id,
    //     nodeGroup: d => d.group,
    //     nodeTitle: d => d.id,
    //     // nodeRadius: d => d.node_radius,
    //     // linkStrokeWidth: l => Math.sqrt(l.value),
    //     // linkStrength: 0.05,
    //     width: 2000,
    //     height: 2000,
    //     // invalidation // a promise to stop the simulation when the cell is re-run
    // })

    // const chartDiv = d3.select("#my_dataviz")
    // chartDiv.node().appendChild(chart.chart)



    
})

