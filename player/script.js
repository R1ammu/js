let isColorToggled = false;

document.querySelector('button').addEventListener('click', function() {
    const playBtn = document.querySelector('button');
    
    if (!isColorToggled) {
        playBtn.style.color = 'black';
        playBtn.style.background = 'white';
    } else {
        playBtn.style.color = 'white';
        playBtn.style.background = 'black';
    }
    isColorToggled = !isColorToggled;
});


let isPlaying = false;

document.querySelector('button').addEventListener('click', function() {
    const audioElement = document.getElementById('myAudio');
    
    if (!isPlaying) {
        audioElement.play();
    } else {
        audioElement.pause();
    }
    isPlaying = !isPlaying;
});