/* ==========================================================================
   TIMETRAVEL AGENCY - INTERACTIVE MULTIMEDIA JS CONTROLLER
   ========================================================================== */

// --- STATE MANAGEMENT ---
const state = {
    teaserActive: false,
    currentSlide: 0,
    teaserProgress: 0,
    teaserTimer: null,
    slideInterval: 4500, // 4.5 seconds per slide
    audioInitialized: false,
    synthActive: false,
    vocalActive: false,
    audioContext: null,
    volume: {
        voice: 0.8,
        music: 0.4
    },
    voiceSelection: null,
    visualizerTimer: null,
    // procedural music parameters
    pianoSequencer: null,
    orchestralPad: null
};

// Slide text time intervals for highlighting (seconds approx)
const narrationPhrases = [
    { start: 0, end: 4, text: "Le temps n'est plus une limite. Et si vous pouviez voyager au-delà des siècles ?" },
    { start: 4, end: 9, text: "Contemplez la naissance monumentale de la Tour Eiffel en 1889." },
    { start: 9, end: 14, text: "Marchez parmi les géants sacrés du Crétacé sauvage." },
    { start: 14, end: 18, text: "Éveillez votre âme sous le soleil éternel de la Renaissance florentine." },
    { start: 18, end: 23, text: "TimeTravel Agency. Le temps est votre destination." }
];

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    initVoices();
    initVisualizerPlaceholder();
    initScrollReveal();
    initBookingDefaults();
    
    // Web Speech vocal list updater
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = initVoices;
    }
});

// Initialize Speech voices list
function initVoices() {
    const voiceSelect = document.getElementById('voice-select');
    if (!voiceSelect) return;
    
    if (typeof speechSynthesis === 'undefined') {
        voiceSelect.innerHTML = '<option>Non supporté par ce navigateur</option>';
        return;
    }
    
    const voices = speechSynthesis.getVoices();
    // Filter French voices
    const frVoices = voices.filter(v => v.lang.startsWith('fr') || v.lang.startsWith('FR'));
    
    voiceSelect.innerHTML = '';
    if (frVoices.length === 0) {
        // Fallback to all voices if no french voice
        voices.slice(0, 10).forEach((voice, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(opt);
        });
    } else {
        frVoices.forEach((voice, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            // Highlight premium/natural voices if available
            const isPremium = voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Thomas');
            opt.textContent = `${voice.name} ${isPremium ? '★ (Premium)' : ''}`;
            if (index === 0) opt.selected = true;
            voiceSelect.appendChild(opt);
        });
    }
}

// --- TEASER CINEMATIC CONTROLLER (EXERCISE 3.1 & 3.2) ---
function startCinematicTeaser() {
    document.getElementById('teaser-section').scrollIntoView({ behavior: 'smooth' });
    if (!state.teaserActive) {
        toggleTeaserPlayback();
    }
}

