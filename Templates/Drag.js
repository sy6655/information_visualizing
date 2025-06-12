const svg = d3.select("svg");

const data = d3.range(10).map((d) => ({
    id: "Circle " + (d + 1),
    cx: 100 + d * 60,
    cy: 250,
    r: 25,
}));

// 각 원과 텍스트가 포함된 그룹 생성
const groups = svg.selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "draggable");

groups.append("circle")
    .attr("r", d => d.r)
    .attr("cx", d => d.cx)
    .attr("cy", d => d.cy)
    .attr("fill", "cornflowerblue");

groups.append("text")
    .attr("x", d => d.cx)
    .attr("y", d => d.cy + 5)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text(d => d.id);

// 드래그 기능 연결
svg.selectAll(".draggable")
    .call(d3.drag()
        .on("start", function () {
            d3.select(this).select("circle")
                .attr("stroke", "black")
                .attr("stroke-width", 2);
        })
        .on("drag", function (event, d) {
            d3.select(this).select("circle")
                .attr("cx", d.cx = event.x)
                .attr("cy", d.cy = event.y);
            d3.select(this).select("text")
                .attr("x", d.cx)
                .attr("y", d.cy + 5);
        })
        .on("end", function () {
            d3.select(this).select("circle").attr("stroke", null);
        })
    );
