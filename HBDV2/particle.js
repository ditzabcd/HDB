// Particle System untuk Website Ulang Tahun Sahila (FIXED VERSION)
// Dengan background hitam transparan dan performa tinggi

let particleSystem = null;
let particles = [];
let animationFrameId = null;

function initParticles() {
    console.log("Initializing particle system with dark transparent background...");
    
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) {
        console.error("Particle canvas not found!");
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Konfigurasi partikel - OPTIMIZED untuk performa
    const config = {
        particleCount: 70,           // Jumlah optimal untuk performa bagus
        particleSize: 3,             // Ukuran partikel
        particleSpeed: 0.5,          // Kecepatan
        lineDistance: 100,           // Jarak garis
        particleColor: 'rgba(255, 255, 255, 0.7)', // Warna partikel putih
        lineColor: 'rgba(255, 255, 255, 0.2)',     // Warna garis tipis
        trailEffect: true,           // Efek trail/jejak
        useGpu: true,
        showLines: true,
        fps: 24                      // Frame rate optimal
    };
    
    // Inisialisasi array partikel
    particles = [];
    
    // Buat partikel dengan posisi acak
    for (let i = 0; i < config.particleCount; i++) {
        particles.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            speedX: (Math.random() - 0.5) * config.particleSpeed,
            speedY: (Math.random() - 0.5) * config.particleSpeed,
            size: Math.random() * config.particleSize + 1,
            color: config.particleColor,
            originalSize: 0
        });
        
        // Simpan ukuran asli
        particles[i].originalSize = particles[i].size;
    }
    
    // Variabel untuk optimasi frame rate
    let lastTime = 0;
    let frameCount = 0;
    
    // Fungsi utama untuk menggambar partikel
    function drawParticles(timestamp) {
        // Batasi frame rate untuk performa
        if (timestamp - lastTime < 1000 / config.fps) {
            animationFrameId = requestAnimationFrame(drawParticles);
            return;
        }
        lastTime = timestamp;
        frameCount++;
        
        // BACKGROUND HITAM TRANSPARAN (seperti yang kamu mau)
        // Ini yang bikin efek "trail" atau jejak partikel
        if (config.trailEffect) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Hitam sangat transparan
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        } else {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        }
        
        // Update dan gambar partikel
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Update posisi
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Pantulkan di tepi canvas
            if (p.x < 0 || p.x > canvasWidth) p.speedX *= -1;
            if (p.y < 0 || p.y > canvasHeight) p.speedY *= -1;
            
            // Efek "breathing" pada partikel (ukuran berubah pelan)
            p.size = p.originalSize + Math.sin(frameCount * 0.05 + i) * 0.5;
            
            // Gambar partikel
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            
            // Gradient untuk partikel (lebih menarik)
            const gradient = ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.5, p.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Tambahkan glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        // Gambar garis penghubung ANTARA PARTIKEL TERDEKAT SAJA (optimasi)
        if (config.showLines) {
            ctx.strokeStyle = config.lineColor;
            ctx.lineWidth = 0.5;
            
            // Optimasi: hanya cek partikel yang berdekatan
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                
                // Hanya cek 10 partikel terdekat untuk optimasi
                for (let j = i + 1; j < Math.min(i + 15, particles.length); j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = dx * dx + dy * dy; // Tanpa sqrt untuk performa
                    
                    // Jika jaraknya dekat, gambar garis
                    if (distance < config.lineDistance * config.lineDistance) {
                        const alpha = 0.3 * (1 - Math.sqrt(distance) / config.lineDistance);
                        
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Tambahkan efek khusus setiap 100 frame
        if (frameCount % 100 === 0) {
            createSparkle();
        }
        
        animationFrameId = requestAnimationFrame(drawParticles);
    }
    
    // Fungsi untuk membuat efek sparkle/kemilau sesekali
    function createSparkle() {
        const sparkleCount = 3;
        
        for (let i = 0; i < sparkleCount; i++) {
            const x = Math.random() * canvasWidth;
            const y = Math.random() * canvasHeight;
            const size = Math.random() * 4 + 2;
            
            // Gambar sparkle
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Efek glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(255, 215, 0, 0.7)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // Handle resize window dengan debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            
            // Atur ulang posisi partikel
            particles.forEach(p => {
                p.x = Math.random() * canvasWidth;
                p.y = Math.random() * canvasHeight;
            });
        }, 250);
    });
    
    // Interaksi mouse (opsional, bisa dimatikan jika berat)
    let mouseX = -1000;
    let mouseY = -1000;
    const mouseRadius = 120;
    
    canvas.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Efek interaksi dengan partikel
        particles.forEach(p => {
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRadius) {
                const force = (mouseRadius - distance) / mouseRadius;
                const angle = Math.atan2(dy, dx);
                
                p.x -= Math.cos(angle) * force * 8;
                p.y -= Math.sin(angle) * force * 8;
                p.size = p.originalSize * 1.5; // Partikel membesar saat dekat mouse
            }
        });
    });
    
    canvas.addEventListener('mouseleave', function() {
        mouseX = -1000;
        mouseY = -1000;
    });
    
    // Optimasi GPU
    if (config.useGpu) {
        canvas.style.willChange = 'transform';
        canvas.style.transform = 'translateZ(0)';
    }
    
    // Hentikan animasi sebelumnya jika ada
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Mulai animasi
    particleSystem = drawParticles;
    animationFrameId = requestAnimationFrame(drawParticles);
    
    console.log(`Particle system started with ${config.particleCount} particles`);
    console.log('Background: black transparent with trail effect');
}

// Fungsi untuk mengubah pengaturan partikel (hanya developer)
function updateParticleSettings(newConfig) {
    console.log('Updating particle settings...');
    // Implementasi sesuai kebutuhan
}

// Fungsi untuk menghentikan partikel
function stopParticles() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        console.log('Particle animation stopped');
    }
}

// Fungsi untuk mode performa tinggi (kurangi efek)
function setPerformanceMode(highPerformance) {
    if (highPerformance) {
        console.log('Switching to high performance mode...');
        // Kurangi jumlah partikel dan matikan efek tertentu
        // Implementasi bisa ditambahkan
    }
}

console.log('Particle System loaded with dark transparent background!');