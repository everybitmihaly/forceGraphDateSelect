
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
    return returnValue
}