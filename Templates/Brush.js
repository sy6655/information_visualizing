const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

// 무작위 산점도 데이터 생성
const data = d3.range(150).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height
}));

// 원 그리기
const circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("fill", "gray");

// 브러시 정의
const brush = d3.brush()
    .extent([[0, 0], [width, height]])
    .on("brush end", function (event) {
        const sel = event.selection;
        let count = 0;

        circles.attr("fill", d => {
            const selected = sel &&
                d.x >= sel[0][0] && d.x <= sel[1][0] &&
                d.y >= sel[0][1] && d.y <= sel[1][1];
            if (selected) count++;
            return selected ? "crimson" : "gray";
        });

        svg.selectAll("text.info").remove();
        svg.append("text")
            .attr("class", "info")
            .attr("x", 10)
            .attr("y", 20)
            .attr("fill", "black")
            .text(`Selected Points: ${count}`);
    });

// 브러시 추가
svg.append("g").call(brush);
