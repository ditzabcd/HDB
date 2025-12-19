// Gallery Manager untuk Website Ulang Tahun Sahila - FIXED

function initGallery() {
    console.log("🎨 Initializing gallery...");
    
    // Data gallery (dapat diganti di source code)
    const galleryData = {
        photos: [
            {
                id: 1,
                url: "https://files.catbox.moe/xc49i7.jpg",
                caption: "Lucuu"
            },
            {
                id: 2,
                url: "https://files.catbox.moe/o4n3rp.jpg",
                caption: "Lucu jugaa"
            },
            {
                id: 3,
                url: "https://files.catbox.moe/dd3pex.png",
                caption: "XIXI"
            },
            {
                id: 4,
                url: "https://files.catbox.moe/r6r856.png",
                caption: "Lucu semua woi"
            }
        ],
        foods: [
            {
                id: 1,
                url: "https://files.catbox.moe/w1rbe1.jpg",
                name: "Coklatttt"
            },
            {
                id: 2,
                url: "https://files.catbox.moe/ikrggj.jpg",
                name: "Mie Ayam"
            },
            {
                id: 3,
                url: "https://files.catbox.moe/uzod3y.jpg",
                name: "Ice cream xiixix"
            },
            {
                id: 4,
                url: "https://files.catbox.moe/jacwr4.jpg", // FIX: hapus "h" di depan https
                name: "Seblak apcb"
            }
        ]
    };
    
    // Fungsi untuk memuat gallery
    function loadGallery() {
        const galleryGrid = document.querySelector('.gallery-grid');
        const foodGrid = document.querySelector('.food-grid');
        
        // Kosongkan konten sebelum memuat ulang
        if (galleryGrid) galleryGrid.innerHTML = '';
        if (foodGrid) foodGrid.innerHTML = '';
        
        // Load foto gallery
        galleryData.photos.forEach(photo => {
            const photoContainer = document.createElement('div');
            photoContainer.className = 'photo-container';
            
            photoContainer.innerHTML = `
                <div class="photo-frame">
                    <img src="${photo.url}" alt="${photo.caption}" class="gallery-photo" loading="lazy">
                    <div class="photo-caption">${photo.caption}</div>
                </div>
            `;
            
            if (galleryGrid) {
                galleryGrid.appendChild(photoContainer);
            }
        });
        
        // Load foto makanan
        galleryData.foods.forEach(food => {
            const foodItem = document.createElement('div');
            foodItem.className = 'food-item';
            
            foodItem.innerHTML = `
                <img src="${food.url}" alt="${food.name}" loading="lazy">
                <p>${food.name}</p>
            `;
            
            if (foodGrid) {
                foodGrid.appendChild(foodItem);
            }
        });
        
        // Tambahkan event listeners setelah gallery dimuat
        addGalleryEventListeners();
    }
    
    // Fungsi untuk menambahkan event listeners ke gallery
    function addGalleryEventListeners() {
        // Efek hover untuk foto gallery
        const galleryPhotos = document.querySelectorAll('.gallery-photo');
        galleryPhotos.forEach(photo => {
            photo.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            photo.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            // Klik untuk zoom (efek sederhana)
            photo.addEventListener('click', function() {
                const overlay = document.createElement('div');
                overlay.className = 'photo-overlay';
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    cursor: pointer;
                    animation: fadeIn 0.3s ease;
                `;
                
                const enlargedImg = document.createElement('img');
                enlargedImg.src = this.src;
                enlargedImg.style.cssText = `
                    max-width: 90%;
                    max-height: 90%;
                    border-radius: 10px;
                    box-shadow: 0 0 30px rgba(255, 105, 180, 0.5);
                    animation: zoomIn 0.3s ease;
                `;
                
                const caption = this.alt;
                if (caption) {
                    const captionEl = document.createElement('div');
                    captionEl.textContent = caption;
                    captionEl.style.cssText = `
                        position: absolute;
                        bottom: 20px;
                        left: 0;
                        width: 100%;
                        text-align: center;
                        color: white;
                        font-size: 1.2rem;
                        padding: 10px;
                        background: rgba(0, 0, 0, 0.5);
                    `;
                    overlay.appendChild(captionEl);
                }
                
                overlay.appendChild(enlargedImg);
                document.body.appendChild(overlay);
                
                // Close dengan klik atau ESC
                function closeOverlay() {
                    if (overlay.parentNode) {
                        overlay.remove();
                    }
                    document.removeEventListener('keydown', handleEsc);
                }
                
                function handleEsc(e) {
                    if (e.key === 'Escape') closeOverlay();
                }
                
                overlay.addEventListener('click', closeOverlay);
                document.addEventListener('keydown', handleEsc);
                
                // Tambah style untuk animasi
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    
                    @keyframes zoomIn {
                        from { transform: scale(0.8); opacity: 0; }
                        to { transform: scale(1); opacity: 1; }
                    }
                `;
                document.head.appendChild(style);
            });
        });
        
        // Efek untuk makanan
        const foodImages = document.querySelectorAll('.food-item img');
        foodImages.forEach(img => {
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1) rotate(5deg)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
    
    // Fungsi untuk update gallery (dapat dipanggil dari source code)
    window.updateGallery = function(newPhotos, newFoods) {
        if (newPhotos) {
            galleryData.photos = newPhotos;
        }
        
        if (newFoods) {
            galleryData.foods = newFoods;
        }
        
        loadGallery();
        console.log("✅ Gallery updated!");
    };
    
    // Load gallery saat pertama kali
    loadGallery();
    
    console.log("✅ Gallery initialized!");
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initGallery, 500);
});

console.log('🎨 Gallery Manager loaded!');