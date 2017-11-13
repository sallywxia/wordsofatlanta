/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(error, json) {
  // create a new plot and
  // display it

  var width = 900,
            height = 600

  var svg = d3.select("#vis").append("svg")
      .attr("width", width)
      .attr("height", height); 

  var force = d3.forceSimulation() 
      .force("link", d3.forceLink().id(function(d) { return d.index }).distance(100).strength(1)) 
      .force("y", function(d) {return d.y})
      .force("x", function(d) {return d.x})

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

  force.on("end", function () {
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

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    var highlightNode = d3.selectAll("circle").filter(function (d, i) {return i == index;});
    var otherNodes = d3.selectAll("circle").filter(function (d, i) { return i != index;});

    highlightNode.attr("r", 21);
    otherNodes.attr("r", 13);
    document.getElementById("quote").innerHTML = highlightNode.data()[0].quote;
    
  });
}


// load data and display
d3.json('data.json', display);
