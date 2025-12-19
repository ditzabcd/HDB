// Main Script untuk Website Ulang Tahun Sahila

document.addEventListener('DOMContentLoaded', function() {
    // Elemen DOM
    const introSection = document.getElementById('intro');
    const unlockPage = document.getElementById('unlockPage');
    const mainPage = document.getElementById('mainPage');
    const usernameInput = document.getElementById('usernameInput');
    const unlockButton = document.getElementById('unlockButton');
    const unlockError = document.getElementById('unlockError');
    const countdownProgress = document.querySelector('.countdown-progress');
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const particleCanvas = document.getElementById('particleCanvas');
    
    // Username yang benar (case-insensitive)
    const correctUsername = 'sahila';
    
    // Intro countdown
    let introProgress = 0;
    const introInterval = setInterval(() => {
        introProgress += 1;
        countdownProgress.style.width = `${introProgress}%`;
        
        if (introProgress >= 100) {
            clearInterval(introInterval);
            setTimeout(() => {
                introSection.classList.add('hidden');
                unlockPage.classList.remove('hidden');
                // Mulai efek partikel untuk halaman unlock
                if (typeof initUnlockParticles === 'function') {
                    initUnlockParticles();
                }
            }, 500);
        }
    }, 50); // 5 detik total

    // Fungsi untuk membuka kunci
    unlockButton.addEventListener('click', unlockWebsite);
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            unlockWebsite();
        }
    });

    function unlockWebsite() {
        const enteredUsername = usernameInput.value.trim();
        
        // Validasi username (case-insensitive)
        if (enteredUsername.toLowerCase() === correctUsername.toLowerCase()) {
            unlockError.textContent = '';
            unlockPage.classList.add('hidden');
            mainPage.classList.remove('hidden');
            
            // Mulai musik background TANPA LOOP
            if (typeof startBackgroundMusic === 'function') {
                startBackgroundMusic();
            }
            
            // Mulai efek partikel utama
            if (typeof initParticles === 'function') {
                initParticles();
            }
            
            // Mulai efek interaktif
            if (typeof initEffects === 'function') {
                initEffects();
            }
            
            // Scroll ke atas
            window.scrollTo(0, 0);
            
            // Auto-pause background music jika user play lagu lain
            setTimeout(() => {
                const bgMusic = document.getElementById('backgroundMusic');
                if (bgMusic) {
                    bgMusic.addEventListener('play', function() {
                        // Jika user play lagu dari playlist, pause background music
                        if (typeof currentAudio !== 'undefined' && currentAudio) {
                            bgMusic.pause();
                        }
                    });
                }
            }, 1000);
            
        } else {
            unlockError.textContent = 'Username salah! Coba lagi.';
            usernameInput.value = '';
            usernameInput.focus();
            
            // Efek shake pada input
            usernameInput.classList.add('shake');
            setTimeout(() => {
                usernameInput.classList.remove('shake');
            }, 500);
        }
    }

    // Navigasi antar halaman
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Tampilkan halaman yang sesuai
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetPage}Page`) {
                    section.classList.add('active');
                }
            });
            
            // Scroll ke atas halaman
            document.querySelector('.main-content').scrollTop = 0;
            
            // Jika berpindah ke playlist, update UI
            if (targetPage === 'playlist') {
                setTimeout(() => {
                    if (typeof updatePlaylistUI === 'function') {
                        updatePlaylistUI();
                    }
                    if (typeof attachSongEventListeners === 'function') {
                        attachSongEventListeners();
                    }
                }, 100);
            }
        });
    });

    // Efek untuk gambar gallery
    const galleryPhotos = document.querySelectorAll('.gallery-photo');
    galleryPhotos.forEach(photo => {
        photo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        photo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Efek untuk kartu fitur
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Tambahkan kelas CSS untuk animasi shake
    const style = document.createElement('style');
    style.textContent = `
        .shake {
            animation: shake 0.5s;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        /* Efek untuk lagu yang sedang diputar */
        .song-card.playing {
            background: rgba(255, 105, 180, 0.2) !important;
            border-left: 4px solid #ff69b4;
        }
        
        .song-play-btn.playing {
            background: linear-gradient(135deg, #ff0000, #ff69b4) !important;
            animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 105, 180, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 105, 180, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 105, 180, 0); }
        }
    `;
    document.head.appendChild(style);
    
    // Inisialisasi gallery jika ada
    if (typeof initGallery === 'function') {
        initGallery();
    }
    
    console.log('✅ Website Ulang Tahun Sahila siap!');
});