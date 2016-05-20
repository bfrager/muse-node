$( function() {

    // d3.csv("../assets/data/IMG_6135facialcapture.csv")
    //   .row(function(d) { return {key: d.key, value: +d.value}; })
    //   .get(function(error, rows) { console.log(rows); });
    //
    // var n = 40,
    //     random = d3.random.normal( 800, 1000 );
    //
    // function chart(domain, interpolation, tick) {
    //     var data = [d3.range( n ).map( random ), d3.range( n ).map( random ), d3.range( n ).map( random ), d3.range( n ).map( random )];

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

          emotion.append("text")
              .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
              .attr("transform", function(d) { return "translate(" + x(d.value.timestamp) + "," + y(d.value.confidence) + ")"; })
              .attr("x", 3)
              .attr("dy", ".35em")
              .text(function(d) { return d.name; });

          legend = svg.append("g")
              .attr("class","legend")
              .attr("transform","translate(50,30)")
              .style("font-size","12px")
              .call(d3.legend)

            setTimeout(function() {
              legend
                .style("font-size","20px")
                .attr("data-style-padding",10)
                .call(d3.legend)
            },1000)

        });


    //
    //     var lines = svg.selectAll( "g" )
    //         .data( data );
    //
    //     var aLineContainer = lines
    //         .enter().append( "g" );
    //
    //     aLineContainer.append( "defs" ).append( "clipPath" )
    //         .attr( "id", "clip" )
    //         .append( "rect" )
    //         .attr( "width", width )
    //         .attr( "height", height );
    //
    //     svg.append( "g" )
    //         .attr( "class", "y axis" )
    //         .call( d3.svg.axis().scale( y ).ticks( 5 ).orient( "left" ) )
    //         .append( "text" )
    //         .attr( "transform", "rotate(-90)" )
    //         .attr( "y", 6 )
    //         .attr( "dy", ".71em" )
    //         .style( "text-anchor", "end" )
    //         .text( "microvolts" );
    //
    //     var colors = ["red", "#92278F", "#0071BB", "#00A651"];
    //
    //     var path = aLineContainer
    //         .attr( "clip-path", "url(#clip)" )
    //         .append( "path" )
    //         //.data(data)
    //         .attr( "class", "line" )
    //         .style( "stroke", function(d, i) {
    //             return colors[i];
    //         } )
    //         .attr( "d", line );
    //
    //     // tick(path, line, data, x);
    //
    //     var socket = io.connect( "http://localhost:3000" );
    //     socket.on( "news", function(value) {
    //         if (!(value.args && value.address == "/muse/eeg"))
    //             return;
    //
    //         var xVal = (new Date()).getTime(), // current time
    //             yVal = value.args[0];
    //
    //         data[0].push( value.args[0] );
    //         data[1].push( value.args[1] );
    //         data[2].push( value.args[2] );
    //         data[3].push( value.args[3] );
    //
    //         path
    //             .attr( "d", line )
    //             .attr( "transform", null )
    //             .transition()
    //             .duration( 750 )
    //             .ease( "linear" )
    //             .attr( "transform", "translate(" + x( 0 ) + ")" );
    //
    //         // pop the old data point off the front
    //         data[0].shift();
    //         data[1].shift();
    //         data[2].shift();
    //         data[3].shift();
    //     } );
    // }
    //
    // chart( [1, n - 2], "basis", function tick(path, line, data, x) {} );

} );
