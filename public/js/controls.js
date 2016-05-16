$( document ).ready( function() {

    //variables
    var video = document.getElementById('my-video');
    var player = videojs('my-video');
    var masterButton = document.getElementById('playPause');
    var wavesurfer = WaveSurfer.create({
        container: '#waveform'
    });

    //event listeners
    masterButton.addEventListener('click', onClick);

    //functions
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

    function onClick() {
      wavesurfer.playPause();
    }

  });