function toggleTeaserPlayback() {
    const playBtn = document.getElementById('play-teaser-btn');
    
    if (state.teaserActive) {
        // Pause
        state.teaserActive = false;
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i> LIRE LE TEASER';
        clearInterval(state.teaserTimer);
        stopSynthesizedMusic();
        pauseVocalNarration();
    } else {
        // Play
        state.teaserActive = true;
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> PAUSE TEASER';
        
        // Auto initialize/play sound if allowed
        initAudioContext();
        startSynthesizedMusic();
        playVocalNarration();
        
        state.currentSlide = 0;
        showSlide(state.currentSlide);
        
        let start = Date.now();
        state.teaserTimer = setInterval(() => {
            let elapsed = Date.now() - start;
            let percent = (elapsed / state.slideInterval) * 100;
            
            if (percent >= 100) {
                percent = 0;
                start = Date.now();
                state.currentSlide = (state.currentSlide + 1) % 4; // 4 slides total (3 eras + branding)
                showSlide(state.currentSlide);
                triggerSynthTransition(state.currentSlide);
            }
            
            document.getElementById('teaser-progress').style.width = `${percent}%`;
        }, 30);
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.teaser-slide');
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    // Sync highlight text with current slide era
    highlightTextFromSlide(index);
}

function highlightTextFromSlide(slideIndex) {
    const spans = document.querySelectorAll('.highlight-voice');
    spans.forEach((span, index) => {
        // Map slide to text paragraph index
        // Slide 0: Paris (Highlights phrase 1 and 2)
        // Slide 1: Cretaceous (Highlights phrase 3)
        // Slide 2: Florence (Highlights phrase 4)
        // Slide 3: Branding (Highlights phrase 5)
        if (slideIndex === 0 && (index === 0 || index === 1)) {
            span.classList.add('active');
        } else if (slideIndex === 1 && index === 2) {
            span.classList.add('active');
        } else if (slideIndex === 2 && index === 3) {
            span.classList.add('active');
        } else if (slideIndex === 3 && index === 4) {
            span.classList.add('active');
        } else {
            span.classList.remove('active');
        }
    });
}

// --- VISUAL FORMAT SWITCHER (PHASE 2 DECLI) ---
function switchFormat(format) {
    // Switch tabs
    document.querySelectorAll('.format-tab').forEach(tab => {
        if (tab.id === `tab-${format}`) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Switch showroom containers
    document.querySelectorAll('.gallery-container').forEach(container => {
        if (container.id === `gallery-${format}`) {
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    });
}

function selectEra(eraName) {
    // Show user responsive feedback
    const indexMap = { 'paris': 0, 'cretaceous': 1, 'florence': 2 };
    document.getElementById('teaser-section').scrollIntoView({ behavior: 'smooth' });
    
    if (state.teaserActive) {
        toggleTeaserPlayback(); // Pause running loop
    }
    
    state.currentSlide = indexMap[eraName];
    showSlide(state.currentSlide);
    triggerSynthTransition(state.currentSlide);
}


// --- WEB AUDIO ORCHESTRAL SYNTHESIZER (EXERCISE 4.2 STYLE HANS ZIMMER) ---
function initAudioContext() {
    if (state.audioInitialized) return;
    
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        state.audioContext = new AudioContextClass();
        state.audioInitialized = true;
        
        // Start Canvas visualizer
        startVisualizerEngine();
    } catch (e) {
        console.error("Web Audio API not supported", e);
    }
}

// Global voice/music volume adjustments
function adjustVolume(type, val) {
    state.volume[type] = parseFloat(val);
    if (type === 'music' && state.orchestralPad) {
        state.orchestralPad.gainNode.gain.setValueAtTime(state.volume.music * 0.3, state.audioContext.currentTime);
    }
}

function toggleGlobalAudio() {
    initAudioContext();
    if (state.synthActive || state.vocalActive) {
        stopAllAudio();
    } else {
        startSynthesizedMusic();
        playVocalNarration();
    }
}

function stopAllAudio() {
    stopSynthesizedMusic();
    stopVocalNarration();
    if (state.teaserActive) {
        toggleTeaserPlayback();
    }
    document.getElementById('visualizer-status').textContent = "AUDIO INACTIF";
    document.getElementById('global-play-btn').innerHTML = '<i class="fa-solid fa-play"></i> Lancer la Bande Son';
    document.getElementById('global-play-btn').classList.remove('playing');
}

function toggleMusicOnly() {
    initAudioContext();
    const musicBtn = document.getElementById('music-play-btn');
    if (state.synthActive) {
        stopSynthesizedMusic();
    } else {
        startSynthesizedMusic();
    }
}

function toggleVoiceOnly() {
    initAudioContext();
    if (state.vocalActive) {
        stopVocalNarration();
    } else {
        playVocalNarration();
    }
}

// Realtime Orchestral Synthesizer Style Zimmer
function startSynthesizedMusic() {
    if (state.synthActive) return;
    initAudioContext();
    
    state.synthActive = true;
    document.getElementById('music-status').textContent = "Actif";
    document.getElementById('music-status').classList.add('playing');
    document.getElementById('music-play-btn').classList.add('playing');
    document.getElementById('music-play-btn').innerHTML = '<i class="fa-solid fa-pause"></i>';
    document.getElementById('global-play-btn').innerHTML = '<i class="fa-solid fa-stop"></i> Arrêter tout';
    document.getElementById('global-play-btn').classList.add('playing');
    document.getElementById('visualizer-status').textContent = "ORCHESTRE DYNAMIQUE ACTIF";
    
    const ctx = state.audioContext;
    
    // 1. Build Ambient String Pad (Saw/Tri waves layered with Lowpass Filter)
    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0, ctx.currentTime);
    padGain.gain.linearRampToValueAtTime(state.volume.music * 0.35, ctx.currentTime + 3.0); // Slow fade-in string
    
    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(220, ctx.currentTime);
    
    // Layer 1: Low Cello/Double Bass (C2 / G2 frequencies)
    const oscBass1 = ctx.createOscillator();
    const oscBass2 = ctx.createOscillator();
    oscBass1.type = 'sawtooth';
    oscBass2.type = 'triangle';
    
    oscBass1.frequency.setValueAtTime(65.41, ctx.currentTime); // C2
    oscBass2.frequency.setValueAtTime(98.00, ctx.currentTime); // G2
    
    oscBass1.connect(lpFilter);
    oscBass2.connect(lpFilter);
    
    // Layer 2: Shimmering string chord (C4, E4, G4)
    const oscHigh1 = ctx.createOscillator();
    const oscHigh2 = ctx.createOscillator();
    oscHigh1.type = 'triangle';
    oscHigh2.type = 'triangle';
    
    oscHigh1.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
    oscHigh2.frequency.setValueAtTime(329.63, ctx.currentTime); // E4
    
    oscHigh1.connect(lpFilter);
    oscHigh2.connect(lpFilter);
    
    lpFilter.connect(padGain);
    padGain.connect(ctx.destination);
    
    oscBass1.start();
    oscBass2.start();
    oscHigh1.start();
    oscHigh2.start();
    
    state.orchestralPad = {
        oscBass1, oscBass2, oscHigh1, oscHigh2, filter: lpFilter, gainNode: padGain
    };
    
    // 2. Build Procedural Crystalline Piano Melody (Zimmer Hope theme)
    // Notes: C5 (523Hz), G5 (784Hz), D5 (587Hz), E5 (659Hz), B5 (987Hz)
    let pianoTime = ctx.currentTime;
    let melodyIndex = 0;
    const melodyNotes = [523.25, 587.33, 659.25, 784.00, 587.33, 987.77, 784.00, 659.25];
    
    state.pianoSequencer = setInterval(() => {
        if (!state.synthActive) return;
        
        const noteFreq = melodyNotes[melodyIndex];
        playPianoPluck(noteFreq, ctx.currentTime);
        
        melodyIndex = (melodyIndex + 1) % melodyNotes.length;
        
        // Randomly sweep filter cutoff on the orchestral strings to create movement
        const filterCutoff = 180 + Math.sin(ctx.currentTime * 0.5) * 80;
        lpFilter.frequency.setValueAtTime(filterCutoff, ctx.currentTime);
    }, 1200); // Pluck every 1.2s
}

// Single piano note generator with delay gain loop
function playPianoPluck(frequency, startTime) {
    const ctx = state.audioContext;
    
    const osc = ctx.createOscillator();
    const pluckGain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);
    
    // Sharp attack, fast decay to mimic premium crystalline key hits
    pluckGain.gain.setValueAtTime(0, startTime);
    pluckGain.gain.linearRampToValueAtTime(state.volume.music * 0.5, startTime + 0.02);
    pluckGain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.5); // long decay
    
    // Dynamic delay nodes for ambient reverb effect
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.45; // Stereo tape delay effect
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.35; // delay volume feedback
    
    osc.connect(pluckGain);
    pluckGain.connect(ctx.destination);
    
    // delay routing loop
    pluckGain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(ctx.destination);
    delayGain.connect(delay); // feedback loop
    
    osc.start(startTime);
    osc.stop(startTime + 3.0);
}

