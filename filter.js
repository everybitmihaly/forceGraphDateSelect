
function filterWithWeights(data, minDate, maxDate) {
    
    const allNodeOcc = [];
    const filteredLinks = [];

    for (let link of data.links) {
        if (link.date >= minDate && link.date <= maxDate) {
            
            let source = parseInt(link.source)
            let target = parseInt(link.target)

            allNodeOcc.push(source)
            allNodeOcc.push(target)

            filteredLinks.push(link)
            
        }
    }

    const countsNode = allNodeOcc.reduce((accum, x) => {
        accum[x] = accum[x] ? accum[x] + 1 : 1;
        return accum;
      }, {});

    let minRange = 5;
    let maxRange = 15;
    let minVal = Math.min(...Object.values(countsNode));
    let maxVal = Math.max(...Object.values(countsNode));

    if (minVal === maxVal) {
        maxVal = minVal+1
    }

    const filteredNodesArray = []
    for (const [node_name, node_count] of Object.entries(countsNode)) {   
        filteredNodesArray.push({id: parseInt(node_name), group: 1, value: minRange + ((node_count - minVal) / (maxVal - minVal)) * (maxRange - minRange)})
        
    }
    console.log(countsNode, filteredNodesArray)
    const returnValue = {nodes: filteredNodesArray, 
                         links: filteredLinks}
    return returnValue
}

function filter(data, minDate, maxDate) {
    const filteredNodes = new Set()
    const filteredLinks = []
    for (let link of data.links) {
        if (link.date >= minDate && link.date <= maxDate) {
            filteredNodes.add(link.source)
            filteredNodes.add(link.target)
            filteredLinks.push(link)
            
        }
    }
    const filteredNodesArray = []
    for (let node_name of filteredNodes) {
        filteredNodesArray.push({id: node_name, group: 1})
        
    }

    const returnValue = {nodes: filteredNodesArray, 
                         links: filteredLinks}
    console.log('B', returnValue)
    return returnValue
}