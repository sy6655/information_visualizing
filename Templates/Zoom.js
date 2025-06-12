const svg = d3.select("svg");
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;

const x = d3.scaleBand().domain(d3.range(10)).range([0, width]).padding(0.2);
const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
const chart = g.append("g"); // 확대/이동 대상

const data = d3.range(10).map(() => Math.random() * 100);

// 막대 생성
chart.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (_, i) => x(i))
    .attr("y", d => y(d))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d))
    .attr("fill", "tomato");

// 축 생성
g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

g.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

// 줌 기능 연결
svg.call(d3.zoom()
    .scaleExtent([0.5, 5])
    .on("zoom", (event) => {
        chart.attr("transform", event.transform);
        g.select(".x-axis").call(d3.axisBottom(event.transform.rescaleX(x)));
        g.select(".y-axis").call(d3.axisLeft(event.transform.rescaleY(y)));
    })
);