// Modify music chords dynamically based on current era selection!
function triggerSynthTransition(eraIndex) {
    if (!state.synthActive || !state.orchestralPad) return;
    
    const ctx = state.audioContext;
    const pad = state.orchestralPad;
    
    const t = ctx.currentTime;
    
    if (eraIndex === 0) { // Paris (Nostalgic A minor / C)
        pad.oscBass1.frequency.exponentialRampToValueAtTime(55.00, t + 1.5); // A1
        pad.oscBass2.frequency.exponentialRampToValueAtTime(82.41, t + 1.5); // E2
        pad.oscHigh1.frequency.exponentialRampToValueAtTime(220.00, t + 1.5); // A3
        pad.oscHigh2.frequency.exponentialRampToValueAtTime(261.63, t + 1.5); // C4
        pad.filter.frequency.exponentialRampToValueAtTime(280, t + 1.5);
    } else if (eraIndex === 1) { // Cretaceous (Deep prehistoric low drone F minor)
        pad.oscBass1.frequency.exponentialRampToValueAtTime(43.65, t + 1.5); // F1
        pad.oscBass2.frequency.exponentialRampToValueAtTime(65.41, t + 1.5); // C2
        pad.oscHigh1.frequency.exponentialRampToValueAtTime(174.61, t + 1.5); // F3
        pad.oscHigh2.frequency.exponentialRampToValueAtTime(207.65, t + 1.5); // Ab3
        pad.filter.frequency.exponentialRampToValueAtTime(140, t + 1.5); // Primordial dark lowpass
    } else if (eraIndex === 2) { // Florence Renaissance (Bright uplifting G major)
        pad.oscBass1.frequency.exponentialRampToValueAtTime(49.00, t + 1.5); // B1
        pad.oscBass2.frequency.exponentialRampToValueAtTime(73.42, t + 1.5); // D2
        pad.oscHigh1.frequency.exponentialRampToValueAtTime(196.00, t + 1.5); // G3
        pad.oscHigh2.frequency.exponentialRampToValueAtTime(246.94, t + 1.5); // B3
        pad.filter.frequency.exponentialRampToValueAtTime(320, t + 1.5); // Shimmering light open filter
    } else { // Branding Climax (Triumphant ascending high chords)
        pad.oscBass1.frequency.exponentialRampToValueAtTime(65.41, t + 1.0); // C2
        pad.oscBass2.frequency.exponentialRampToValueAtTime(98.00, t + 1.0); // G2
        pad.oscHigh1.frequency.exponentialRampToValueAtTime(261.63, t + 1.0); // C4
        pad.oscHigh2.frequency.exponentialRampToValueAtTime(329.63, t + 1.0); // E4
        pad.filter.frequency.exponentialRampToValueAtTime(450, t + 1.5); // Full open swell
    }
}

function stopSynthesizedMusic() {
    if (!state.synthActive) return;
    
    state.synthActive = false;
    document.getElementById('music-status').textContent = "Inactif";
    document.getElementById('music-status').classList.remove('playing');
    document.getElementById('music-play-btn').classList.remove('playing');
    document.getElementById('music-play-btn').innerHTML = '<i class="fa-solid fa-play"></i>';
    
    if (!state.vocalActive) {
        document.getElementById('global-play-btn').innerHTML = '<i class="fa-solid fa-play"></i> Lancer la Bande Son';
        document.getElementById('global-play-btn').classList.remove('playing');
        document.getElementById('visualizer-status').textContent = "AUDIO ACTUELLEMENT INACTIF";
    }
    
    clearInterval(state.pianoSequencer);
    
    if (state.orchestralPad) {
        try {
            state.orchestralPad.oscBass1.stop();
            state.orchestralPad.oscBass2.stop();
            state.orchestralPad.oscHigh1.stop();
            state.orchestralPad.oscHigh2.stop();
        } catch(e) {}
        state.orchestralPad = null;
    }
}

