$( function() {

    var margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 50
        },
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range( [0, width] );

    var y = d3.scale.linear()
        .range( [height, 0] );

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x( function(d) {
            return x( d.timestamp );
        } )
        .y( function(d) {
            return y( d.confidence );
        } );

    var svg = d3.select( "body" ).append( "div" ).append( "svg" )
        .attr( "width", width + margin.left + margin.right )
        .attr( "height", height + margin.top + margin.bottom )
        // .style( "margin-left", margin.left + "px" )
        // .style( "margin-top", margin.top + "px" )
        .append( "g" )
        .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

    d3.csv("../assets/data/IMG_6135facialcapture_clean.csv", function(error, data) {
      if (error) throw error;

      // data.forEach(function(d) {
      //   Object.keys(d).forEach(function(key){
      //     d[key] = +d[key];
      //   });
      // });

      var emotionsRef = [
        "joyct_emotion_nonlinear_causal",
        "disgustct_emotion_nonlinear_causal",
        "sadnessct_emotion_nonlinear_causal",
        "angerct_emotion_nonlinear_causal",
        "surprisect_emotion_nonlinear_causal",
        "contemptct_emotion_nonlinear_causal",
        "fearct_emotion_nonlinear_causal"
      ];

      // color.domain(d3.keys(data[0]).filter(function(key) { return key !== "timestamp"; }));
      color.domain(d3.keys(data[0]).filter(function(key) { return emotionsRef.includes(key) }));

      var emotions = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {timestamp: +d.timestamp, confidence: +d[name]};
          })
        };
      });

      // x.domain(d3.extent(data, function(d) { return d.timestamp; }));
      x.domain([0, 250000]);

      y.domain([
        0,
        100
        // d3.max(data, function(d) { return d.joyct_emotion_nonlinear_causal; })
      ]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("x", width / 2)
          .attr("y", 30)
          .attr("dx", ".71em")
          .style("text-anchor", "end")
          .text("Milliseconds");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Intensity");

      var emotion = svg.selectAll(".emotion")
          .data(emotions)
          .enter().append("g")
          .attr("class", "emotion");

      emotion.append("path")
          .attr("class", "line")
          .attr("d", function(d) {
            return line(d.values);
          })
          .attr("data-legend",function(d) { return d.name.slice(0, -27)})
          .style("stroke", function(d) { return color(d.name); });

      legendSpace = width / emotions.length; // spacing for legend // ******

      emotion.append("text")
        .attr("x", function(d, i) { return (legendSpace / 2) + i * legendSpace })
        .attr("y", margin.top / 2)
        .attr("class", "legend")
        .style("fill", function(d) {
            return d.color = color(d.name); })
        .on("click", function(d){                     // ************
            // Determine if current line is visible
            var active   = d.active ? false : true,  // ************
            newOpacity = active ? 0 : 1;             // ************
            // Hide or show the elements based on the ID
            d3.select("#tag"+d.name.replace(/\s+/g, '')) // *********
                .transition().duration(100)          // ************
                .style("opacity", newOpacity);       // ************
            // Update whether or not the elements are active
            d.active = active;                       // ************
            })                                       // ************
        .text(function(d) { return d.name.slice(0, -27) } );

      legend = svg.append("g")
          .attr("class","legend")
          .attr("transform","translate(50,30)")
          .style("font-size","16px")
          .attr("data-style-padding",10)
          .call(d3.legend);

    });

} );
