$( function() {

    var margin = {
            top: 50,
            right: 0,
            bottom: 50,
            left: 30
        },
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range( [0, width] );

    var y = d3.scale.linear()
        .range( [height, 0] );

    var color = d3.scale.category10();

    // var xScale = d3.scale.linear()
    //     .domain([0, 250000])
    //     .range([0, width]),
    //     yScale = d3.scale.linear()
    //     .domain([0, 100]).nice()
    //     .range([height, 0]);

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

    var svg = d3.select( "body" ).append( "div" ).classed('chart', true).append( "svg" )
        .classed('mainChart', true)
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

      // timeline
      var timeLine = svg.append("rect")
          .classed("timed", true)
          .attr("x", width / 2)
          .attr("y", 0)
          .attr("width", 5)
          .attr("height", height)
          .style("fill", "blue");


      // // Top Legend
      // legendSpace = width / emotions.length; // spacing for legend // ******
      //
      // emotion.append("text")
      //   .attr("x", function(d, i) { return (legendSpace / 2) + i * legendSpace })
      //   .attr("y", margin.top / 2)
      //   .attr("class", "legend")
      //   .style("fill", function(d) {
      //       return d.color = color(d.name); })
      //   .on("click", function(d){                     // ************
      //       // Determine if current line is visible
      //       var active   = d.active ? false : true,  // ************
      //       newOpacity = active ? 0 : 1;             // ************
      //       // Hide or show the elements based on the ID
      //       d3.select("#tag"+d.name.replace(/\s+/g, '')) // *********
      //           .transition().duration(100)          // ************
      //           .style("opacity", newOpacity);       // ************
      //       // Update whether or not the elements are active
      //       d.active = active;                       // ************
      //       })                                       // ************
      //   .text(function(d) { return d.name.slice(0, -27) } );

      // Sidebar Legend
      legend = svg.append("g")
          .attr("class","legend")
          .attr("transform","translate(50,30)")
          .style("font-size","16px")
          .attr("data-style-padding",10)
          .call(d3.legend);

      //Lower chart
      var navWidth = width,
          navHeight = 100 - margin.top - margin.bottom;

      var navChart = d3.select( "body" ).append( "div" ).classed('chart', true).append('svg')
          .classed('navigator', true)
          .attr('width', navWidth + margin.left + margin.right)
          .attr('height', navHeight + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var navXScale = d3.scale.linear()
              .domain([0, 250000])
              .range([0, navWidth]),
          navYScale = d3.scale.linear()
              .domain([0, 100])
              .range([navHeight, 0]);

      var navXAxis = d3.svg.axis()
          .scale(navXScale)
          .orient('bottom');

      navChart.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + navHeight + ')')
          .call(navXAxis);

      var emotion = navChart.selectAll(".emotion")
          .data(emotions)
          .enter().append("g")
          .attr("class", "emotion");

      emotion.append("path")
          .attr("class", "line")
          .attr("d", function(d) {
            return line(d.values);
          })
          .style("stroke", function(d) { return color(d.name); });

      var navData = d3.svg.area()
          .x(function (d) { return navXScale(d.date); })
          .y0(navHeight)
          .y1(function (d) { return navYScale(d.close); });

      var navLine = d3.svg.line()
          .x(function (d) { return navXScale(d.date); })
          .y(function (d) { return navYScale(d.close); });

      navChart.append('path')
          .attr('class', 'data')
          .attr('d', navData(data));

      navChart.append('path')
          .attr('class', 'line')
          .attr('d', navLine(data));

    });



} );
