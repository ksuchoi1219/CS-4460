window.onload = start;

function start() {
    var graph = document.getElementById("graph");

    var width = 1000;
    var height = 600;

    var svg = d3.select(graph)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "black");

    var bars = svg.append("g");

    var xScale = d3.scale.linear().range([0, width]);
    var yScale = d3.scale.ordinal().rangeRoundBands([0, height], 0.3);
    
    var yAxis = d3.svg.axis().scale(yScale).orient("left");

    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    d3.select("#filterButton")
        .on("click", function() {
            var textbox = document.getElementById("GPA");
            var dropdown = document.getElementById("Department");
            var opt = dropdown.options[dropdown.selectedIndex].text;
            
            if (textbox.value != "") {
                    bars.selectAll(".bar")
                    .style("fill", "green")
                    .attr("width", function(d) {
                        return xScale(d.GPA);
                    })
                    .filter(function(d) {
                        return (d.Department != opt) || (d.GPA < textbox.value);
                    })
                    .transition()
                    .duration(200)
                    .delay(function(d) {
                        return d.GPA * 500
                    })
                    .style("fill", "yellow")
                    .attr("width", function(d) {
                        return 0;
                    });
                
            } else {
                textbox.style.borderColor="red";
                alert("Please type in GPA!");
            }
        
            
        });

    d3.csv("Courses.csv", function(d) {
        
        d.GPA = +d.GPA;
        d["Course Number"] = d.Department + " " + d["Course Number"];
        if (d.GPA > 0 && d.GPA != null) {
            return d;
        }
    }, function(error, data) {

        xScale.domain([0, d3.max(data, function(d) {
            return d.GPA;
        })]);

        yScale.domain(data.map(function(d) {
            return d["Course Number"];
        }));


    // X AXIS
        var xAxisTranslate = "" + (height - 20);

        bars.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(90, " + xAxisTranslate + ")")
            .call(xAxis);

    // Y AXIS
        bars.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(90, 0)")
            .call(yAxis);

        bars.append("g")
            .selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", 90)
            .attr("y", function(d) {
                return yScale(d["Course Number"]);
            })
            .attr("width", function(d) {
                d.GPA = +d.GPA;
                if (d.GPA > 0)
                    return xScale(d.GPA);
            })
            .attr("height", function(d) {
                return yScale.rangeBand();
            });

    });

}