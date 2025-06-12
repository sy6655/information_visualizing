// const { version } = require("react");

console.log("hello world!") // You can see this in the browser console if you run the server correctly

d3.csv('data/owid-covid-data.csv')
    .then(data => {

        /*
        -------------------------------------------
        YOUR CODE STARTS HERE

        TASK 1 - Data Processing 

        TO-DO-LIST
        1. Exclude data that contain missing values on columns you need
        2. Exclude all data except the latest data for each country
        3. Sort the data by the life expectancy
        -------------------------------------------
        */
        let filteredData = data.filter(d => d.continent != "" && d.location != "" && d.date != "" && d.population != "" &&  d.life_expectancy != "" &&  d.gdp_per_capita != "");
        
        // Convert relevant fields to numbers
        filteredData.forEach(d => {
            d.population = +d.population;
            d.life_expectancy = +d.life_expectancy;
            d.gdp_per_capita = +d.gdp_per_capita;
        });
        
        var lastedData = [];
        for (d of filteredData) {
            var flag  = true;
            for(last of lastedData){
                if(d.location == last.location ) {
                    if(d.date > last.date){
                        lastedData.pop(last);
                        lastedData.push(d);
                    }
                    flag = false;
                }
            }
            if(flag) {
                lastedData.push(d);
            }
        } 
        var processedData = lastedData.sort((a, b) => b.life_expectancy - a.life_expectancy);
        /*
        -------------------------------------------
        YOUR CODE ENDS HERE
        -------------------------------------------
        */

        drawBubbleChart(processedData)

    })
    .catch(error => {
        console.error(error);
    });

function drawBubbleChart(data) {

    // Canvas Size
    const margin = { top: 5, right: 450, bottom: 50, left: 120 },
        width = 1800 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom;

    // Define the position of the chart 
    const svg = d3.select("#chart")
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    /*
    -------------------------------------------
    YOUR CODE STARTS HERE

    TASK 2 - Drawing Bubble Chart

    TO-DO-LIST
    1. Define a scale named xScale for x-axis
    2. Define a scale named yScale for y-axis
    3. Define a list named continentList that contains 
    4. Define a scale named cScale for color
    5. Define a scale named sScale for size of the bubbles
    6. Draw Bubbles
    -------------------------------------------
    */

    // 1. Define a scale named xScale for x-axis
    // const xScale
    const xScale = d3.scaleLinear()
        .domain([0, 1.1 * d3.max(data, d => d.gdp_per_capita)])
        .range([0, width]);
    // 2. Define a scale named yScale for y-axis
    // const yScale
    const yScale = d3.scaleLinear()
        .domain([0.9 * d3.min(data, d => d.life_expectancy), 1.1 * d3.max(data, d => d.life_expectancy)])
        .range([height, 0]);
    // 3. Define a list named continentList that contains
    // const continentList
    const continentList = [];
    for (d of data) {
        if (!continentList.includes(d.continent) && d.continent != null) {
            continentList.push(d.continent);
        }
    }

    // 4. Define a scale named cScale for color
    // const cScale
    const cScale = d3.scaleOrdinal()
        .domain(continentList)
        .range(['#cce1f2', '#a6f8c5', '#fbf7d5', '#e9cec7', '#f59dae', '#d2bef1']);
    
    // 5. Define a scale named sScale for size of the bubbles
    // const sScale
    const sScale = d3.scaleSqrt()
        .domain(d3.extent(data, d => d.population))
        .range([5, 50]);
    // 6. Draw Bubbles
    const chartGroup = svg.append("g")
        .attr("class", "zoom-target")

    chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", d => xScale(d.gdp_per_capita))
        .attr("cy", d => yScale(d.life_expectancy))
        .attr("fill", d => cScale(d.continent))
        .attr('stroke', "black")
        .attr("r", d => sScale(d.population))
        .call(
            d3.drag()
                .on("start", function (event, d) {
                    d3.select(this).raise().attr("stroke", "black");
                })
                .on("drag", function (event, d) {
                    d3.select(this)
                        .attr("stroke", "red")
                        .attr("cx", d.x = event.x)
                        .attr("cy", d.y = event.y);
                })
                .on("end", function (event, d) { 
                    d3.select(this)
                        .attr("cx",  d => xScale(d.gdp_per_capita))
                        .attr("cy", d => yScale(d.life_expectancy))
                        .attr("stroke", "black");
                })
        );

    // Define the position of each axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    // Draw axes 
    chartGroup.append("g")
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .attr('class', 'y-axis')
        .call(yAxis)

    // Add x-axis label 
    chartGroup.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 40)
        .attr("font-size", 17)
        .text("GDP Per Capita");

    // Add y-axis label 
    chartGroup.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -60)
        .attr("font-size", 17)
        .text("Life Expectency")
        .attr("transform", "rotate(270)");

    // Add legend
    const size = 30
    chartGroup.selectAll("legend")
        .data(continentList)
        .enter()
        .append("circle")
        .attr("cx", width + 100)
        .attr("cy", function (d, i) { return 10 + i * size })
        .attr("r", 10)
        .style("fill", function (d) { return cScale(d) })
        .attr("stroke", "black")

    // Add legend texts
    chartGroup.selectAll("legend_label")
        .data(continentList)
        .enter()
        .append("text")
        .attr("x", width + 100 + size)
        .attr("y", function (d, i) { return i * size + (size / 2) })
        .text(function (d) { return d })
        .attr("text-anchor", "start")
            
    const zoom = d3.zoom()
        .scaleExtent([1, 5])
        .translateExtent([[0,0], [width, height]])
        .on("zoom", zoomed);
    
    function zoomed(event) {
        const transform = event.transform;
        // chartGroup.attr("transform", transform);
        const newX = transform.rescaleX(xScale);
        const newY = transform.rescaleY(yScale);

        svg.select(".x-axis").call(d3.axisBottom(newX));
        svg.select(".y-axis").call(d3.axisLeft(newY));

        chartGroup.selectAll("circle")
            .attr("cx", d => newX(d.gdp_per_capita))
            .attr("cy", d => newY(d.life_expectancy));
    };
    svg.call(zoom);

    // const brush = d3.brush()
    //     .extent([[0,0],[width,height]])
    //     .on("end", function(event) {
    //         svg.selectAll("circle")
    //             .attr("stroke", "black")
    //             .attr("stroke-width", 1);
    //     })
    //     .on("brush", function (event){
    //         if(!event.selection) return;
    //         const selection = event.selection;
    //         svg.selectAll("circle")
    //             .attr("stroke", d => {
    //             const cx = xScale(d.gdp_per_capita);
    //             const cy = yScale(d.life_expectancy);
    //             const selected = selection &&
    //                 cx >= selection[0][0] && cx <= selection[1][0] &&
    //                 cy >= selection[0][1] && cy <= selection[1][1];
    //             return selected ? "red" : "black";
    //         })
    //         .attr("stroke-width", d => {
    //             const cx = xScale(d.gdp_per_capita);
    //             const cy = yScale(d.life_expectancy);
    //             const selected = selection &&
    //                 cx >= selection[0][0] && cx <= selection[1][0] &&
    //                 cy >= selection[0][1] && cy <= selection[1][1];
    //             return selected ? 3 : 1;
    //         });
    //     });
    // svg.append("g")
    //     .attr("class", "brush")
    //     .call(brush);
}
