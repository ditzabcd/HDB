// Audio Manager - SMART MUSIC SYNC
console.log('🎵 Audio Manager loading...');

let currentPlaylistAudio = null;
let currentPlayingCard = null;
let backgroundMusic = null;
let isBackgroundPlaying = false;

// PLAYLIST - GANTI URL DISINI
const playlist = [
    "https://files.catbox.moe/45ork3.mp3",    // Lagu 1
    "https://files.catbox.moe/t6hpcb.mp3",    // Lagu 2  
    "https://files.catbox.moe/727gvt.mp3",    // Lagu 3
    "https://files.catbox.moe/pnfhx8.mp3",    // Lagu 4
    "https://files.catbox.moe/kod8h0.mp3"     // Lagu 5
];

// Background music (bisa sama atau beda dari playlist)
const backgroundMusicUrl = "https://files.catbox.moe/45ork3.mp3"; // Lagu pertama

// ========== BACKGROUND MUSIC ==========
function startBackgroundMusic() {
    // Get or create background music element
    backgroundMusic = document.getElementById('backgroundMusic');
    
    if (!backgroundMusic) {
        backgroundMusic = new Audio();
        backgroundMusic.id = 'backgroundMusic';
        backgroundMusic.loop = true; // LOOPING!
        backgroundMusic.volume = 0.5; // Volume sedang
        document.body.appendChild(backgroundMusic);
    }
    
    backgroundMusic.src = backgroundMusicUrl;
    backgroundMusic.loop = true; // PASTIKAN LOOPING
    
    // Coba play background music
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log("🎶 Background music started (looping)");
            isBackgroundPlaying = true;
            updateMusicIndicator();
        }).catch(error => {
            console.log("⚠️ Background music waiting for interaction");
            // Tunggu interaksi user
            document.addEventListener('click', function startBGOnce() {
                backgroundMusic.play().then(() => {
                    isBackgroundPlaying = true;
                    updateMusicIndicator();
                });
                document.removeEventListener('click', startBGOnce);
            });
        });
    }
    
    // Event listeners untuk background music
    backgroundMusic.addEventListener('play', () => {
        isBackgroundPlaying = true;
        updateMusicIndicator();
    });
    
    backgroundMusic.addEventListener('pause', () => {
        isBackgroundPlaying = false;
        updateMusicIndicator();
    });
}

// ========== PLAYLIST MUSIC ==========
function togglePlaylistSong(songUrl, card) {
    console.log("🎵 Playlist toggle:", songUrl.substring(0, 40) + "...");
    
    // Jika lagu yang sama sedang diputar, pause
    if (currentPlaylistAudio && currentPlayingCard === card) {
        if (!currentPlaylistAudio.paused) {
            // PAUSE playlist music
            currentPlaylistAudio.pause();
            updateButtonIcon(card, 'play');
            card.classList.remove('playing');
            
            // RESTART background music (karena playlist pause)
            if (backgroundMusic && !isBackgroundPlaying) {
                backgroundMusic.play().then(() => {
                    console.log("🔁 Background music restarted (playlist paused)");
                });
            }
            return;
        } else {
            // RESUME playlist music
            currentPlaylistAudio.play();
            updateButtonIcon(card, 'pause');
            card.classList.add('playing');
            
            // PAUSE background music (karena playlist play)
            if (backgroundMusic && isBackgroundPlaying) {
                backgroundMusic.pause();
                console.log("⏸️ Background music paused (playlist playing)");
            }
            return;
        }
    }
    
    // Stop previous playlist audio
    if (currentPlaylistAudio) {
        currentPlaylistAudio.pause();
        if (currentPlayingCard) {
            updateButtonIcon(currentPlayingCard, 'play');
            currentPlayingCard.classList.remove('playing');
        }
    }
    
    // PAUSE background music sebelum play playlist
    if (backgroundMusic && isBackgroundPlaying) {
        backgroundMusic.pause();
        console.log("⏸️ Background music paused for playlist");
    }
    
    // Play new playlist song
    currentPlaylistAudio = new Audio(songUrl);
    currentPlayingCard = card;
    
    currentPlaylistAudio.play().then(() => {
        updateButtonIcon(card, 'pause');
        card.classList.add('playing');
        console.log("▶️ Playlist song playing");
    }).catch(e => {
        console.log("❌ Play failed:", e);
    });
    
    // When playlist song ends
    currentPlaylistAudio.addEventListener('ended', () => {
        console.log("✅ Playlist song ended");
        updateButtonIcon(card, 'play');
        card.classList.remove('playing');
        currentPlaylistAudio = null;
        currentPlayingCard = null;
        
        // RESTART background music setelah playlist selesai
        if (backgroundMusic && !isBackgroundPlaying) {
            setTimeout(() => {
                backgroundMusic.play().then(() => {
                    console.log("🔁 Background music auto-restarted");
                });
            }, 500);
        }
    });
}

