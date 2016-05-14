var wavesurfer = WaveSurfer.create({
    container: '#waveform'
});

wavesurfer.load('../assets/audio/m83_go.mp3');

wavesurfer.on('ready', function () {
    wavesurfer.play();
});
