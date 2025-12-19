// Effect Manager untuk Website Ulang Tahun Sahila

function initEffects() {
    console.log("Initializing effects...");
    
    // Efek hover untuk gambar makanan
    const foodItems = document.querySelectorAll('.food-item img');
    foodItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Efek klik untuk kartu fitur
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            // Efek ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size/2;
            const y = event.clientY - rect.top - size/2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            // Hapus ripple setelah animasi selesai
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Navigasi ke halaman yang sesuai
            const cardTitle = this.querySelector('h3').textContent;
            if (cardTitle.includes('Galeri')) {
                document.querySelector('[data-page="gallery"]').click();
            } else if (cardTitle.includes('Playlist')) {
                document.querySelector('[data-page="playlist"]').click();
            } else if (cardTitle.includes('Surat')) {
                document.querySelector('[data-page="letter"]').click();
            }
        });
    });
    
    // Efek parallax untuk header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.main-header');
        
        if (header) {
            if (scrolled > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.2)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.1)';
                header.style.backdropFilter = 'blur(15px)';
            }
        }
    });
    
    // Efek ketik untuk intro (jika ada)
    const introText = document.querySelector('.intro-title');
    if (introText) {
        const originalText = introText.textContent;
        introText.textContent = '';
        
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < originalText.length) {
                introText.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 150);
    }
    
    // Efek konfeti saat membuka website
    setTimeout(() => {
        createConfetti();
    }, 1000);
    
    // Tambahkan style untuk efek ripple
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    console.log("Effects initialized!");
}

// Fungsi untuk membuat efek konfeti
function createConfetti() {
    const confettiCount = 100;
    const colors = ['#ff69b4', '#9370db', '#ffd700', '#00ffff', '#ffa500'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Posisi acak
        const startX = Math.random() * window.innerWidth;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Properti konfeti
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: ${color};
            top: -20px;
            left: ${startX}px;
            opacity: ${Math.random() * 0.5 + 0.5};
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            z-index: 9999;
            pointer-events: none;
        `;
        
        document.body.appendChild(confetti);
        
        // Animasi jatuh
        const animation = confetti.animate([
            { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
            { transform: `translate(${Math.random() * 100 - 50}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        // Hapus setelah animasi selesai
        animation.onfinish = () => {
            confetti.remove();
        };
    }
}

// Efek untuk halaman unlock
function initUnlockParticles() {
    const canvas = document.getElementById('unlockCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    // Warna partikel (ungu ke pink)
    const colors = [
        'rgba(138, 43, 226, 0.8)',   // Ungu
        'rgba(218, 112, 214, 0.8)',  // Orchid
        'rgba(255, 105, 180, 0.8)',  // Pink panas
        'rgba(255, 182, 193, 0.8)'   // Pink muda
    ];
    
    // Buat partikel
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 5 + 2,
            speedX: Math.random() * 2 - 1,
            speedY: Math.random() * 2 - 1,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
    
    // Fungsi untuk menggambar partikel
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Update posisi
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Cek batas canvas
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        });
        
        requestAnimationFrame(drawParticles);
    }
    
    // Handle resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Mulai animasi
    drawParticles();
}

console.log('Effect Manager loaded!');