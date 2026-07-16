// --- New Card Graduation Invitation JS Logic ---

document.addEventListener("DOMContentLoaded", () => {
    // 1. DOM Elements
    const envelopeContainer = document.getElementById("envelope");
    const triggerOpenBtn = document.getElementById("trigger-open-btn");
    const envelopeSection = document.getElementById("envelope-section");
    const invitationCardSection = document.getElementById("invitation-card-section");
    const backToEnvelopeBtn = document.getElementById("back-to-envelope");
    const musicToggleBtn = document.getElementById("music-toggle");
    
    const rsvpForm = document.getElementById("rsvp-form");
    const rsvpSuccessOverlay = document.getElementById("rsvp-success");
    const closeSuccessBtn = document.getElementById("close-success-btn");
    const wishesListContainer = document.getElementById("wishes-list");

    // 2. Interactive Envelope Navigation
    envelopeContainer.addEventListener("click", (e) => {
        // Prevent trigger button from double-firing envelope events
        if (e.target.id === "trigger-open-btn" || e.target.classList.contains("open-card-btn")) {
            return;
        }
        envelopeContainer.classList.toggle("open");
    });

    // Clicking "Mở Thiệp" button slides card out and reveals full screen
    triggerOpenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        // Start playing music if not started yet
        if (!audioContext) {
            initSynthMusic();
        }
        if (isMusicMuted) {
            toggleMusicState();
        }

        // Add class to scale letter and slide it out
        envelopeContainer.classList.add("open");
        
        setTimeout(() => {
            envelopeSection.classList.add("hidden");
            invitationCardSection.className = "card-section-active";
            resizeSashCanvases(); // Resize sash canvases now that they are visible
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 600); // sync with open-letter transition
    });

    // Go back to Envelope view
    backToEnvelopeBtn.addEventListener("click", () => {
        invitationCardSection.className = "card-section-hidden";
        envelopeSection.classList.remove("hidden");
        envelopeContainer.classList.remove("open");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });


    // 3. Floating Gold Particles Canvas
    const canvas = document.getElementById("particle-canvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    const maxParticles = 35;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 20;
            this.size = Math.random() * 6 + 3;
            this.speedY = -(Math.random() * 0.9 + 0.3);
            this.speedX = Math.random() * 0.4 - 0.2;
            const rand = Math.random();
            if (rand < 0.15) {
                this.type = "cap";
            } else if (rand < 0.6) {
                this.type = "star";
            } else {
                this.type = "circle";
            }
            this.opacity = Math.random() * 0.4 + 0.2;
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = (Math.random() * 0.015 - 0.007);
            
            // Gold Color Theme Palette (matching champagne gold)
            if (this.type === "star") {
                this.color = `rgba(223, 184, 135, ${this.opacity})`; // Warm Gold
            } else if (this.type === "cap") {
                this.color = `rgba(240, 212, 178, ${this.opacity})`; // Bright Gold
            } else {
                this.color = `rgba(176, 141, 92, ${this.opacity})`;  // Darker Gold
            }
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.angle += this.spinSpeed;

            if (this.y < -30 || this.x < -30 || this.x > canvas.width + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            if (this.type === "cap") {
                // Draw Mortarboard cap
                ctx.fillStyle = this.color;
                
                // 1. Draw top diamond
                ctx.beginPath();
                ctx.moveTo(0, -this.size * 0.6);
                ctx.lineTo(this.size * 1.2, 0);
                ctx.lineTo(0, this.size * 0.6);
                ctx.lineTo(-this.size * 1.2, 0);
                ctx.closePath();
                ctx.fill();

                // 2. Draw cap band below diamond
                ctx.beginPath();
                ctx.moveTo(-this.size * 0.6, 0);
                ctx.quadraticCurveTo(0, this.size * 0.8, this.size * 0.6, 0);
                ctx.lineTo(this.size * 0.5, this.size * 0.4);
                ctx.quadraticCurveTo(0, this.size * 0.9, -this.size * 0.5, this.size * 0.4);
                ctx.closePath();
                ctx.fill();

                // 3. Draw gold tassel
                ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(this.size * 0.6, this.size * 0.3, this.size * 0.8, this.size * 0.8);
                ctx.stroke();

                ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
                ctx.beginPath();
                ctx.arc(this.size * 0.8, this.size * 0.8, 1, 0, Math.PI * 2);
                ctx.fill();

            } else if (this.type === "star") {
                // Draw 4-point elegant star
                ctx.fillStyle = this.color;
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    ctx.lineTo(0, -this.size);
                    ctx.quadraticCurveTo(0, 0, this.size, 0);
                    ctx.rotate(Math.PI / 2);
                }
                ctx.closePath();
                ctx.fill();
            } else {
                // Soft gold circles
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }


    // --- 3b. Waving Sash Canvas Wave Animation ---
    const sashLeftCanvas = document.getElementById("sash-left-canvas");
    const sashRightCanvas = document.getElementById("sash-right-canvas");
    
    const ctxLeft = sashLeftCanvas ? sashLeftCanvas.getContext("2d") : null;
    const ctxRight = sashRightCanvas ? sashRightCanvas.getContext("2d") : null;

    // Load sashes from parent image directory
    const imgLeft = new Image();
    imgLeft.src = "../image/sash-left.png";

    const imgRight = new Image();
    imgRight.src = "../image/sash-right.png";

    function resizeSashCanvases() {
        [sashLeftCanvas, sashRightCanvas].forEach(canvas => {
            if (!canvas) return;
            let rect = canvas.getBoundingClientRect();
            let width = rect.width;
            let height = rect.height;
            
            // Fallback to CSS rules if container is hidden (dimensions are 0)
            if (width === 0 || height === 0) {
                const style = window.getComputedStyle(canvas);
                width = parseFloat(style.width) || 120;
                height = parseFloat(style.height) || 560;
            }
            
            const dpr = window.devicePixelRatio || 1;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
        });
    }

    // Draw displacement waving sash with 3D lighting folds (CORS-safe)
    function drawWavingSash(ctx, img, canvas, time) {
        if (!ctx || !img.complete || img.naturalWidth === 0) return;
        
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const slices = 120;
        const imgWidth = img.width;
        const imgHeight = img.height;
        const sliceHeight = imgHeight / slices;
        const displaySliceHeight = h / slices;

        const frequency = 0.12; // wave frequency
        const speed = time * 0.0035; // wave speed
        const amplitude = w * 0.075; // horizontal wave offset (7.5% of canvas width)

        for (let i = 0; i < slices; i++) {
            const sy = i * sliceHeight;
            const dy = i * displaySliceHeight;

            // Pinned at the top: factor goes from 0 at top to 1 at bottom
            const factor = i / slices;
            
            // Horizontal shift
            const dx = Math.sin(i * frequency - speed) * amplitude * factor;

            // Keep within bounds: leave margin for wave swing
            const margin = amplitude * 1.6;
            const destWidth = w - margin;
            const destX = dx + (margin / 2);

            // Draw the textured slice
            ctx.drawImage(
                img, 
                0, sy, imgWidth, sliceHeight,
                destX, dy, destWidth, displaySliceHeight
            );

            // 3D Lighting/shadow fold illusion (cosine matches wave slope)
            const shadowIntensity = Math.cos(i * frequency - speed) * 0.16 * factor;
            if (shadowIntensity > 0) {
                // Valley fold shadow
                ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity})`;
                ctx.fillRect(destX, dy, destWidth, displaySliceHeight);
            } else {
                // Peak fold highlight
                ctx.fillStyle = `rgba(255, 255, 255, ${-shadowIntensity * 0.6})`;
                ctx.fillRect(destX, dy, destWidth, displaySliceHeight);
            }
        }
    }

    function animateParticles(currentTime) {
        if (!currentTime) currentTime = 0;

        // 1. Particle Canvas update
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // 2. Sash Canvases update
        if (ctxLeft) drawWavingSash(ctxLeft, imgLeft, sashLeftCanvas, currentTime);
        if (ctxRight) drawWavingSash(ctxRight, imgRight, sashRightCanvas, currentTime);

        requestAnimationFrame(animateParticles);
    }
    
    // Set up canvases resize hooks
    window.addEventListener("resize", () => {
        resizeCanvas();
        resizeSashCanvases();
    });
    
    setTimeout(resizeSashCanvases, 100);
    animateParticles();


    // 4. Countdown Timer Logic
    const targetDate = new Date("October 15, 2026 08:00:00").getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            document.getElementById("countdown-timer").innerHTML = `
                <div class="timer-segment" style="min-width: 200px;">
                    <span class="number" style="font-size: 1.4rem; color: var(--color-gold);">Buổi lễ tốt nghiệp đang diễn ra!</span>
                </div>
            `;
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, "0");
        document.getElementById("hours").innerText = hours.toString().padStart(2, "0");
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, "0");
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, "0");
    }
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);


    // 5. Ambient Synthesizer Music (Web Audio API)
    let audioContext = null;
    let synthInterval = null;
    let isMusicMuted = true;

    // Pentatonic scale major chords chimes for warm ambient audio
    const melodyNotes = [
        [261.63, 329.63, 392.00, 493.88], // C Maj7 (C4, E4, G4, B4)
        [293.66, 349.23, 440.00, 523.25], // D min7 (D4, F4, A4, C5)
        [349.23, 440.00, 523.25, 587.33], // F Maj7 (F4, A4, C5, D5)
        [392.00, 493.88, 587.33, 659.25]  // G Maj9 (G4, B4, D5, E5)
    ];
    let chordIndex = 0;

    function initSynthMusic() {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContextClass();
    }

    function playSoftArpeggio() {
        if (!audioContext || audioContext.state === "suspended" || isMusicMuted) return;

        const now = audioContext.currentTime;
        const chord = melodyNotes[chordIndex];
        
        chord.forEach((freq, index) => {
            const noteDelay = index * 0.35 + Math.random() * 0.1;
            
            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now + noteDelay);

            const oscHarmonic = audioContext.createOscillator();
            const harmonicGain = audioContext.createGain();
            oscHarmonic.type = "triangle";
            oscHarmonic.frequency.setValueAtTime(freq * 2, now + noteDelay);
            
            gainNode.gain.setValueAtTime(0, now + noteDelay);
            gainNode.gain.linearRampToValueAtTime(0.04, now + noteDelay + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, now + noteDelay + 3.0);

            harmonicGain.gain.setValueAtTime(0, now + noteDelay);
            harmonicGain.gain.linearRampToValueAtTime(0.015, now + noteDelay + 0.05);
            harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + noteDelay + 1.2);

            filter.type = "lowpass";
            filter.frequency.setValueAtTime(1100, now + noteDelay);
            filter.Q.setValueAtTime(1, now + noteDelay);

            osc.connect(filter);
            oscHarmonic.connect(harmonicGain);
            harmonicGain.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);

            osc.start(now + noteDelay);
            oscHarmonic.start(now + noteDelay);
            
            osc.stop(now + noteDelay + 3.2);
            oscHarmonic.stop(now + noteDelay + 1.5);
        });

        chordIndex = (chordIndex + 1) % melodyNotes.length;
    }

    function toggleMusicState() {
        if (isMusicMuted) {
            isMusicMuted = false;
            musicToggleBtn.classList.add("playing");
            if (audioContext && audioContext.state === "suspended") {
                audioContext.resume();
            }
            playSoftArpeggio();
            synthInterval = setInterval(playSoftArpeggio, 4500);
        } else {
            isMusicMuted = true;
            musicToggleBtn.classList.remove("playing");
            if (synthInterval) {
                clearInterval(synthInterval);
                synthInterval = null;
            }
        }
    }

    musicToggleBtn.addEventListener("click", () => {
        if (!audioContext) {
            initSynthMusic();
        }
        toggleMusicState();
    });


    // 6. Wishes & Guestbook Storage (New Card Key)
    const defaultWishes = [
        { name: "Thầy Hữu Nghĩa", attendance: "yes", wish: "Chúc mừng em Triết đã tốt nghiệp xuất sắc! Mong em luôn giữ vững đam mê học tập và phát triển sự nghiệp rực rỡ." },
        { name: "Lan Vy (Bạn Thân)", attendance: "yes", wish: "Chúc mừng tân cử nhân! Tấm thiệp Midnight Blue này đẹp và sang xịn mịn thực sự, rất hợp gu cậu." },
        { name: "Anh Nam (Gia đình)", attendance: "yes", wish: "Cả nhà tự hào về em lắm! Chúc em luôn vững bước và thành công trên chặng đường mới nhé." }
    ];

    function getWishes() {
        const stored = localStorage.getItem("graduation_wishes_new");
        if (stored) {
            return JSON.parse(stored);
        }
        localStorage.setItem("graduation_wishes_new", JSON.stringify(defaultWishes));
        return defaultWishes;
    }

    function saveWish(name, attendance, wish) {
        const wishes = getWishes();
        wishes.unshift({ name, attendance, wish });
        localStorage.setItem("graduation_wishes_new", JSON.stringify(wishes));
    }

    function renderWishes() {
        const wishes = getWishes();
        wishesListContainer.innerHTML = "";

        if (wishes.length === 0) {
            wishesListContainer.innerHTML = `
                <div class="wish-item empty-state">
                    <p>Chưa có lời chúc nào. Hãy là người đầu tiên chúc mừng nhé!</p>
                </div>
            `;
            return;
        }

        wishes.forEach(item => {
            const wishItem = document.createElement("div");
            wishItem.className = "wish-item";
            
            const attendanceLabel = item.attendance === "yes" 
                ? '<span class="wish-status attending">Sẽ tham dự</span>'
                : '<span class="wish-status declining">Không thể đến</span>';

            wishItem.innerHTML = `
                <div class="wish-header">
                    <span class="wish-name">${escapeHTML(item.name)}</span>
                    ${attendanceLabel}
                </div>
                <p class="wish-text">${escapeHTML(item.wish || "Chúc mừng ngày lễ tốt nghiệp đại học đại cát!")}</p>
            `;
            wishesListContainer.appendChild(wishItem);
        });
    }

    function escapeHTML(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    rsvpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById("guest-name");
        const attendanceInput = document.querySelector('input[name="attendance"]:checked');
        const wishInput = document.getElementById("guest-wish");

        const name = nameInput.value.trim();
        const attendance = attendanceInput ? attendanceInput.value : "yes";
        const wish = wishInput.value.trim();

        if (!name) return;

        saveWish(name, attendance, wish);
        renderWishes();

        rsvpSuccessOverlay.classList.add("show");

        nameInput.value = "";
        wishInput.value = "";
    });

    closeSuccessBtn.addEventListener("click", () => {
        rsvpSuccessOverlay.classList.remove("show");
    });

    renderWishes();
});
