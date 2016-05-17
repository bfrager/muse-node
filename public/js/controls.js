$( document ).ready( function() {

    //variables
    var video = document.getElementById('my-video');
    var player = videojs('my-video');
    var masterButton = document.getElementById('playPause');
    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        hideScrollbar: true,
        waveColor: 'gray',
        progressColor: 'teal',
        loaderColor   : 'purple',
        cursorColor   : 'navy'
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
        // Init Timeline plugin
        var timeline = Object.create(WaveSurfer.Timeline);

        timeline.init({
            wavesurfer: wavesurfer,
            container: '#wave-timeline'
        });

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

    if (location.search.match('scroll')) {
        options.minPxPerSec = 100;
        options.scrollParent = true;
    }

    if (location.search.match('normalize')) {
        options.normalize = true;
    }

    /* Progress bar */
    (function () {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');

        var showProgress = function (percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };

        var hideProgress = function () {
            progressDiv.style.display = 'none';
        };

        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
    }());

  });
