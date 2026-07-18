const API_URL =
  "https://script.google.com/macros/s/AKfycbwnV5bf8I-6UcP5cspUc7_XfBioARecdhYv4I9f0mq0mUX2x1Q-snPE3rTES_vdAlo/exec";
// --- Graduation Invitation JS Logic ---

document.addEventListener("DOMContentLoaded", () => {
  // 1. DOM Elements
  const envelopeContainer = document.getElementById("envelope");
  const triggerOpenBtn = document.getElementById("trigger-open-btn");
  const envelopeSection = document.getElementById("envelope-section");
  const invitationCardSection = document.getElementById(
    "invitation-card-section",
  );
  const backToEnvelopeBtn = document.getElementById("back-to-envelope");
  const musicToggleBtn = document.getElementById("music-toggle");

  const rsvpForm = document.getElementById("rsvp-form");
  const submitRsvpBtn = document.getElementById("submit-rsvp");
  const rsvpSuccessOverlay = document.getElementById("rsvp-success");
  const closeSuccessBtn = document.getElementById("close-success-btn");
  const wishesListContainer = document.getElementById("wishes-list");
  const languageToggleBtn = document.getElementById("language-toggle");

  const translations = {
    en: {
      pageTitle: "Graduation Ceremony Invitation",
      envelopeTitle: "Graduate", cordialInvitation: "CORDIAL INVITATION", invitation: "INVITATION",
      ceremony: "Graduation Ceremony", miniInvite: "Please join me in celebrating my graduation.",
      openEnvelope: "Open Envelope", tapToBegin: "Tap the invitation to begin", graduation: "GRADUATION",
      classYear: "Class of 2026", inviteLabel: "You are cordially invited to celebrate the graduation of",
      degreeTitle: "Bachelor of Science Economics and Finance",
      universityName: "University of Languages and International Studies, Vietnam National University, Hanoi",
      dateTime: "Date & Time", eventTime: "04:30 PM | Thursday", eventDate: "July 30, 2026",
      location: "Location", venueName: "Nguyen Van Dao Hall", venueAddress: "144 Xuan Thuy Street, Cau Giay District, Hanoi",
      viewMap: "View Map", countdown: "Event Countdown", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
      fullName: "Full Name", namePlaceholder: "Enter your full name...", attendanceQuestion: "Will you be attending?",
      attendingYes: "Yes, I will be delighted to attend.", attendingNo: "Regretfully, I am unable to attend :( .",
      messageLabel: "Message for the Graduate", messagePlaceholder: "Share your congratulations and best wishes...",
      sendRsvp: "Send RSVP", sendingReply: "Sending your reply", submissionSuccess: "Submission Successful!",
      successMessage: "Thank you for your RSVP and your lovely wishes.", close: "Close",
      guestbookTitle: "Messages of Congratulations", guestbookSubtitle: "Heartfelt messages from family and friends.",
      emptyWishes: "No messages yet. Be the first to leave your congratulations!", footerWelcome: "We look forward to celebrating with you.",
      backToEnvelope: "Open Envelope", attending: "Attending", declining: "Unable to attend",
      defaultWish: "Sending you my very best wishes!", eventInProgress: "The graduation ceremony is underway!",
    },
    vi: {
      pageTitle: "Thư Mời Lễ Tốt Nghiệp", envelopeTitle: "Tốt nghiệp", cordialInvitation: "TRÂN TRỌNG KÍNH MỜI",
      invitation: "THƯ MỜI", ceremony: "Lễ Tốt Nghiệp", miniInvite: "Hãy cùng tôi chúc mừng hành trình tốt nghiệp.",
      openEnvelope: "Mở Bao Thư", tapToBegin: "Chạm vào thiệp để bắt đầu", graduation: "TỐT NGHIỆP",
      classYear: "Niên khóa 2026", inviteLabel: "Trân trọng kính mời bạn đến chung vui trong lễ tốt nghiệp của",
      degreeTitle: "Cử nhân Kinh tế và Tài chính",
      universityName: "Trường Đại học Ngoại ngữ, Đại học Quốc gia Hà Nội",
      dateTime: "Thời gian", eventTime: "16:30 | Thứ Năm", eventDate: "Ngày 30 tháng 07 năm 2026",
      location: "Địa điểm", venueName: "Hội trường Nguyễn Văn Đạo", venueAddress: "144 Xuân Thủy, Cầu Giấy, Hà Nội",
      viewMap: "Xem bản đồ", countdown: "Đếm ngược đến sự kiện", days: "Ngày", hours: "Giờ", minutes: "Phút", seconds: "Giây",
      fullName: "Họ và tên", namePlaceholder: "Nhập họ và tên của bạn...", attendanceQuestion: "Bạn sẽ tham dự chứ?",
      attendingYes: "Mình sẽ đến chung vui!", attendingNo: "Tiếc quá, mình không thể đến :( .",
      messageLabel: "Lời nhắn gửi đến tân cử nhân", messagePlaceholder: "Gửi lời chúc tốt đẹp nhất của bạn...",
      sendRsvp: "Gửi xác nhận", sendingReply: "Đang gửi lời hồi đáp", submissionSuccess: "Gửi thành công!",
      successMessage: "Cảm ơn bạn đã xác nhận và gửi những lời chúc thân thương.", close: "Đóng",
      guestbookTitle: "Bảng lời chúc", guestbookSubtitle: "Những lời chúc từ gia đình và bạn bè.",
      emptyWishes: "Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc nhé!", footerWelcome: "Rất hân hạnh được đón tiếp bạn.",
      backToEnvelope: "Xem bao thư", attending: "Sẽ tham dự", declining: "Không thể đến",
      defaultWish: "Gửi đến bạn những lời chúc tốt đẹp nhất!", eventInProgress: "Lễ tốt nghiệp đang diễn ra!",
    },
  };
  let currentLanguage = localStorage.getItem("invitation-language") || "en";

  function translatePage(language) {
    const copy = translations[language];
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = copy[element.dataset.i18n];
      if (value) element.textContent = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = copy[element.dataset.i18nPlaceholder];
    });
    document.documentElement.lang = language;
    document.title = copy.pageTitle;
    languageToggleBtn.querySelector("span").textContent = language === "en" ? "VI" : "EN";
    languageToggleBtn.setAttribute("aria-label", language === "en" ? "Chuyển sang tiếng Việt" : "Switch to English");
    renderWishes();
  }

  languageToggleBtn.addEventListener("click", () => {
    currentLanguage = currentLanguage === "en" ? "vi" : "en";
    localStorage.setItem("invitation-language", currentLanguage);
    translatePage(currentLanguage);
  });

  // 2. Interactive Envelope Navigation
  const envelopeStamp = document.getElementById("envelope-stamp");

  function openEnvelope() {
    envelopeContainer.classList.add("open");

    // Start playing music if not started yet
    if (!audioContext) {
      initSynthMusic();
    }
    if (isMusicMuted) {
      toggleMusicState();
    }
  }

  // Clicking the stamp opens the envelope
  if (envelopeStamp) {
    envelopeStamp.addEventListener("click", (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  // Tapping anywhere on the closed envelope opens it; tapping its outer area
  // again closes it without interrupting interactions with the letter.
  envelopeContainer.addEventListener("click", (e) => {
    if (!envelopeContainer.classList.contains("open")) {
      openEnvelope();
      return;
    }

    if (envelopeContainer.classList.contains("open")) {
      // Don't close if clicking the inner card buttons/details
      if (
        e.target.id === "trigger-open-btn" ||
        e.target.classList.contains("open-card-btn") ||
        e.target.closest(".letter")
      ) {
        return;
      }
      envelopeContainer.classList.remove("open");
    }
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
      // Scroll to top of window
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 600); // sync with open-letter transition
  });

  // Go back to Envelope view
  backToEnvelopeBtn.addEventListener("click", () => {
    invitationCardSection.className = "card-section-hidden";
    envelopeSection.classList.remove("hidden");
    // close envelope for re-opening
    envelopeContainer.classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 3. Floating Particles Canvas (Cap + Stars)
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const maxParticles = 40;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // initial distribution
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 8 + 4;
      this.speedY = -(Math.random() * 1.2 + 0.4);
      this.speedX = Math.random() * 0.6 - 0.3;
      // Particle types: 'cap' (mortarboard), 'star', 'circle'
      const rand = Math.random();
      if (rand < 0.2) {
        this.type = "cap";
      } else if (rand < 0.6) {
        this.type = "star";
      } else {
        this.type = "circle";
      }
      this.opacity = Math.random() * 0.5 + 0.3;
      this.angle = Math.random() * Math.PI * 2;
      this.spinSpeed = Math.random() * 0.02 - 0.01;
      // Colors
      // Light blue shades or gold for stars
      if (this.type === "star") {
        this.color = `rgba(212, 175, 55, ${this.opacity})`; // Gold
      } else if (this.type === "cap") {
        this.color = `rgba(2, 132, 199, ${this.opacity})`; // Primary blue
      } else {
        this.color = `rgba(186, 230, 253, ${this.opacity})`; // Very light blue
      }
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.angle += this.spinSpeed;

      // Recyclability
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
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.6, 0);
        ctx.quadraticCurveTo(0, this.size * 0.8, this.size * 0.6, 0);
        ctx.lineTo(this.size * 0.5, this.size * 0.4);
        ctx.quadraticCurveTo(
          0,
          this.size * 0.9,
          -this.size * 0.5,
          this.size * 0.4,
        );
        ctx.closePath();
        ctx.fill();

        // 3. Draw tassel
        ctx.strokeStyle = "rgba(212, 175, 55, 0.7)"; // Gold tassel
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(
          this.size * 0.6,
          this.size * 0.3,
          this.size * 0.8,
          this.size * 0.8,
        );
        ctx.stroke();

        ctx.fillStyle = "rgba(212, 175, 55, 0.8)";
        ctx.beginPath();
        ctx.arc(this.size * 0.8, this.size * 0.8, 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === "star") {
        // Draw 4-point star (elegant)
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
        // Draw soft glowing circle/bokeh
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Initialize particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  // --- Graduation Sash Canvas Wave Animation ---
  const sashLeftCanvas = document.getElementById("sash-left-canvas");
  const sashRightCanvas = document.getElementById("sash-right-canvas");

  const ctxLeft = sashLeftCanvas ? sashLeftCanvas.getContext("2d") : null;
  const ctxRight = sashRightCanvas ? sashRightCanvas.getContext("2d") : null;

  const imgLeft = new Image();
  imgLeft.src = "image/sash-left.png";

  const imgRight = new Image();
  imgRight.src = "image/sash-right.png";

  function resizeSashCanvases() {
    [sashLeftCanvas, sashRightCanvas].forEach((canvas) => {
      if (!canvas) return;
      let rect = canvas.getBoundingClientRect();
      let width = rect.width;
      let height = rect.height;

      // Fallback to CSS rules if container is hidden (dimensions are 0)
      if (width === 0 || height === 0) {
        const style = window.getComputedStyle(canvas);
        width = parseFloat(style.width) || 110;
        height = parseFloat(style.height) || 520;
      }

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    });
  }

  // Draw displacement waving sash with 3D lighting folds
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
    const amplitude = w * 0.07; // horizontal wave offset (about 7% of width)

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
      const destX = dx + margin / 2;

      // Draw the textured slice
      ctx.drawImage(
        img,
        0,
        sy,
        imgWidth,
        sliceHeight,
        destX,
        dy,
        destWidth,
        displaySliceHeight,
      );

      // 3D Lighting/shadow fold illusion
      const shadowIntensity = Math.cos(i * frequency - speed) * 0.15 * factor;
      if (shadowIntensity > 0) {
        // Valley fold shadow
        ctx.fillStyle = `rgba(0, 0, 0, ${shadowIntensity})`;
        ctx.fillRect(destX, dy, destWidth, displaySliceHeight);
      } else {
        // Peak fold highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${-shadowIntensity * 0.7})`;
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
    if (ctxRight)
      drawWavingSash(ctxRight, imgRight, sashRightCanvas, currentTime);

    requestAnimationFrame(animateParticles);
  }

  // Set up canvases resize hooks
  setTimeout(resizeSashCanvases, 100);
  animateParticles();

  // 4. Countdown Timer Logic
  const targetDate = new Date("July 30, 2026 13:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      // Event has passed or is happening
      document.getElementById("countdown-timer").innerHTML = `
                <div class="timer-segment" style="min-width: 200px;">
                    <span class="number" style="font-size: 1.5rem; color: var(--color-primary-dark);">${translations[currentLanguage].eventInProgress}</span>
                </div>
            `;
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").innerText = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").innerText = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").innerText = seconds
      .toString()
      .padStart(2, "0");
  }

  updateCountdown(); // Run initially
  const countdownInterval = setInterval(updateCountdown, 1000);

  // 5. Ambient Synthesizer Music (Web Audio API)
  let audioContext = null;
  let synthInterval = null;
  let isMusicMuted = true;

  // Melody chord sequence (pentatonic major scale nodes for clean ambient sound)
  const melodyNotes = [
    [261.63, 329.63, 392.0, 493.88], // C Maj7 (C4, E4, G4, B4)
    [293.66, 349.23, 440.0, 523.25], // D min7 (D4, F4, A4, C5)
    [349.23, 440.0, 523.25, 587.33], // F Maj7 (F4, A4, C5, D5)
    [392.0, 493.88, 587.33, 659.25], // G Maj9 (G4, B4, D5, E5)
  ];
  let chordIndex = 0;

  function initSynthMusic() {
    // Initialize Web Audio Context
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
  }

  function playSoftArpeggio() {
    if (!audioContext || audioContext.state === "suspended" || isMusicMuted)
      return;

    const now = audioContext.currentTime;
    const chord = melodyNotes[chordIndex];

    // Randomly play notes of the current chord as a soft ambient harp/bell
    chord.forEach((freq, index) => {
      const noteDelay = index * 0.35 + Math.random() * 0.1;

      // Oscillator for bell sound
      const osc = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + noteDelay);

      // Add a tiny bit of frequency modulation or harmonics (warm triangle)
      const oscHarmonic = audioContext.createOscillator();
      const harmonicGain = audioContext.createGain();
      oscHarmonic.type = "triangle";
      oscHarmonic.frequency.setValueAtTime(freq * 2, now + noteDelay);

      // Gain envelope for soft attack and long decay (dreamy chimes)
      gainNode.gain.setValueAtTime(0, now + noteDelay);
      gainNode.gain.linearRampToValueAtTime(0.04, now + noteDelay + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + noteDelay + 3.0);

      harmonicGain.gain.setValueAtTime(0, now + noteDelay);
      harmonicGain.gain.linearRampToValueAtTime(0.015, now + noteDelay + 0.05);
      harmonicGain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + noteDelay + 1.2,
      );

      // Filter out harsh highs
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, now + noteDelay);
      filter.Q.setValueAtTime(1, now + noteDelay);

      // Connections
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

    // Rotate chords
    chordIndex = (chordIndex + 1) % melodyNotes.length;
  }

  function toggleMusicState() {
    if (isMusicMuted) {
      // Unmute & Play
      isMusicMuted = false;
      musicToggleBtn.classList.add("playing");
      if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
      }
      // Trigger first chord immediately
      playSoftArpeggio();
      // Start interval (loop chords every 4.5 seconds)
      synthInterval = setInterval(playSoftArpeggio, 4500);
    } else {
      // Mute
      isMusicMuted = true;
      musicToggleBtn.classList.remove("playing");
      if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
      }
    }
  }

  // Toggle button event listener
  musicToggleBtn.addEventListener("click", () => {
    if (!audioContext) {
      initSynthMusic();
    }
    toggleMusicState();
  });

  // 6. Wishes & Guestbook Storage System
  // Default mock wishes to populate
  const defaultWishes = [
    // {
    //   name: "Thầy Hữu Nghĩa",
    //   attendance: "yes",
    //   wish: "Chúc mừng em Triết đã xuất sắc hoàn thành chặng đường đại học! Chúc em luôn giữ vững ngọn lửa đam mê công nghệ và gặt hái nhiều thành công mới trong sự nghiệp.",
    // },
    // {
    //   name: "Lan Vy (Bạn Thân)",
    //   attendance: "yes",
    //   wish: "Tự hào về cậu quá Triết ơi! Cuối cùng cũng cán đích rồi nhé. Chúc cậu bay cao bay xa hơn nữa trên con đường sắp tới!",
    // },
    // {
    //   name: "Anh Nam (Gia đình)",
    //   attendance: "yes",
    //   wish: "Cả nhà chúc mừng Triết tốt nghiệp loại Giỏi nhé. Luôn tự tin và vững bước trên chặng đường mới nhé em trai!",
    // },
  ];

  // Load wishes from localStorage or fall back to default
  // function getWishes() {
  //   const stored = localStorage.getItem("graduation_wishes");
  //   if (stored) {
  //     return JSON.parse(stored);
  //   }
  //   // Save default wishes first time
  //   localStorage.setItem("graduation_wishes", JSON.stringify(defaultWishes));
  //   return defaultWishes;
  // }
  async function getWishes() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      return data; // Dữ liệu là mảng các lời chúc từ Apps Script
      console.log(data);
    } catch (error) {
      console.error("Lỗi khi lấy lời chúc:", error);
      return [];
    }
  }

  // function saveWish(name, attendance, wish) {
  //   const wishes = getWishes();
  //   wishes.unshift({ name, attendance, wish }); // Add new wishes to top
  //   localStorage.setItem("graduation_wishes", JSON.stringify(wishes));
  // }
  async function saveWish(name, attendance, wish) {
    try {
      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors", // Apps Script yêu cầu no-cors để tránh lỗi chuyển hướng
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, attendance, wish }),
      });
    } catch (error) {
      console.error("Lỗi khi gửi lời chúc:", error);
    }
  }
  async function renderWishes() {
    const wishes = await getWishes();
    console.log(wishes);
    wishesListContainer.innerHTML = "";

    if (wishes.length === 0) {
      wishesListContainer.innerHTML = `
                <div class="wish-item empty-state">
                    <p>${translations[currentLanguage].emptyWishes}</p>
                </div>
            `;
      return;
    }

    wishes.forEach((item) => {
      const wishItem = document.createElement("div");
      wishItem.className = "wish-item";
      console.log(item);
      const attendanceLabel =
        item.attendance === "yes"
          ? `<span class="wish-status attending">${translations[currentLanguage].attending}</span>`
          : `<span class="wish-status declining">${translations[currentLanguage].declining}</span>`;

      wishItem.innerHTML = `
                <div class="wish-header">
                    <span class="wish-name">${escapeHTML(item.name)}</span>
                    ${attendanceLabel}
                </div>
                <p class="wish-text">${escapeHTML(item.wish || translations[currentLanguage].defaultWish)}</p>
            `;
      wishesListContainer.appendChild(wishItem);
    });
  }

  // Helper to escape HTML tags to prevent XSS
  function escapeHTML(str) {
    if (!str) return "";
    console.log(str);
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // RSVP Form Submit Handler
  rsvpForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("guest-name");
    const attendanceInput = document.querySelector(
      'input[name="attendance"]:checked',
    );
    const wishInput = document.getElementById("guest-wish");

    // const name = nameInput.value.trim();
    // const attendance = attendanceInput ? attendanceInput.value : "yes";
    // const wish = wishInput.value.trim();

    const name = nameInput.value.trim();
    const attendance = attendanceInput ? attendanceInput.value : "yes";
    const wish = wishInput.value.trim();

    if (!name) return;

    // Keep the sending state visible long enough for a clear, delightful response.
    submitRsvpBtn.disabled = true;
    submitRsvpBtn.classList.add("is-sending");
    submitRsvpBtn.setAttribute("aria-busy", "true");
    const sendingStartedAt = Date.now();

    // Save the RSVP.
    await saveWish(name, attendance, wish);

    const minimumSendingTime = 1150;
    const remainingTime = minimumSendingTime - (Date.now() - sendingStartedAt);
    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    // Re-render guestbook
    // renderWishes();
    setTimeout(async () => {
      await renderWishes();
    }, 1000);
    // Show Success Overlay modal
    submitRsvpBtn.classList.remove("is-sending");
    submitRsvpBtn.disabled = false;
    submitRsvpBtn.removeAttribute("aria-busy");
    rsvpSuccessOverlay.classList.add("show");

    // Clear Form fields
    nameInput.value = "";
    wishInput.value = "";
  });

  // Close Success Overlay modal
  closeSuccessBtn.addEventListener("click", () => {
    rsvpSuccessOverlay.classList.remove("show");
  });

  // Initialize wishes list display on load
  translatePage(currentLanguage);
});
