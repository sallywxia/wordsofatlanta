var width = 960,
            height = 500

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height); 

        var force = d3.forceSimulation() 
            .force("link", d3.forceLink().id(function(d) { return d.index }).distance(100).strength(1)) 
            .force("y", function(d) {return d.y})
            .force("x", function(d) {return d.x})

        d3.json("data/data.json", function (error, json) {
            if (error) throw error; 
            force
                .nodes(json.nodes) 
                .force("link").links(json.links)

            var link = svg.selectAll(".link")
                .data(json.links)
                .enter()
                .append("line")
                .attr("class", "link");

            var node = svg.selectAll(".node")
                .data(json.nodes)
                .enter().append("g")
                .attr("class", "node");  

            node.append('circle')
                .attr('r', 13)
                .attr('cx', function(d) {return d.x})
                .attr('cy', function(d) {return d.y})
                .attr('fill', function (d) {
                    return d.color;
                });

            node.append("text")
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y + 60; })
                .style("font-family", "overwatch")
                .style("font-size", "18px")

                .text(function (d) {
                    return d.name
                });

            force.on("tick", function () {
                link.attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });
            });
        });