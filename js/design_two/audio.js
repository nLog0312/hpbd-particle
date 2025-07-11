const playBtn = document.getElementById('playBtn');
const audio = document.getElementById('audio');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');

playBtn.addEventListener('click', function() {
    if (audio.paused) {
    audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = '';
    } else {
    audio.pause();
    playIcon.style.display = '';
    pauseIcon.style.display = 'none';
    }
});

audio.addEventListener('pause', function() {
    playIcon.style.display = '';
    pauseIcon.style.display = 'none';
});
audio.addEventListener('play', function() {
    playIcon.style.display = 'none';
    pauseIcon.style.display = '';
});