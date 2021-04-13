var dataPath = "data/worldHappiness2021.csv";

var global_d3_data = null; 

function fill_scatterplot(name,datakey,dataspace){
    var margin = 55; //margins the left
    var width = 1000; //width of the svg element (in pixels)
    var height = 550; //height of the svg element
	if(!dataspace) dataspace = 2;
	
    var extent_ladderScore = d3.extent(global_d3_data, function (d) {
        return parseFloat(d["LadderScore"]);
    });

    var extent_Ydata = d3.extent(global_d3_data, function (d) {
        return parseFloat(d[datakey]);
    });

    var x_scale = d3
        .scaleLinear()
        .range([margin, width - margin])
        .domain([2, extent_ladderScore[1]]);

    var y_scale = d3
        .scaleLinear()
        .range([height - margin, margin])
        .domain([extent_Ydata[0]-dataspace, extent_Ydata[1]]);

    var x_axis = d3.axisBottom(x_scale);
    var y_axis = d3.axisLeft(y_scale);

    var scatterplot_SVG = d3
        .select("#scatterPlot") //select the "body" of html document
        .append("svg") //add an svg element
        .attr("width", width) //specifiy width and height of svg element
        .attr("height", height) ;

    scatterplot_SVG
        .selectAll("circle")
        .data(global_d3_data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return x_scale(parseFloat(d["LadderScore"]));
        })
        .attr("cy", function (d) {
            return y_scale(parseFloat(d[datakey]));
        })
        .attr("r", 5)

        .on("mouseover", function (d) { 
				
			document.getElementById('country').innerHTML = "<strong>" +
                        d.country +
                        "</strong><br/>Ladder Score: "+d['LadderScore']+"<br/>" +
                        name+": " +
                        d[datakey];
			document.getElementById('scatterPlot_ttip').style.display = 'block';
        })
        .on("mouseout", function () {
            //d3.selectAll(".tooltip").remove();
			document.getElementById('country').innerHTML = '';
			document.getElementById('scatterPlot_ttip').style.display = 'none';
        }); 
	
    d3.select("#scatterPlot svg")
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin) + ")")
        .call(x_axis);

    d3.select("#scatterPlot svg")
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin + ",0)")
        .call(y_axis);

	 
    d3.select("#scatterPlot .x.axis")
        .append("text")
        .text("Happiness Ladder Score")
        .style("fill", "black")
        .attr("x", (width - margin) / 2)
        .attr("y", margin-10);
    d3.select("#scatterPlot .y.axis")
        .append("text")
        .text(name)
        .style("fill", "black")
        .attr(
            "transform",
            "rotate(-90,0," + (margin - 11) + ") translate(" + -(margin ) + ",0)"
        );
}
d3.csv(dataPath).then(function (data) {
    //console.log(data); 
    global_d3_data = data; 
	
	fill_scatterplot('GDP Per Capita','LoggedGDPPerCapita',0.5);
	return;
});
