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

  var width = 1200,
            height = 600

  var svg = d3.select("#vis").append("svg")
      .attr("width", width)
      .attr("height", height); 

  var force = d3.forceSimulation() 
      .force("link", d3.forceLink().id(function(d) { return d.index }).distance(150)) 
      .force("y", function(d) {return d.y})
      .force("x", function(d) {return d.x})

  force
      .nodes(json.nodes) 
      .force("link").links(json.links)

  var link = svg.selectAll(".link")
      .data(json.links)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("stroke", function(d) { return d.color});

  var node = svg.selectAll(".node")
      .data(json.nodes)
      .enter().append("g")
      .attr("class", "node");  

  node.append("svg:image")
      .attr("xlink:href", function(d) {return d.source})
      .attr('width', 50)
      .attr('height', 50)
      .attr('x', function(d){return d.x; })
      .attr('y', function(d){return d.y - 10; })
      .on('click', function(d) {
          document.getElementById("vizQuotes").innerHTML = d.quote;
        })
      .on("mouseover", function(d)
      {
        d3.select(this).transition()
          .attr("width", 80)
          .attr("height", 80);
      })
      .on("mouseout", function(d)
      {
        d3.select(this).transition()
          .attr("width", 60)
          .attr("height", 60);
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
    var highlightNode = d3.selectAll("image").filter(function (d, i) {return i == index;});
    var otherNodes = d3.selectAll("image").filter(function (d, i) { return i != index;});
    
    highlightNode
      .attr("width", 75)
      .attr("height", 75);
    otherNodes
      .attr("width", 50)
      .attr("height", 50);
    document.getElementById("vizQuotes").innerHTML = highlightNode.data()[0].quote;
    
  });
}


// load data and display
d3.json('data.json', display);
