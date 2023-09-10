// slider code from: https://observablehq.com/@sarah37/snapping-range-slider-with-d3-brush
const layout = ({
    width: 800,
    height: 300,
    margin: {
      top: 130,
      bottom: 135,
      left: 40,
      right: 40
    }
  })

const dateFormat = d3.timeFormat("%Y-%m-%d");
// const startDate = new Date("2000-01-01");
// const endDate = new Date("2022-12-31");

function dateSlider(startDate, endDate, data, graphSvg) {
    let min = 1
    let max = 100
    let starting_min=min 
    let starting_max=max
    var range = [min, max]
    var starting_range = [starting_min, starting_max]
  
    // set width and height of svg
    var w = layout.width
    var h = layout.height
    var margin = layout.margin
  
    // dimensions of slider bar
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;
  
    // create x scale
    // var x = d3.scaleLinear()
    //   .domain(range)  // data space
    //   .range([0, width]);  // display space
    
    var x = d3.scaleTime()
      .domain([startDate, endDate])  // data space
      .range([0, width]);  // display space

    // create svg and translated g
    var svg = d3.select("#slider").append("svg").attr('height', 2000).attr('width', 2000)
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
    
    // labels
    var labelL = g.append('text')
      .attr('id', 'labelleft')
      .attr('x', 0)
      .attr('y', height + 5)
  
    var labelR = g.append('text')
      .attr('id', 'labelright')
      .attr('x', 0)
      .attr('y', height + 5)
  
    let eventHandler = document.querySelector('#eventhandler')

    // define brush
    var brush = d3.brushX()
      .extent([[0,0], [width, height]])
      .on('brush', function(event) {
        var s = event.selection;
        let labelLdate = x.invert(s[0])
        let labelRdate = x.invert(s[1])
        // // update and move labels
        // labelL.attr('x', s[0])
        //   .text((x.invert(s[0]).toFixed(2)))
        // labelR.attr('x', s[1])
        //   .text((x.invert(s[1]).toFixed(2)))
        // update and move labels
        labelL.attr('x', s[0]) // 
        .text((dateFormat(labelLdate)))
        labelR.attr('x', s[1])
        .text((dateFormat(labelRdate)))
        // move brush handles      
        handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - height / 4] + ")"; });
        svg.node().value = s.map(function(d) {var temp = x.invert(d); return +temp});
        svg.node().dispatchEvent(new Event("input"));
        
        const filteredData = filter(data, labelLdate, labelRdate)
        console.log('THIS', filteredData)

        const graph = ForceGraph(filteredData)

        const chartDiv = d3.select("#chart")
        chartDiv.selectAll('*').remove()
        chartDiv.node().appendChild(graph)

      })
    
    


    // append brush to g
    var gBrush = g.append("g")
        .attr("class", "brush")
        .call(brush)
  
    // add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
    var brushResizePath = function(d) {
        var e = +(d.type == "e"),
            x = e ? 1 : -1,
            y = height / 2;
        return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
          "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
          "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
    }
  
    var handle = gBrush.selectAll(".handle--custom")
      .data([{type: "w"}, {type: "e"}])
      .enter().append("path")
      .attr("class", "handle--custom")
      .attr("stroke", "#000")
      .attr("fill", '#eee')
      .attr("cursor", "ew-resize")
      .attr("d", brushResizePath);
      
    // override default behaviour - clicking outside of the selected area 
    // will select a small piece there rather than deselecting everything
    // https://bl.ocks.org/mbostock/6498000
    gBrush.selectAll(".overlay")
      .each(function(d) { d.type = "selection"; })
      .on("mousedown touchstart", brushcentered)
    
    function brushcentered(event) {
      var dx = x(1) - x(0), // Use a fixed width when recentering.
      cx = d3.pointer(event, this)[0],
      x0 = cx - dx / 2,
      x1 = cx + dx / 2;
      d3.select(this.parentNode).call(brush.move, x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]);
    }
    
    // select entire range
    gBrush.call(brush.move, starting_range.map(x))
    
    const getRange = function() { var range = d3.brushSelection(gBrush.node()).map(d => Math.round(x.invert(d))); return range }
    return {getRange: getRange}
    // return svg.node()

    
  }



// // set the dimensions and margins of the graph
// const margin = {top: 10, right: 30, bottom: 30, left: 40},
//   width = 400 - margin.left - margin.right,
//   height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// const svg = d3.select("#my_dataviz")
// .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
// .append("g")
//   .attr("transform",
//         `translate(${margin.left}, ${margin.top})`);

// d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json").then( function( data) {

//   // Initialize the links
//   const link = svg
//     .selectAll("line")
//     .data(data.links)
//     .join("line")
//       .style("stroke", "#aaa")

//   // Initialize the nodes
//   const node = svg
//     .selectAll("circle")
//     .data(data.nodes)
//     .join("circle")
//     .attr("r", 20)
//     .style("fill", "#69b3a2")

//   // Let's list the force we wanna apply on the network
//   const simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
//       .force("link", d3.forceLink()                               // This force provides links between nodes
//             .id(function(d) { return d.id; })                     // This provide  the id of a node
//             .links(data.links)                                    // and this the list of links
//       )
//       .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
//       .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
//       .on("end", ticked);

//   // This function is run at each iteration of the force algorithm, updating the nodes position.
//   function ticked() {
//     link
//         .attr("x1", function(d) { return d.source.x; })
//         .attr("y1", function(d) { return d.source.y; })
//         .attr("x2", function(d) { return d.target.x; })
//         .attr("y2", function(d) { return d.target.y; });

//     node
//          .attr("cx", function (d) { return d.x+6; })
//          .attr("cy", function(d) { return d.y-6; });
//   }

// });

// const nodeSize = d3.select('.size_selector')
// nodeSize.on('change', function() {
//     const node = svg
//         .selectAll("circle")
//         .attr("r", nodeSize.node().value)
// })