// --- WEB SPEECH SYNTHESIS VOICE-OFF (EXERCISE 4.1 VOCALS) ---
function playVocalNarration() {
    if (typeof speechSynthesis === 'undefined') return;
    
    speechSynthesis.cancel(); // Stop active queue
    
    state.vocalActive = true;
    document.getElementById('voice-status').textContent = "Actif";
    document.getElementById('voice-status').classList.add('playing');
    document.getElementById('voice-play-btn').classList.add('playing');
    document.getElementById('voice-play-btn').innerHTML = '<i class="fa-solid fa-pause"></i>';
    document.getElementById('global-play-btn').innerHTML = '<i class="fa-solid fa-stop"></i> Arrêter tout';
    document.getElementById('global-play-btn').classList.add('playing');
    document.getElementById('visualizer-status').textContent = "VOIX NARRATIVE PREMIUM ACTIVER";
    
    const scriptText = "Le temps n'est plus une limite. Et si vous pouviez voyager au-delà des siècles ? Contemplez la naissance monumentale de la Tour Eiffel en 1889. Marchez parmi les géants sacrés du Crétacé sauvage. Éveillez votre âme sous le soleil éternel de la Renaissance florentine. TimeTravel Agency. Le temps est votre destination.";
    
    const utterance = new SpeechSynthesisUtterance(scriptText);
    
    // Choose selected premium french voice
    const voiceSelect = document.getElementById('voice-select');
    const voices = speechSynthesis.getVoices();
    const frVoices = voices.filter(v => v.lang.startsWith('fr') || v.lang.startsWith('FR'));
    
    if (voiceSelect && voiceSelect.value !== '') {
        const selectedIndex = parseInt(voiceSelect.value);
        if (frVoices.length > 0 && frVoices[selectedIndex]) {
            utterance.voice = frVoices[selectedIndex];
        } else if (voices[selectedIndex]) {
            utterance.voice = voices[selectedIndex];
        }
    }
    
    // Adjust premium vocal luxury parameters
    utterance.volume = state.volume.voice;
    utterance.rate = 0.83; // majestic, elegant pacing
    utterance.pitch = 0.92; // lower, warmer brand timbre
    
    utterance.onend = () => {
        stopVocalNarration();
    };
    
    utterance.onerror = () => {
        stopVocalNarration();
    };

    // Text highlighting dynamic synchronizer based on utterance character boundaries
    utterance.onboundary = (event) => {
        if (event.name !== 'word') return;
        const charIndex = event.charIndex;
        
        // Find which sentence the spoken index belongs to
        if (charIndex < 50) {
            highlightSpanIndex(0);
        } else if (charIndex < 114) {
            highlightSpanIndex(1);
        } else if (charIndex < 167) {
            highlightSpanIndex(2);
        } else if (charIndex < 240) {
            highlightSpanIndex(3);
        } else {
            highlightSpanIndex(4);
        }
    };
    
    speechSynthesis.speak(utterance);
}

function highlightSpanIndex(index) {
    const spans = document.querySelectorAll('.highlight-voice');
    spans.forEach((span, i) => {
        if (i === index) {
            span.classList.add('active');
        } else {
            span.classList.remove('active');
        }
    });
}

function pauseVocalNarration() {
    if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.pause();
    }
}

function stopVocalNarration() {
    state.vocalActive = false;
    document.getElementById('voice-status').textContent = "Inactif";
    document.getElementById('voice-status').classList.remove('playing');
    document.getElementById('voice-play-btn').classList.remove('playing');
    document.getElementById('voice-play-btn').innerHTML = '<i class="fa-solid fa-play"></i>';
    
    if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.cancel();
    }
    
    if (!state.synthActive) {
        document.getElementById('global-play-btn').innerHTML = '<i class="fa-solid fa-play"></i> Lancer la Bande Son';
        document.getElementById('global-play-btn').classList.remove('playing');
        document.getElementById('visualizer-status').textContent = "AUDIO ACTUELLEMENT INACTIF";
    }
}

function changeVoiceSelection() {
    if (state.vocalActive) {
        playVocalNarration(); // Re-trigger with new voice selection instantly
    }
}


// --- DYNAMIC NEON WAVE AUDIO VISUALIZER ---
function initVisualizerPlaceholder() {
    const canvas = document.getElementById('audio-visualizer');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Fit canvas bounds
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 1;
    
    // Draw initial straight resting line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
}

function startVisualizerEngine() {
    if (state.visualizerTimer) return;
    
    const canvas = document.getElementById('audio-visualizer');
    const ctx = canvas.getContext('2d');
    
    let tick = 0;
    
    function draw() {
        if (!state.audioInitialized) return;
        
        state.visualizerTimer = requestAnimationFrame(draw);
        
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isAudioPlaying = state.synthActive || state.vocalActive;
        const amplitude = isAudioPlaying ? (state.synthActive ? 30 : 15) : 2;
        const frequency = isAudioPlaying ? 0.05 : 0.01;
        const speed = isAudioPlaying ? 0.15 : 0.02;
        
        tick += speed;
        
        // Render dual glowing neon waves
        // Wave 1 : Gold wave
        ctx.shadowBlur = isAudioPlaying ? 15 : 0;
        ctx.shadowColor = '#d4af37';
        ctx.strokeStyle = isAudioPlaying ? '#d4af37' : 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = isAudioPlaying ? 2.5 : 1;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
            // Apply nice envelope damping near edges
            const edgeDamp = Math.sin((x / canvas.width) * Math.PI);
            const y = canvas.height / 2 + Math.sin(x * frequency + tick) * amplitude * edgeDamp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Wave 2 : Soft Ivory contrast wave
        ctx.shadowBlur = isAudioPlaying ? 8 : 0;
        ctx.shadowColor = '#ffffff';
        ctx.strokeStyle = isAudioPlaying ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.1)';
        ctx.lineWidth = isAudioPlaying ? 1.5 : 0.5;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x++) {
            const edgeDamp = Math.sin((x / canvas.width) * Math.PI);
            const y = canvas.height / 2 + Math.cos(x * (frequency * 0.8) - tick * 0.9) * (amplitude * 0.7) * edgeDamp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // reset shadow to avoid slowing canvas
        ctx.shadowBlur = 0;
    }
    
    draw();
}

