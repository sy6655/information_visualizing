// main.js
console.log("D3 Template Loaded");

// 그래프 크기 및 마진 설정
const margin = { top: 20, right: 40, bottom: 60, left: 100 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

// SVG 생성 및 그룹(g) 생성
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// 데이터 불러오기 (CSV 예시)
d3.csv("data/data.csv").then(data => {
  // 데이터 전처리 예시
  data = data.filter(d => d.value !== "");
  data.forEach(d => d.value = +d.value);

  // 차트 그리기
  drawChart(data);
}).catch(error => {
  console.error("Data loading error:", error);
});

function drawChart(data) {
  // 축 스케일
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([0, width]);

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, height])
    .padding(0.1);

  // X축
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  // Y축
  svg.append("g")
    .call(d3.axisLeft(yScale));

  // 바(bar) 추가
  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", d => yScale(d.name))
    .attr("width", d => xScale(d.value))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");

  // 레이블 (선택)
  svg.selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xScale(d.value) + 5)
    .attr("y", d => yScale(d.name) + yScale.bandwidth() / 2 + 4)
    .text(d => d.value)
    .attr("font-size", "12px")
    .attr("fill", "#333");
}
