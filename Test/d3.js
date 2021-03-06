var width = 1500,
      height = 680;

var svg = d3.select('div#nodes')
    .classed("svg-container", true)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

var force = d3.layout.force()
    .size([width, height])
    .linkDistance(100);

d3.json("data.json", function(error, graph) {
    if (error) throw error;

    force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

    var link = svg.selectAll('.link')
        .data(graph.links)
        .enter().append('line')
        .attr('class', 'link');


    var node = svg.selectAll('.node')
      .data(graph.nodes)
      .enter()
      .append("g")
      .attr('class', 'node');

    node.append("svg:image")
      .attr("xlink:href", function(d) {return d.source})
      .attr('width', 80)
      .attr('height', 80)
      .attr('x', function(d){return d.x; })
      .attr('y', function(d){return d.y - 10; })
      .on('click', function(d) {
          document.getElementById("quote").innerHTML = d.quote;
        })
      .on("mouseover", function(d)
      {
        d3.select(this).transition()
          .attr("width", 100)
          .attr("height", 100);
      })
      .on("mouseout", function(d)
      {
        d3.select(this).transition()
          .attr("width", 80)
          .attr("height", 80);
      });

    node.append("text")
      .attr("dx", 12)
      .attr("x", function(d) { return d.x + 20; })
      .attr("y", function(d) { return d.y + 90; })
      .attr("dy", ".35em")
      .text(function(d) { return d.name })
      .style('text-anchor', 'middle');

    force.on('end', function(){
      link.attr('x1', function(d) {return d.source.x;})
        .attr('y1', function(d) {return d.source.y+40;})
        .attr('x2', function(d) {return d.target.x;})
        .attr('y2', function(d) {return d.target.y+40;});
      });
});
