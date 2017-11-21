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
  var inn = 0;
  var tempX;
  var tempY;
  var width = 1200,
            height = 600

            var secNodes = [[1,2, 11],[0,1,6,7],[0,3], [2,7,11], [3, 8], [0, 1, 9, 11], [0,2, 13], [6], [0], [0, 1, 5] ];

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

  node.append("circle")
      .attr("cx", function(d) { return d.x + 40; })
      .attr("cy", function(d) { return d.y + 19; })
      .attr("r", 44)
      .style("stroke-width", 3)
      .style("fill-opacity", 0)
      .style("stroke", function(d){ return d.color; });

  node.append("svg:image")
      .attr("xlink:href", function(d) {return d.source})
      .attr('width', 50)
      .attr('height', 50)
      .attr('x', function(d){return d.x; })
      .attr('y', function(d){return d.y - 20; })
      .on('click', function(d, iny) {
          var tt = d3.selectAll("circle").filter(function (d, i) {
            if(iny == i) {
              return true;
            } 
          });

          var ty = d3.selectAll("circle").filter(function (d, i) {
            if(iny != i) {
              return true;
            } 
          });

          tt.style("stroke-width", "10");
          ty.style("stroke-width", "3");
          document.getElementById("vizQuotes").innerHTML = d.quote[inn];
        })
      .on("mouseover", function(d)
      {
        tempX = d3.select(this).attr("width");
        tempY = d3.select(this).attr("height");
        d3.select(this).transition()
          .attr("width", 75)
          .attr("height", 75);
      })
      .on("mouseout", function(d)
      { 
        //alert(d3.select(this).index());
        d3.select(this).transition()
          .attr("width", tempX)
          .attr("height", tempY);
      });

  node.append("text")
      .attr("x", function(d) { return d.x - 15; }) 
      .attr("y", function(d) { return d.y + 60; }) 
      .style("font-family", "futura")
      .style("text-anchor", "middle")
      .style("fill", function(d){ return d.color; })
      .style("font-size", "15px")

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
    inn = index;
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.3; });

    // activate current section
    var highlightNode = d3.selectAll("image").filter(function (d, i) {return secNodes[index].includes(i); });
    

    var otherNodes = d3.selectAll("image").filter(function (d, i) {
      if (!secNodes[index].includes(i)) {

        return true;
      } 
    });

    var highCircle = d3.selectAll("circle").filter(function (d, i) {return secNodes[index].includes(i); });

    var otherCircle = d3.selectAll("circle").filter(function(d, i) { return  !secNodes[index].includes(i); });
    //var neighbors = highlightNode.data()[0].neighbors;
    //var neighborNodes = d3.selectAll("image").filter(function (d, i) {return neighbors.includes(i)})

    //console.log(neighborNodes._groups.toString());

    highlightNode
      .attr("width", 75)
      .attr("height", 75);
      
      // .attr("cx", function(d) { return d.x; })

      // .attr("cy", function(d) { return d.y; })
      // .attr("r", 50)
      // .attr('class', 'image-border')
      //.attr('width', 75)
      //.attr('height', 75)
      //.style("fill", "blue");

    otherNodes
      .attr("width", 50)
      .attr("height", 50);
      //.select("circle")
      //.remove("circle");

    highCircle
    .style("display", "inline");

    otherCircle
    .style("display", "none");

    // neighborNodes
    //   .attr("width", 75)
    //   .attr("height", 75);

    document.getElementById("vizQuotes").innerHTML = highlightNode.data()[0].quote[index];
    highCircle.filter(function(d, i){return i == 0}).style("stroke-width", "10");
    highCircle.filter(function(d, i) {return i != 0}).style("stroke-width","3");
    
  });
}


// load data and display
d3.json('data.json', display);
