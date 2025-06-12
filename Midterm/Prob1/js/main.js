// Find the errors and fix them!

d3.csv('data/life_expectancy_by_country.csv')
    .then(data => {

        // Declare variables
        var differnece_list = [];
        var current_country = null;
        var current_country_data = [];

        // Generate Min-Max Difference List 
        // You don't have to fix this part!
        for (d of data) {
            if (current_country != d.country_name) {
                if (current_country_data.length > 1) {
                    minmax = d3.extent(current_country_data, function (d) { return d.value });
                    var diff = {
                        country_name: current_country,
                        difference: minmax[1] - minmax[0],
                    };
                    differnece_list.push(diff);
                }
                current_country = d.country_name;
                current_country_data = [];
                current_country_data.push(d);
            }
            else {
                current_country_data.push(d);
            }
        }

        // Sort & Slice based on the difference
        // no.4
        var differnece_list = differnece_list.sort((a, b) => b.difference - a.difference).slice(0, 5);

        // Get Top 5 country list
        country_list = differnece_list.map(d => d.country_name);

        // Filter Top-5 countries data
        var processedData = data.filter(d => country_list.includes(d.country_name));

        drawLineChart(processedData);
        
    })
    .catch(error => {
        console.error(error);
    });

function drawLineChart(data) {
    // Define Canvas
    const margin = { top: 50, right: 100, bottom: 100, left: 120 },
        width = 1100 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // Define the position of the chart 
    const svg = d3.select("#chart")
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create a scale for x-axis 
    const xScale = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, width])

    // Create a scale for y-axis  
    // no.3
    const yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).range([height, 0])

    // Define the position of each axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Draw axes 
    // no.5
    const xAxisGroup = svg.append("g")
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);


    const yAxisGroup = svg.append("g")
        .attr('class', 'y-axis')
        .call(yAxis)

    // Define a scale for color 
    console.log(country_list);
    const cScale = d3.scaleOrdinal().domain(country_list).range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00'])



    // Group the data
    // You don't have to fix this part!
    groupedData = d3.group(data, d => d.country_name);
    
    // Draw the lines
    svg.selectAll('.line')
        .data(groupedData)
        .enter()
        .append('path')
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', d => cScale(d[0])) // no.2
        .attr('stroke-width', 1.5)
        .attr('d', function (d) {
            return d3.line()
                .x(d => xScale(d.year))
                .y(d => yScale(d.value))
                (d[1]);
        })
        .each(function (d) {
            // Add Label to the line
            const lastPoint = d[1][d[1].length - 1];
            svg.append('text')
                .attr('x', xScale(lastPoint.year) + 5)
                .attr('y', yScale(lastPoint.value))
                .attr('fill', cScale(d[0]))
                .attr('dy', '0.35em')
                .attr("font-size", 10)
                .text(d[0]);
        });
        
    // Add x-axis label 
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 60)
        .attr("font-size", 17)
        .text("Year");

    // Add y-axis label
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -60)
        .attr("font-size", 17)
        .text("Life Expectency")
        .attr("transform", "rotate(270)");
    
    // const zoom = d3.zoom()
    //     .scaleExtent([1,5])
    //     .translateExtent([[0,0], [width, height]])
    //     .on("zoom", zoomed);
    
    // function zoomed (event) {
    //     const transform = event.transform;
    //     svg.attr("transform", transform);
    //     // const newX = transform.rescaleX(xScale);
    //     // const newY = transform.rescaleY(yScale);

    //     // svg.select(".x-axis").call(d3.axisBottom(newX));
    //     // svg.select(".y-axis").call(d3.axisLeft(newY));
    //     // svg.selectAll(".line")
    //     //     .attr("d", d => d3.line()
    //     //         .x(p => newX(p.year))
    //     //         .y(p => newY(p.value))
    //     //         (d[1])
    //     //     );
    // };
    // svg.call(zoom);

    const brush = d3.brush()
        .extent([[0,0],[width,height]])
        .on("end", function(event) {
            svg.selectAll(".line")
            .attr('stroke', d => cScale(d[0])) // no.2
            .attr('stroke-width', 1.5)
        })
        .on("brush", function (event){
            const [[x0, y0], [x1, y1]] = event.selection;
            const xMin = xScale.invert(x0);
            const xMax = xScale.invert(x1);
            const yMin = yScale.invert(y1); 
            const yMax = yScale.invert(y0);

            svg.selectAll(".line")
                .attr("stroke", d =>{
                    const selected = d[1].some(p =>
                        p.year >= xMin && p.year <= xMax &&
                        p.value >= yMin && p.value <= yMax
                    );
                    return selected ? "red" : cScale(d[0])
                })
                .attr("stroke-width", d => {
                    const selected = d[1].some(p =>
                        p.year >= xMin && p.year <= xMax &&
                        p.value >= yMin && p.value <= yMax
                    );
                    return selected ? 3: 1.5;
                })
        });
    svg.append("g")
        .attr("class", "brush")
        .call(brush);
}