// ========== CONTROL FUNCTIONS ==========
function updateButtonIcon(card, state) {
    const btn = card.querySelector('.song-play-btn');
    if (btn) {
        btn.innerHTML = state === 'play' ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
        btn.classList.toggle('playing', state === 'pause');
    }
}

function resetAllButtons() {
    document.querySelectorAll('.song-card').forEach(card => {
        updateButtonIcon(card, 'play');
        card.classList.remove('playing');
    });
}

function playAllSongs() {
    const firstCard = document.querySelector('.song-card');
    if (firstCard && playlist[0]) {
        togglePlaylistSong(playlist[0], firstCard);
    }
}

function pauseAllSongs() {
    if (currentPlaylistAudio) {
        currentPlaylistAudio.pause();
        resetAllButtons();
        currentPlaylistAudio = null;
        currentPlayingCard = null;
        
        // Restart background music
        if (backgroundMusic && !isBackgroundPlaying) {
            backgroundMusic.play().then(() => {
                console.log("🔁 Background music resumed (all songs paused)");
            });
        }
    }
}

function shufflePlaylist() {
    const container = document.querySelector('.playlist-songs');
    const cards = Array.from(document.querySelectorAll('.song-card'));
    
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    cards.forEach(card => container.appendChild(card));
    attachSongListeners();
}

// ========== EVENT LISTENERS ==========
function attachSongListeners() {
    document.querySelectorAll('.song-card').forEach((card, index) => {
        if (playlist[index]) {
            card.setAttribute('data-audio', playlist[index]);
        }
        
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.song-play-btn')) {
                const songUrl = this.getAttribute('data-audio');
                togglePlaylistSong(songUrl, this);
            }
        });
        
        const playBtn = card.querySelector('.song-play-btn');
        if (playBtn) {
            playBtn.onclick = function(e) {
                e.stopPropagation();
                const songUrl = card.getAttribute('data-audio');
                togglePlaylistSong(songUrl, card);
            };
        }
    });
}

// ========== MUSIC INDICATOR ==========
function updateMusicIndicator() {
    let indicator = document.getElementById('musicStatus');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'musicStatus';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(255, 105, 180, 0.8);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(5px);
            cursor: pointer;
            transition: all 0.3s;
        `;
        indicator.addEventListener('click', toggleBackgroundMusic);
        document.body.appendChild(indicator);
    }
    
    if (currentPlaylistAudio && !currentPlaylistAudio.paused) {
        indicator.innerHTML = '<i class="fas fa-headphones"></i> Playing Playlist';
        indicator.style.background = 'rgba(0, 200, 0, 0.8)';
    } else if (isBackgroundPlaying) {
        indicator.innerHTML = '<i class="fas fa-music"></i> Background Music';
        indicator.style.background = 'rgba(255, 105, 180, 0.8)';
    } else {
        indicator.innerHTML = '<i class="fas fa-volume-mute"></i> Music Off';
        indicator.style.background = 'rgba(100, 100, 100, 0.5)';
    }
}

function toggleBackgroundMusic() {
    if (backgroundMusic) {
        if (isBackgroundPlaying) {
            backgroundMusic.pause();
        } else {
            // Jangan start background music kalo playlist sedang play
            if (!currentPlaylistAudio || currentPlaylistAudio.paused) {
                backgroundMusic.play().catch(e => console.log("BG play failed:", e));
            }
        }
    }
}

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Setting up audio player...');
    
    // Start background music (looping)
    startBackgroundMusic();
    
    // Setup playlist
    setTimeout(() => {
        attachSongListeners();
        
        // Control buttons
        document.getElementById('playAllBtn')?.addEventListener('click', playAllSongs);
        document.getElementById('pauseAllBtn')?.addEventListener('click', pauseAllSongs);
        document.getElementById('shuffleBtn')?.addEventListener('click', shufflePlaylist);
        
        console.log('✅ Audio player ready!');
        console.log('🎶 Background music: LOOPING');
        console.log('🔀 Smart sync: Background auto-pause when playlist plays');
    }, 1000);
});

console.log('🎵 Audio Manager loaded with smart sync!');