/* ==========================================================================
   TIMETRAVEL AGENCY - INTERACTIVE LOGIC (QUIZ, BOOKING, CHATBOT, REVEAL)
   ========================================================================== */

// --- 1. SCROLL REVEAL UTILITY ---
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        root: null, // Viewport
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                obs.unobserve(entry.target); // Animates only once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

// --- 2. PRESTIGE BOOKING ENGINE ---
const bookingState = {
    basePrices: {
        paris: 15000,
        cretaceous: 75000,
        florence: 25000
    },
    classMultipliers: {
        first: 1.5,
        business: 1.25,
        observer: 1.0
    },
    selectedEra: '',
    currentTotal: 0
};

function initBookingDefaults() {
    // Set default date limits (cannot book in the past!)
    const today = new Date().toISOString().split('T')[0];
    const depInput = document.getElementById('booking-departure');
    const retInput = document.getElementById('booking-return');
    if (depInput && retInput) {
        depInput.min = today;
        retInput.min = today;
    }
    // Update serial dynamically
    const serialEl = document.getElementById('ticket-serial');
    if (serialEl) {
        serialEl.textContent = '#TT-' + Math.floor(100000 + Math.random() * 900000) + '-X2';
    }
}

function calculateBookingPrice() {
    const eraSelect = document.getElementById('booking-era');
    const depInput = document.getElementById('booking-departure');
    const retInput = document.getElementById('booking-return');
    const travelersInput = document.getElementById('booking-travelers');
    const classSelect = document.getElementById('booking-class');
    
    if (!eraSelect) return;
    
    const era = eraSelect.value;
    const travelers = parseInt(travelersInput.value) || 1;
    const corridorClass = classSelect.value || 'observer';
    
    // Update Ticket displays
    const summaryEra = document.getElementById('summary-era');
    const summaryTravelers = document.getElementById('summary-travelers');
    const summaryDep = document.getElementById('summary-departure');
    const summaryRet = document.getElementById('summary-return');
    
    if (summaryEra) {
        const eraText = eraSelect.options[eraSelect.selectedIndex]?.text.split('—')[0] || '- Non Sélectionnée -';
        summaryEra.textContent = era ? eraText : '- Non Sélectionnée -';
    }
    if (summaryTravelers) {
        summaryTravelers.textContent = `${travelers} Explorateur${travelers > 1 ? 's' : ''}`;
    }
    if (summaryDep && depInput && depInput.value) {
        summaryDep.textContent = formatDateString(depInput.value);
    }
    if (summaryRet && retInput && retInput.value) {
        summaryRet.textContent = formatDateString(retInput.value);
    }
    
    if (!era) {
        document.getElementById('price-base').textContent = '0 €';
        document.getElementById('price-multiplier').textContent = 'x 1.0';
        document.getElementById('price-options').textContent = '0 €';
        document.getElementById('price-total').textContent = '0 €';
        return;
    }
    
    // Core math
    const basePrice = bookingState.basePrices[era] || 0;
    const multiplier = bookingState.classMultipliers[corridorClass] || 1.0;
    
    // Calculate options cost per traveler where applicable
    let optionsCost = 0;
    const insCh = document.getElementById('opt-insurance');
    const clothCh = document.getElementById('opt-clothing');
    const chronoCh = document.getElementById('opt-chrono');
    
    if (insCh && insCh.checked) optionsCost += parseFloat(insCh.value) * travelers;
    if (clothCh && clothCh.checked) optionsCost += parseFloat(clothCh.value) * travelers;
    if (chronoCh && chronoCh.checked) optionsCost += parseFloat(chronoCh.value); // Flat fee
    
    const eraSubtotal = basePrice * travelers;
    const classAdjusted = eraSubtotal * multiplier;
    const total = classAdjusted + optionsCost;
    
    bookingState.selectedEra = era;
    bookingState.currentTotal = total;
    
    // Render back into tickets
    document.getElementById('price-base').textContent = `${(basePrice).toLocaleString('fr-FR')} €`;
    document.getElementById('price-multiplier').textContent = `x ${multiplier.toFixed(2)}`;
    document.getElementById('price-options').textContent = `${optionsCost.toLocaleString('fr-FR')} €`;
    document.getElementById('price-total').textContent = `${Math.round(total).toLocaleString('fr-FR')} €`;
}

