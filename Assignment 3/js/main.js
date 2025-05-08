console.log("hello world!") // You can see this in the browser console if you run the server correctly
// Don't edit skeleton code!!


d3.csv('data/owid-covid-data.csv')
    .then(data => {

        /*
        -------------------------------------------
        YOUR CODE STARTS HERE

        TASK 1 - Data Processing 

        TO-DO-LIST
        1. Exclude data which contain missing values on columns you need
        2. Exclude data all data except the data where the continent is Asia 
        3. Calculate the rate of fully vaccinated people, partially vaccinated people, and total rate of vaccinated people
        4. Exclude data where total rate of vaccinated people is over 100%
        5. Exclude all data except the latest data for each country
        6. Sort the data with descending order by total reat of vaccinated people
        7. Extract Top 15 countries 
        -------------------------------------------
        */
        let filterd_data = data.filter(d =>
            d.iso_code !== "" &&
            d.continent === "Asia" &&
            d.location !== "" &&
            d.date !== "" &&
            d.population !== "" &&
            d.people_fully_vaccinated !== "" &&
            d.people_vaccinated !== "" 
        );
        
        let processed = filterd_data.map(d => {
            const population = parseFloat(d.population);
            const vaccinated = parseFloat(d.people_vaccinated);
            const fully = parseFloat(d.people_fully_vaccinated);

            const fully_rate = (fully / population) * 100;
            const partial_rate = ((vaccinated - fully) / population) * 100;
            const total_rate = (vaccinated / population) * 100;

            return {
                location: d.location,
                date: d.date,
                fully: fully_rate,
                partially: partial_rate,
                total: total_rate
            };
        });

        processed = processed.filter(d => d.total <= 100);

        const last = new Map();
        processed.forEach(d => {
            if (!last.has(d.location) || d.date > last.get(d.location).date) {
                last.set(d.location, d);
            }
        });

        let lastdata = Array.from(last.values());
        lastdata.sort((a,b) => b.total - a.total);
        let processedData = lastdata.slice(0,15)
        
        /*
        -------------------------------------------
        YOUR CODE ENDS HERE
        -------------------------------------------
        */

        drawBarChart(processedData);

    })
    .catch(error => {
        console.error(error);
    });

function drawBarChart(data) {

    // Define the screen
    const margin = { top: 5, right: 30, bottom: 50, left: 120 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

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

    TASK 2 - Data processing 

    TO-DO-LIST
    1. Create a scale named xScale for x-axis
    2. Create a scale named yScale for x-axis
    3. Define a scale named cScale for color
    4. Process the data for a stacked bar chart 
    5. Draw Stacked bars
    6. Draw the labels for bars
    -------------------------------------------
    */

    // 1. Create a scale for x-axis
    // const xScale

    // 2. Create a scale for y-axis
    // const yScale

    // 3. Define a scale for color
    // const cScale

    // 4. Process the data for a stacked bar chart
    // * Hint - Try to utilze d3.stack()
    // const stackedData

    // 5.  Draw Stacked bars

    // 6. Draw the labels for bars


    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.location))
        .range([0, height])
        .padding(0.2);

    const cScale = d3.scaleOrdinal()
        .domain(["fully", "partially"])
        .range(["#7bccc4", "#2b8cbe"]);

    const stack = d3.stack()
        .keys(["fully", "partially"]);

    const stackedData = stack(data);

    svg.selectAll("g.layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => cScale(d.key))
        .selectAll("rect")  
        .data(d => d)
        .enter()
        .append("rect")
        .attr("y", d => yScale(d.data.location))
        .attr("x", d => xScale(d[0]))
        .attr("width", d => xScale(d[1]) - xScale(d[0]))
        .attr("height", yScale.bandwidth());

    svg.selectAll(".label-partial")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label-partial")
        .attr("x", d => xScale(d.total) + 5)
        .attr("y", d => yScale(d.location) + yScale.bandwidth() / 2 + 4)
        .text(d => d.total.toFixed(1) + "%")
        .attr("font-size", "12px")
        .attr("fill", "#333");

    const full_layer = stackedData.find(d => d.key === "fully");
    
    svg.selectAll(".label-full")
        .data(full_layer)
        .enter()
        .append("text")
        .attr("class", "label-full")
        .attr("x", d => xScale(d[1]) - 5)
        .attr("y", d => yScale(d.data.location) + yScale.bandwidth() / 2 + 4)
        .text(d => d.data.fully.toFixed(1) + "%")
        .attr("font-size", "12px")
        .attr("fill", "#333")
        .attr("text-anchor", "end"); 

    // Define the position of each axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Draw axes 
    svg.append("g")
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    svg.append("g")
        .attr('class', 'y-axis')
        .call(yAxis)

    // Indicate the x-axis label 
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 40)
        .attr("font-size", 17)
        .text("Share of people (%)");

    // Draw Legend
    const legend = d3.select("#legend")
        .append("svg")
        .attr('width', width)
        .attr('height', 70)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    legend.append("rect").attr('x', 0).attr('y', 18).attr('width', 12).attr('height', 12).style("fill", "#7bccc4")
    legend.append("rect").attr('x', 0).attr('y', 36).attr('width', 12).attr('height', 12).style("fill", "#2b8cbe")
    legend.append("text").attr("x", 18).attr("y", 18).text("The rate of fully vaccinated people").style("font-size", "15px").attr('text-anchor', 'start').attr('alignment-baseline', 'hanging');
    legend.append("text").attr("x", 18).attr("y", 36).text("The rate of partially vaccinated people").style("font-size", "15px").attr('text-anchor', 'start').attr('alignment-baseline', 'hanging');

}
