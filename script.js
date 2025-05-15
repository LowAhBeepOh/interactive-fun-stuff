let currentIndex = 0;
let textData = [];
const textContainer = document.getElementById("textContainer");

async function loadSong(songName) {
    try {
        const response = await fetch(`lyrics/${songName}.json`);
        const songData = await response.json();
        textData = songData.lyrics;
        
        // Update audio source
        const audio = document.getElementById('bgAudio');
        if (audio) {
            audio.src = `songs/${songData.audioFile}`;
        }
        
        return songData.initialDelay;
    } catch (error) {
        console.error('Error loading song data:', error);
        return 0;
    }
}

function updateText() {
    const currentData = textData[currentIndex];
    textContainer.textContent = currentData.text;
    textContainer.style.color = currentData.textColor;
    document.body.style.backgroundColor = currentData.backgroundColor;
    
    // Apply font styles
    textContainer.style.fontFamily = currentData.fontFamily || "Instrument Serif";
    textContainer.style.fontWeight = currentData.fontWeight || 400;
    textContainer.style.fontStyle = currentData.italic ? "italic" : "normal";

    if (currentIndex < textData.length - 1) {
        setTimeout(() => {
            currentIndex++;
            updateText();
        }, textData[currentIndex].duration);
    }
}

let textStarted = false;

async function startLyrics() {
    if (!textStarted) {
        textStarted = true;
        const initialDelay = await loadSong('california_and_me');
        setTimeout(() => {
            updateText();
        }, initialDelay);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bgAudio');
    if (audio) {
        const playAudio = () => {
            audio.play().then(() => {
                startLyrics();
            }).catch(() => {});
            window.removeEventListener('click', playAudio);
            window.removeEventListener('keydown', playAudio);
        };
        // Try to play immediately
        audio.play().then(() => {
            startLyrics();
        }).catch(() => {
            // If blocked, wait for user interaction
            window.addEventListener('click', playAudio);
            window.addEventListener('keydown', playAudio);
        });
    }
});

// sigma