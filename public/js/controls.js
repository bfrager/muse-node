$( document ).ready( function() {

    //variables
    var video = document.getElementById('my-video');
    var player = videojs('my-video');
    var masterButton = document.getElementById('playPause');
    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        hideScrollbar: true,
        waveColor: 'gray',
        progressColor: 'teal'
    });
    var slider = document.querySelector('#slider');


    //event listeners
    masterButton.addEventListener('click', onClick);

    //functions
    // player.aspectRatio("16:9");
    // player.width(356);
    player.height(200);

    wavesurfer.load('../assets/audio/m83_go.mp3');

    wavesurfer.on('ready', function () {
        // wavesurfer.play();
    });

    wavesurfer.on('play', function () {
      console.log('play');
      player.play();
    });

    wavesurfer.on('pause', function () {
      console.log('pause');
      player.pause();
    });

    wavesurfer.on('seek', function(percent) {
      player.currentTime(player.duration() * percent);
    })

    slider.oninput = function () {
      var zoomLevel = Number(slider.value);
      wavesurfer.zoom(zoomLevel);
    };

    function onClick() {
      wavesurfer.playPause();
    }

  });