function formatDateString(dateStr) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    const eraSelect = document.getElementById('booking-era');
    const depInput = document.getElementById('booking-departure');
    const retInput = document.getElementById('booking-return');
    const travelersInput = document.getElementById('booking-travelers');
    const classSelect = document.getElementById('booking-class');
    
    const depVal = depInput.value;
    const retVal = retInput.value;
    
    if (new Date(depVal) >= new Date(retVal)) {
        alert("Attention : Votre date de départ temporel doit précéder la date de retour ! Notre corridor ne gère pas les boucles récursives inversées autonomes.");
        return;
    }
    
    // Sound FX trigger if music is active
    if (state.audioInitialized && state.audioContext) {
        playPianoPluck(880, state.audioContext.currentTime); // chime sound
    }
    
    // Generate Success Information
    const eraName = eraSelect.options[eraSelect.selectedIndex]?.text.split('—')[0] || '';
    const classLabel = classSelect.options[classSelect.selectedIndex]?.text || '';
    const flightId = '#TT-' + Math.floor(1000 + Math.random() * 9000);
    
    let eraCoords = '';
    if (eraSelect.value === 'paris') eraCoords = 'Paris (1889 AD)';
    if (eraSelect.value === 'cretaceous') eraCoords = 'Corridor Préhistorique (-65M Ans)';
    if (eraSelect.value === 'florence') eraCoords = 'Toscane Renaissance (1505 AD)';
    
    document.getElementById('success-flight-id').textContent = flightId;
    document.getElementById('success-coords').textContent = eraCoords;
    document.getElementById('success-class').textContent = classLabel;
    document.getElementById('success-price').textContent = `${Math.round(bookingState.currentTotal).toLocaleString('fr-FR')} €`;
    
    document.getElementById('booking-success-modal').style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('booking-success-modal').style.display = 'none';
    document.getElementById('time-booking-form').reset();
    calculateBookingPrice();
}

// --- 3. TEMPORAL AFFINITY QUIZ ---
const quizState = {
    answers: {},
    eraScores: { paris: 0, cretaceous: 0, florence: 0 }
};

function answerQuiz(step, option) {
    // Record option
    quizState.answers[step] = option;
    
    // Progression bar calculation
    const progressPercent = (step / 4) * 100;
    document.getElementById('quiz-progress-bar').style.width = `${progressPercent}%`;
    
    if (step < 4) {
        // Go to next step
        document.getElementById(`quiz-step-${step}`).classList.remove('active');
        document.getElementById(`quiz-step-${step + 1}`).classList.add('active');
        document.getElementById('quiz-current-step').textContent = step + 1;
    } else {
        // Calculate Tally
        calculateQuizResult();
    }
}

function calculateQuizResult() {
    // Map answer steps to score
    // Option A: Florence, Option B: Cretaceous, Option C: Paris
    quizState.eraScores = { paris: 0, cretaceous: 0, florence: 0 };
    
    // Tally values
    for (let step = 1; step <= 4; step++) {
        const option = quizState.answers[step];
        if (option === 'A') quizState.eraScores.florence += 1;
        if (option === 'B') quizState.eraScores.cretaceous += 1;
        if (option === 'C') quizState.eraScores.paris += 1;
    }
    
    // Find highest score era
    let winner = 'paris';
    let maxScore = -1;
    for (const era in quizState.eraScores) {
        if (quizState.eraScores[era] > maxScore) {
            maxScore = quizState.eraScores[era];
            winner = era;
        }
    }
    
    // Update Result details
    const resultBox = document.getElementById('quiz-result-box');
    const resultImg = document.getElementById('quiz-result-img');
    const resultTitle = document.getElementById('quiz-result-title');
    const resultDesc = document.getElementById('quiz-result-desc');
    
    // Quiz description texts based on winner
    const copyText = {
        paris: {
            title: "Paris 1889 — Belle Époque",
            desc: "Votre esprit vibre au diapason de l'élégance, des conversations mondaines et de la grandeur industrielle ! L'Exposition Universelle de 1889 sera votre nouveau salon de réception. Préparez votre redingote ou votre robe en satin pour arpenter le Champ de Mars sous les lueurs chaudes des lanternes à gaz.",
            img: "assets/paris_1889_hero.png"
        },
        cretaceous: {
            title: "Le Crétacé — Ère Originelle",
            desc: "Vous êtes un explorateur à l'état pur. Vous recherchez le grand frisson, le calme sacré de l'aube du monde et le gigantisme de la faune sauvage préhistorique. Nos physiciens vont configurer un corridor de haute puissance pour vous déposer à proximité des plus paisibles troupeaux de sauropodes.",
            img: "assets/cretaceous_hero.png"
        },
        florence: {
            title: "Florence Renaissance",
            desc: "Votre âme est profondément éprise d'art, d'idéal humaniste et de splendeur architecturale. Le Cinque Cento toscan de 1505 est votre destination idéale. Vous pourrez éveiller vos sens artistiques sous les lueurs dorées entourant le Duomo et les places de marbre.",
            img: "assets/florence_hero.png"
        }
    };
    
    const resultData = copyText[winner];
    resultImg.src = resultData.img;
    resultTitle.textContent = resultData.title;
    resultDesc.textContent = resultData.desc;
    
    // Hide standard steps, show result panel
    document.querySelector('.quiz-steps').style.display = 'none';
    document.querySelector('.quiz-header').style.display = 'none';
    resultBox.style.display = 'block';
    
    // Store winning era to booking select
    quizState.recommendedEra = winner;
}

