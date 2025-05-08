// Draw Kirby here!

const svg = d3.select("body")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500)


svg.append("ellipse")
    .attr("cx", 180)
    .attr("cy", 200)
    .attr("rx", 80)
    .attr("ry", 40)
    .attr("transform", "rotate(75 180 200)")
    .attr("class", "arm outlined");

    svg.append("ellipse")
    .attr("cx", 320)
    .attr("cy", 260)
    .attr("rx", 80)
    .attr("ry", 40)
    .attr("transform", "rotate(45 320 260)")
    .attr("class", "arm outlined");

svg.append("ellipse")
    .attr("cx", 220)
    .attr("cy", 320)
    .attr("rx", 80)
    .attr("ry", 40)
    .attr("transform", "rotate(-45 220 320)")
    .attr("class", "toe outlined");

svg.append("ellipse")
    .attr("cx", 270)
    .attr("cy", 320)
    .attr("rx", 80)
    .attr("ry", 40)
    .attr("transform", "rotate(45 270 320)")
    .attr("class", "toe outlined");

svg.append("circle")
    .attr('cx', 250)
    .attr('cy', 250)
    .attr('r', 100)
    .attr('class', 'body outlined')

svg.append("ellipse")
    .attr("cx", 210)
    .attr("cy", 230)
    .attr("rx", 10)
    .attr("ry", 20)
    .attr("class", "eye1");

svg.append("ellipse")
    .attr("cx", 290)
    .attr("cy", 230)
    .attr("rx", 10)
    .attr("ry", 20)
    .attr("class", "eye");

svg.append("ellipse")
    .attr("cx", 210)
    .attr("cy", 230)
    .attr("rx", 5)
    .attr("ry", 10)
    .attr("class", "eye2");

svg.append("ellipse")
    .attr("cx", 290)
    .attr("cy", 230)
    .attr("rx", 5)
    .attr("ry", 10)
    .attr("class", "eye2");

svg.append("polygon")
    .attr("points", "230,270 270,270, 250,290")
    .attr("class", "mouth outlined");


d3.xml("starrod.svg").then(data => {
    const importedNode = document.importNode(data.documentElement, true);
    const g = svg.append("g")
        .attr("transform", "translate(230,15) scale (0.4) rotate(75)");
    g.node().appendChild(importedNode);
    // svg.node().appendChild(importedNode);

    // d3.select(importedNode)
    //     .attr("x", 100)
    //     .attr("y", 50)
    //     .attr("transform", "rotate(75 100 50)")
    //     .attr("width", 100)
    //     .attr("height", 250);
});
