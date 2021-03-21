const [W, H, PADDING] = [700, 450, 60];

function main() {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
        .then(response => response.json())
        .then(jsonData => {

            // console.log(jsonData);

            jsonData.forEach(data => {
                data.Time = new Date('1970-1-1 0:' + data.Time);
            });

            console.log(jsonData);
            // const timeFormat = d3.timeFormat('%M:%S');
            console.log(d3.min(jsonData.map(a => a.Year)));

            // title
            const title = d3.select('body').append('div').attr('id', 'title')
                            // .style('background-color', 'gray')
                            .style('width', 'fit-content')
                            .style('padding', '10px 30px 50px 30px')
                            .style('margin', 'auto')
                            .style('box-shadow', '5px 2px 20px black');

            title.append('h1').text('Doping in Professional Bicycle Racing');
            title.append('h3').text('35 Fastest times up Alpe d\'Huez');

            // svg area creation
            const svg = title.append('svg')
                        .attr('width', W).attr('height', H);

            // scales
            const xScale = d3.scaleLinear()
                            .domain([d3.min(jsonData.map(a => a.Year), d => d - 1), d3.max(jsonData.map(a => a.Year), d => d + 1)])
                            .range([PADDING, W - 20])

            const yScale = d3.scaleTime()
                            // .domain(d3.min(jsonData.map(a => a.Time), d => new Date(d)), d3.max(jsonData.map(a => a.Time), d => new Date(d)))
                            // .domain(d3.max(jsonData.map(a => a.Time), d => d), d3.min(jsonData.map(a => a.Time), d => d))
                            .domain(d3.extent(jsonData, d => d.Time).reverse())
                            .range([H - PADDING, 20])          

            // axis
            const xAxis = d3.axisBottom(xScale).tickFormat(y => '' + y);
            const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

            svg.append('g')
                .attr('transform', 'translate(0,' + (H - PADDING) + ')')
                .call(xAxis)
                .attr('id', 'x-axis');

            svg.append('g')
                .attr('transform', 'translate(' + PADDING + ', 0)')
                .call(yAxis)
                .attr('id', 'y-axis');
            
            svg.append('text')
                .style('text-anchor', 'end')
                .attr('transform', 'rotate(-90)')
                .attr('x', -40)
                .attr('y', 15)
                .text('Time in Minutes');

            // data-points
            const color = d3.scaleOrdinal(d3.schemeTableau10 );
            svg.selectAll('circle')
                .data(jsonData).enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('cx', d => xScale(d.Year))
                .attr('cy', d => yScale(d.Time))
                .attr('r', 5)
                .attr('data-xvalue', d => d.Year)
                .attr('data-yvalue', d => d.Time)
                .attr('fill', d => color(d.Doping !== ''))
            
            // legend
            const legendContainer = svg.append('g').attr('g', 'legend');

            const legend = legendContainer.selectAll('#legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend-label')
                .attr('transform', (d, i) => 'translate(0,' + (H / 2 - 100 - i * 20) + ')');

            legend.append('rect')
                .attr('x', W - 18)
                .attr('width', 18)
                .attr('height', 18)
                .style('fill', color);

            legend.append('text')
                .attr('x', W - 24)
                .attr('y', 9)
                .attr('dy', '.35em')
                .style('text-anchor', 'end')
                .text((d) => {
                  if(d) return 'Riders with doping allegations';
                  else return 'No doping allegations';
                });
        })
}

document.addEventListener('DOMContentLoaded', main);