function restartQuiz() {
    quizState.answers = {};
    quizState.eraScores = { paris: 0, cretaceous: 0, florence: 0 };
    
    document.getElementById('quiz-progress-bar').style.width = '25%';
    document.getElementById('quiz-current-step').textContent = '1';
    
    // Reset display
    document.getElementById('quiz-result-box').style.display = 'none';
    document.querySelector('.quiz-steps').style.display = 'block';
    document.querySelector('.quiz-header').style.display = 'block';
    
    // Reset steps active state
    for (let step = 1; step <= 4; step++) {
        document.getElementById(`quiz-step-${step}`).classList.remove('active');
    }
    document.getElementById('quiz-step-1').classList.add('active');
}

function bookRecommendedEra() {
    const era = quizState.recommendedEra || 'paris';
    const eraSelect = document.getElementById('booking-era');
    if (eraSelect) {
        eraSelect.value = era;
        calculateBookingPrice();
    }
    // Scroll to booking form
    document.getElementById('booking-section').scrollIntoView({ behavior: 'smooth' });
}

// --- 4. CONVERSATIONAL CHATBOT (CHRONO-GUIDE LÉO) ---
let chatbotState = {
    isOpen: false,
    unread: true
};

function toggleChatPanel() {
    const panel = document.getElementById('chatbot-panel-box');
    const badge = document.getElementById('chat-notification');
    
    if (chatbotState.isOpen) {
        panel.classList.remove('active');
        chatbotState.isOpen = false;
    } else {
        panel.classList.add('active');
        chatbotState.isOpen = true;
        // Hide notification count once opened
        if (badge) {
            badge.style.display = 'none';
        }
        chatbotState.unread = false;
        
        // Focus input
        setTimeout(() => {
            document.getElementById('chatbot-input-text')?.focus();
        }, 300);
    }
}

function sendQuickReply(text) {
    const input = document.getElementById('chatbot-input-text');
    if (input) {
        input.value = text;
        sendChatMessage();
    }
}

function handleChatInputKeyDown(e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatbot-input-text');
    const msgList = document.getElementById('chatbot-messages-list');
    
    if (!input || !msgList) return;
    
    const userText = input.value.trim();
    if (userText === '') return;
    
    // Add user message to pane
    const userMsgHTML = `
        <div class="chatbot-message user">
            <div class="message-content">${userText}</div>
            <span class="message-time">À l'instant</span>
        </div>
    `;
    msgList.insertAdjacentHTML('beforeend', userMsgHTML);
    
    // Clear input
    input.value = '';
    
    // Scroll to bottom
    msgList.scrollTop = msgList.scrollHeight;
    
    // Render typing indicator dots
    const typingIndicatorHTML = `
        <div class="chatbot-message bot" id="typing-indicator">
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        msgList.insertAdjacentHTML('beforeend', typingIndicatorHTML);
        msgList.scrollTop = msgList.scrollHeight;
    }, 300);
    
    // Generate Bot Response with historical intelligence
    setTimeout(() => {
        // Remove typing indicator
        const typingEl = document.getElementById('typing-indicator');
        if (typingEl) typingEl.remove();
        
        const botResponseText = getBotResponse(userText);
        
        // Format time
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        const botMsgHTML = `
            <div class="chatbot-message bot">
                <div class="message-content">${botResponseText}</div>
                <span class="message-time">${timeStr}</span>
            </div>
        `;
        msgList.insertAdjacentHTML('beforeend', botMsgHTML);
        msgList.scrollTop = msgList.scrollHeight;
        
        // If voice active, narrate the chatbot response using SpeechSynthesis! (Luxury feature!)
        if (state.vocalActive && typeof speechSynthesis !== 'undefined') {
            // Strip HTML tags for speech
            const cleanText = botResponseText.replace(/<\/?[^>]+(>|$)/g, "");
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 0.85;
            utterance.pitch = 0.95;
            speechSynthesis.speak(utterance);
        }
    }, 1200);
}

function getBotResponse(userMsg) {
    const msg = userMsg.toLowerCase();
    
    // 1. GREETINGS
    if (msg.includes('bonjour') || msg.includes('salut') || msg.includes('hello') || msg.includes('hey') || msg.includes('bonsoir')) {
        return "Bonjour ! Enchanté de faire votre connaissance. Quelle époque souhaitez-vous explorer aujourd'hui ? Je peux tout vous dire sur Paris 1889, le Crétacé sauvage ou Florence Renaissance ! ⏳✨";
    }
    
    // 2. PARIS 1889
    if (msg.includes('paris') || msg.includes('1889') || msg.includes('eiffel') || msg.includes('exposition') || msg.includes('belle époque') || msg.includes('belle epoque')) {
        return "<strong>Paris 1889 — La Belle Époque</strong> 🗼<br><br>" +
               "Une destination de pur raffinement et d'effervescence industrielle ! Vous assisterez en direct à l'inauguration de la Tour Eiffel et visiterez l'Exposition Universelle.<br>" +
               "• <em>Température moyenne :</em> 18°C (Doux)<br>" +
               "• <em>Dresscode exigé :</em> Redingote, chapeau haut-de-forme pour les messieurs; corsets serrés, robes à tournure et ombrelles en dentelle pour les dames. Nos ateliers haute-couture adapteront vos tenues.<br>" +
               "• <em>Tarif :</em> 15 000 € (Corridor Signature standard inclus). Souhaitez-vous faire une simulation de réservation ?";
    }
    
    // 3. CRETACEOUS
    if (msg.includes('cretace') || msg.includes('crétacé') || msg.includes('dino') || msg.includes('dinosaure') || msg.includes('sauvage') || msg.includes('brachiosaurus') || msg.includes('triceratops')) {
        return "<strong>Le Crétacé — L'Ère Originelle sauvage</strong> 🦕<br><br>" +
               "Pour les âmes d'aventuriers absolus ! Marchez parmi les géants colossaux de notre planète (-70 Millions d'années) dans une végétation primitive dense et sauvage.<br>" +
               "• <em>Température moyenne :</em> 32°C (Climat tropical très humide)<br>" +
               "• <em>Sécurité :</em> Vous voyagerez dans une capsule d'observation blindée équipée d'un corridor de repli quantique instantané. Combinaisons anti-odeur et phéromones neutres obligatoires.<br>" +
               "• <em>Tarif :</em> 75 000 € (Corridor de haute puissance requis). Suggérez-vous de tester notre quiz interactif pour savoir si c'est fait pour vous ?";
    }
    
    // 4. FLORENCE
    if (msg.includes('florence') || msg.includes('renaissance') || msg.includes('toscane') || msg.includes('art') || msg.includes('peintre') || msg.includes('italie') || msg.includes('1504') || msg.includes('1505') || msg.includes('michel-ange') || msg.includes('botticelli')) {
        return "<strong>Florence Renaissance — Le Berceau de l'Art</strong> 🖼️<br><br>" +
               "Éveillez vos sens artistiques au cœur de la Toscane classique de 1505 ! Vous pourrez observer la construction de la célèbre coupole du Duomo de Brunelleschi et peut-être croiser de grands maîtres de la Renaissance.<br>" +
               "• <em>Température moyenne :</em> 24°C (Ensoleillé)<br>" +
               "• <em>Dresscode exigé :</em> Pourpoints damassés, chausses ajustées pour les hommes; robes en soie brodée d'or et coiffures perlées de velours toscan pour les femmes.<br>" +
               "• <em>Tarif :</em> 25 000 €. Une immersion culturelle incomparable ! Quelle question aimeriez-vous poser sur ce voyage ?";
    }
    
    // 5. PRICE
    if (msg.includes('prix') || msg.includes('tarif') || msg.includes('combien') || msg.includes('cout') || msg.includes('coût') || msg.includes('cher') || msg.includes('argent') || msg.includes('budget')) {
        return "Nos formules de voyage temporel haut de gamme comprennent le transport par corridor Alcubierre sécurisé, l'assurance anti-paradoxe, ainsi que l'hébergement de luxe d'époque :<br>" +
               "• 🗼 <strong>Paris 1889 :</strong> à partir de 15 000 € / voyageur<br>" +
               "• 🖼️ <strong>Florence Renaissance :</strong> à partir de 25 000 € / voyageur<br>" +
               "• 🦕 <strong>Le Crétacé sauvage :</strong> à partir de 75 000 € / voyageur<br><br>" +
               "Nous proposons différentes classes de corridor (Observateur, Signature ou Impériale). Vous pouvez simuler un devis complet directement dans notre <strong>Salon de Réservation</strong> ci-dessus ! 🛎️";
    }
    
    // 6. SAFETY / DANGER
    if (msg.includes('danger') || msg.includes('securite') || msg.includes('sécurité') || msg.includes('risque') || msg.includes('paradoxe') || msg.includes('malade') || msg.includes('mourir')) {
        return "<strong>Votre sécurité chronologique est notre priorité absolue.</strong> 🛡️<br><br>" +
               "Chaque corridor est stabilisé par notre réacteur quantique breveté. Nos traceurs de paradoxe et nos costumes d'isolation moléculaire empêchent toute modification de la ligne temporelle (principe d'auto-cohérence de Novikov).<br>" +
               "De plus, vous disposez d'un bouton d'extraction d'urgence ramenant instantanément votre capsule à notre époque standard.";
    }
    
    // 7. QUIZ / RECOMMENDATION
    if (msg.includes('quiz') || msg.includes('test') || msg.includes('recommandation') || msg.includes('choix') || msg.includes('choisir') || msg.includes('conseil') || msg.includes('conseiller')) {
        return "Vous hésitez sur l'époque idéale ? C'est tout à fait normal !<br><br>" +
               "Je vous suggère de faire notre <strong>Test d'Affinité Temporelle</strong> interactif situé juste au-dessus. En 4 questions simples, il scannera vos préférences pour désigner votre destination d'âme ! 🧭";
    }
    
    // 8. BOOKING
    if (msg.includes('reserver') || msg.includes('réservation') || msg.includes('reserver') || msg.includes('achat') || msg.includes('reserver')) {
        return "Pour réserver votre corridor temporel de prestige, veuillez utiliser notre <strong>Salon de Réservation</strong> interactif situé au milieu de la page.<br><br>" +
               "Choisissez votre époque, vos dates et le nombre d'explorateurs. Le passeport se mettra à jour en temps réel et validera votre corridor quantique ! 🛎️";
    }
    
    // FALLBACK
    return "Je comprends tout à fait votre curiosité au sujet des voyages temporels ! 🕰️<br><br>" +
           "Pourriez-vous me préciser si votre intérêt se porte sur les dinosaures sauvages du <strong>Crétacé</strong>, le raffinement toscan de <strong>Florence</strong>, les avancées de la <strong>Belle Époque à Paris</strong>, ou nos conditions de sécurité quantique ?";
}

