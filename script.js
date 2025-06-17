/**
 * Daily AI Prompt Wheel - Mystical Fantasy Edition
 * script.js - Main application functionality
 */

// ===== CONSTANTS =====
const ADMIN_PASSCODE = "BerniBOT";
const MUSIC_PASSCODE = "BerniBOTYousic";
const SPIN_COOLDOWN_HOURS = 24;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AUDIO_SIZE = 10 * 1024 * 1024; // 10MB
const WHEEL_SEGMENTS = 5;
const SEGMENT_ANGLE = 360 / WHEEL_SEGMENTS;
const SPIN_DURATION = 3500; // ms
const PARTICLE_LIMIT = 50;

// ===== DOM ELEMENTS =====
// Main elements
const wheel = document.querySelector('.wheel');
const wheelSegments = document.querySelectorAll('.wheel-segment');
const spinButton = document.getElementById('spinButton');
const adminIcon = document.querySelector('.admin-icon');
const countdownTimer = document.querySelector('.countdown-timer');
const timerValue = document.querySelector('.timer-value');
const floatingTablets = document.querySelectorAll('.runic-tablet');
const backgroundMusic = document.getElementById('backgroundMusic');

// Modals
const adminAccessModal = document.getElementById('adminAccessModal');
const musicSettingsModal = document.getElementById('musicSettingsModal');
const tipDisplayModal = document.getElementById('tipDisplayModal');
const adminControlPanel = document.getElementById('adminControlPanel');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const closeButtons = document.querySelectorAll('.close-button');

// Admin panel elements
const adminPasscodeInput = document.getElementById('adminPasscode');
const musicPasscodeInput = document.getElementById('musicPasscode');
const tipTextareas = document.querySelectorAll('.mystical-textarea[data-segment]');
const saveTipsButton = document.getElementById('saveTipsButton');
const backgroundUrlInput = document.getElementById('backgroundUrl');
const backgroundFileInput = document.getElementById('backgroundFileInput');
const uploadBackgroundButton = document.getElementById('uploadBackgroundButton');
const applyBackgroundButton = document.getElementById('applyBackgroundButton');
const unlockMusicButton = document.getElementById('unlockMusicButton');
const musicSettings = document.querySelector('.music-settings');
const musicUrlInput = document.getElementById('musicUrl');
const musicFileInput = document.getElementById('musicFileInput');
const uploadMusicButton = document.getElementById('uploadMusicButton');
const applyMusicButton = document.getElementById('applyMusicButton');
const playPauseButton = document.getElementById('playPauseButton');
const passwordToggles = document.querySelectorAll('.password-toggle');

// ===== STATE MANAGEMENT =====
let state = {
    lastSpinTime: null,
    nextSpinTime: null,
    tips: Array(WHEEL_SEGMENTS).fill(''),
    backgroundUrl: '',
    musicUrl: '',
    isSpinning: false,
    activeParticles: 0,
    musicPlaying: false
};

// ===== LOCAL STORAGE UTILITIES =====
const STORAGE_KEYS = {
    LAST_SPIN: 'mysticalWheel_lastSpin',
    NEXT_SPIN: 'mysticalWheel_nextSpin',
    TIPS: 'mysticalWheel_tips',
    BACKGROUND: 'mysticalWheel_background',
    MUSIC: 'mysticalWheel_music'
};

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

function loadStateFromStorage() {
    state.lastSpinTime = getFromLocalStorage(STORAGE_KEYS.LAST_SPIN, null);
    state.nextSpinTime = getFromLocalStorage(STORAGE_KEYS.NEXT_SPIN, null);
    state.tips = getFromLocalStorage(STORAGE_KEYS.TIPS, Array(WHEEL_SEGMENTS).fill(''));
    state.backgroundUrl = getFromLocalStorage(STORAGE_KEYS.BACKGROUND, '');
    state.musicUrl = getFromLocalStorage(STORAGE_KEYS.MUSIC, '');
    
    // Apply loaded state
    updateTipTextareas();
    applyBackground();
    setupMusic();
    updateSpinButtonState();
}

// ===== WHEEL SPINNING MECHANICS =====
function spinWheel() {
    if (state.isSpinning || !canSpin()) return;
    
    state.isSpinning = true;
    spinButton.disabled = true;
    
    // Create magical effects for spinning
    createSpinParticles();
    activateRunicTablets();
    
    // Calculate random stopping position
    const randomSegment = Math.floor(Math.random() * WHEEL_SEGMENTS);
    const extraRotations = 3; // Full rotations before stopping
    const randomOffset = Math.random() * 0.8 - 0.4; // Small random offset within segment
    const finalAngle = (extraRotations * 360) + (randomSegment * SEGMENT_ANGLE) + (randomOffset * SEGMENT_ANGLE);
    
    // Apply rotation animation
    wheel.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.2, 0.8, 0.3, 1)`;
    wheel.style.transform = `rotate(${finalAngle}deg)`;
    
    // Wait for animation to complete
    setTimeout(() => {
        // Record spin time and set next available spin time
        const now = new Date().getTime();
        state.lastSpinTime = now;
        state.nextSpinTime = now + (SPIN_COOLDOWN_HOURS * 60 * 60 * 1000);
        
        saveToLocalStorage(STORAGE_KEYS.LAST_SPIN, state.lastSpinTime);
        saveToLocalStorage(STORAGE_KEYS.NEXT_SPIN, state.nextSpinTime);
        
        // Show tip from selected segment
        showTip(randomSegment);
        
        // Reset state
        state.isSpinning = false;
        updateSpinButtonState();
        
        // Create tip revelation particles
        createTipRevealParticles();
    }, SPIN_DURATION);
}

function canSpin() {
    if (!state.nextSpinTime) return true;
    
    const now = new Date().getTime();
    return now >= state.nextSpinTime;
}

function updateSpinButtonState() {
    if (state.isSpinning) {
        spinButton.disabled = true;
        return;
    }
    
    if (canSpin()) {
        spinButton.disabled = false;
        countdownTimer.classList.add('hidden');
    } else {
        spinButton.disabled = true;
        updateCountdownDisplay();
        countdownTimer.classList.remove('hidden');
        
        // Start countdown timer
        if (!window.countdownInterval) {
            window.countdownInterval = setInterval(updateCountdownDisplay, 1000);
        }
    }
}

function updateCountdownDisplay() {
    if (!state.nextSpinTime) return;
    
    const now = new Date().getTime();
    const timeRemaining = state.nextSpinTime - now;
    
    if (timeRemaining <= 0) {
        clearInterval(window.countdownInterval);
        window.countdownInterval = null;
        updateSpinButtonState();
        return;
    }
    
    // Calculate hours, minutes, seconds
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    
    // Format with leading zeros
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerValue.textContent = formattedTime;
}

function showTip(segmentIndex) {
    const tip = state.tips[segmentIndex] || 'No tip available for this segment. Please add tips in the admin panel.';
    const tipContent = document.querySelector('.tip-content');
    tipContent.textContent = tip;
    openModal(tipDisplayModal);
}

// ===== ADMIN FUNCTIONALITY =====
function validateAdminPasscode(passcode) {
    return passcode === ADMIN_PASSCODE;
}

function validateMusicPasscode(passcode) {
    return passcode === MUSIC_PASSCODE;
}

function updateTipTextareas() {
    tipTextareas.forEach((textarea, index) => {
        textarea.value = state.tips[index] || '';
    });
}

function saveTips() {
    const newTips = Array.from(tipTextareas).map(textarea => textarea.value.trim());
    state.tips = newTips;
    saveToLocalStorage(STORAGE_KEYS.TIPS, state.tips);
    showMysticalMessage('Tips saved successfully!');
}

function applyBackground() {
    if (!state.backgroundUrl) return;
    
    const mysticalBackground = document.querySelector('.mystical-background');
    mysticalBackground.style.backgroundImage = `linear-gradient(135deg, rgba(15, 27, 60, 0.7) 0%, rgba(45, 27, 105, 0.7) 100%), url('${state.backgroundUrl}')`;
    mysticalBackground.style.backgroundSize = 'cover';
    mysticalBackground.style.backgroundPosition = 'center';
}

function setupMusic() {
    if (!state.musicUrl) return;
    
    backgroundMusic.src = state.musicUrl;
    backgroundMusic.load();
    
    // Attempt autoplay (will likely be blocked by browsers)
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            state.musicPlaying = true;
        }).catch(error => {
            // Autoplay was prevented, need user interaction
            state.musicPlaying = false;
        });
    }
}

function toggleMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        state.musicPlaying = true;
    } else {
        backgroundMusic.pause();
        state.musicPlaying = false;
    }
}

function handleFileUpload(fileInput, maxSize, fileTypeRegex, errorMessage, successCallback) {
    const file = fileInput.files[0];
    if (!file) return;
    
    if (file.size > maxSize) {
        showMysticalMessage(`File too large! Maximum size: ${maxSize / (1024 * 1024)}MB`, true);
        return;
    }
    
    if (!fileTypeRegex.test(file.type)) {
        showMysticalMessage(errorMessage, true);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        successCallback(e.target.result);
    };
    reader.onerror = () => {
        showMysticalMessage('Error reading file!', true);
    };
    
    reader.readAsDataURL(file);
}

// ===== MODAL MANAGEMENT =====
function openModal(modal) {
    // Close any open modals first
    modalOverlays.forEach(overlay => overlay.classList.add('hidden'));
    
    // Open the requested modal
    modal.classList.remove('hidden');
    
    // Create portal summoning effect
    createModalSummoningParticles(modal);
}

function closeAllModals() {
    modalOverlays.forEach(overlay => overlay.classList.add('hidden'));
}

function showMysticalMessage(message, isError = false) {
    // Create a mystical floating message
    const messageElement = document.createElement('div');
    messageElement.className = `mystical-message ${isError ? 'error' : 'success'}`;
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    // Add particles around the message
    createMessageParticles(messageElement, isError);
    
    // Remove after animation
    setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 500);
    }, 3000);
}

// ===== MAGICAL EFFECTS =====
function createParticle(x, y, color, size, duration, container = document) {
    if (state.activeParticles >= PARTICLE_LIMIT) return null;
    
    const particle = document.createElement('div');
    particle.className = 'magical-particle';
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.opacity = '0.8';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '50';
    
    container.body.appendChild(particle);
    state.activeParticles++;
    
    // Animate the particle
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    const distance = 50 + Math.random() * 100;
    const destX = x + Math.cos(angle) * distance;
    const destY = y + Math.sin(angle) * distance;
    
    particle.animate([
        { transform: 'scale(0)', opacity: 0.8, offset: 0 },
        { transform: 'scale(1)', opacity: 0.6, offset: 0.2 },
        { transform: `translate(${destX - x}px, ${destY - y}px)`, opacity: 0, offset: 1 }
    ], {
        duration: duration,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
    });
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            state.activeParticles--;
        }
    }, duration);
    
    return particle;
}

function createSpinParticles() {
    const wheelRect = wheel.getBoundingClientRect();
    const centerX = wheelRect.left + wheelRect.width / 2;
    const centerY = wheelRect.top + wheelRect.height / 2;
    const radius = wheelRect.width / 2;
    
    // Create 25-30 particles spiraling around the wheel
    const particleCount = 25 + Math.floor(Math.random() * 6);
    const colors = [
        'rgba(136, 204, 255, 0.8)', // cool-cyan
        'rgba(204, 204, 255, 0.8)', // ethereal-purple
        'rgba(255, 182, 193, 0.8)', // gentle-pink
        'rgba(221, 160, 221, 0.8)'  // warm-lavender
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius * 0.8;
        const y = centerY + Math.sin(angle) * radius * 0.8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 8 + Math.random() * 4;
        
        createParticle(x, y, color, size, SPIN_DURATION);
    }
}

function createTipRevealParticles() {
    const wheelRect = wheel.getBoundingClientRect();
    const centerX = wheelRect.left + wheelRect.width / 2;
    const centerY = wheelRect.top + wheelRect.height / 2;
    
    // Create 35-40 particles bursting from center
    const particleCount = 35 + Math.floor(Math.random() * 6);
    const colors = [
        'rgba(136, 204, 255, 0.8)', // cool-cyan
        'rgba(204, 204, 255, 0.8)', // ethereal-purple
        'rgba(255, 182, 193, 0.8)', // gentle-pink
        'rgba(221, 160, 221, 0.8)',  // warm-lavender
        'rgba(255, 255, 255, 0.9)'  // pure-white
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 6 + Math.random() * 6;
        
        createParticle(centerX, centerY, color, size, 2500);
    }
}

function createModalSummoningParticles(modal) {
    const modalRect = modal.querySelector('.mystical-modal').getBoundingClientRect();
    const centerX = modalRect.left + modalRect.width / 2;
    const centerY = modalRect.top + modalRect.height / 2;
    
    // Create a ring of particles around the modal
    const particleCount = 20;
    const radius = Math.max(modalRect.width, modalRect.height) * 0.6;
    const colors = [
        'rgba(136, 204, 255, 0.8)', // cool-cyan
        'rgba(204, 204, 255, 0.8)', // ethereal-purple
        'rgba(255, 182, 193, 0.8)', // gentle-pink
        'rgba(221, 160, 221, 0.8)'  // warm-lavender
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 5 + Math.random() * 5;
        
        createParticle(x, y, color, size, 1500);
    }
}

function createButtonClickParticles(button) {
    const buttonRect = button.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;
    
    // Create 8-10 particles bursting from button
    const particleCount = 8 + Math.floor(Math.random() * 3);
    const colors = [
        'rgba(136, 204, 255, 0.8)', // cool-cyan
        'rgba(204, 204, 255, 0.8)', // ethereal-purple
        'rgba(255, 255, 255, 0.9)'  // pure-white
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 4 + Math.random() * 4;
        
        createParticle(centerX, centerY, color, size, 1000);
    }
}

function createMessageParticles(messageElement, isError) {
    const messageRect = messageElement.getBoundingClientRect();
    const centerX = messageRect.left + messageRect.width / 2;
    const centerY = messageRect.top + messageRect.height / 2;
    
    // Create particles around the message
    const particleCount = 12;
    const radius = Math.max(messageRect.width, messageRect.height) * 0.5;
    const colors = isError ? 
        ['rgba(255, 100, 100, 0.8)', 'rgba(255, 150, 150, 0.8)'] : 
        ['rgba(100, 255, 150, 0.8)', 'rgba(150, 255, 200, 0.8)'];
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 4 + Math.random() * 3;
        
        createParticle(x, y, color, size, 2000);
    }
}

function activateRunicTablets() {
    floatingTablets.forEach(tablet => {
        tablet.classList.add('active');
        setTimeout(() => {
            tablet.classList.remove('active');
        }, SPIN_DURATION);
    });
}

// Add CSS for activated tablets
const tabletStyle = document.createElement('style');
tabletStyle.textContent = `
    .runic-tablet.active {
        box-shadow: 0 0 25px var(--cool-cyan);
        opacity: 1;
        animation-duration: 0.5s !important;
    }
    
    .mystical-message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(45, 27, 105, 0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-family: var(--font-secondary);
        font-size: 1.1rem;
        box-shadow: 0 0 15px var(--cool-cyan);
        z-index: 1000;
        animation: messageAppear 0.5s forwards;
    }
    
    .mystical-message.error {
        box-shadow: 0 0 15px rgba(255, 100, 100, 0.8);
    }
    
    .mystical-message.success {
        box-shadow: 0 0 15px rgba(100, 255, 150, 0.8);
    }
    
    .mystical-message.fade-out {
        animation: messageFade 0.5s forwards;
    }
    
    @keyframes messageAppear {
        from { opacity: 0; transform: translate(-50%, -20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    
    @keyframes messageFade {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(tabletStyle);

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Spin button
    spinButton.addEventListener('click', () => {
        spinWheel();
        createButtonClickParticles(spinButton);
    });
    
    // Admin icon
    adminIcon.addEventListener('click', () => {
        openModal(adminAccessModal);
        createButtonClickParticles(adminIcon);
    });
    
    // Admin passcode validation
    adminAccessModal.querySelector('.submit-button').addEventListener('click', () => {
        const passcode = adminPasscodeInput.value;
        if (validateAdminPasscode(passcode)) {
            closeAllModals();
            openModal(adminControlPanel);
            adminPasscodeInput.value = '';
        } else {
            showMysticalMessage('Incorrect passcode!', true);
        }
        createButtonClickParticles(adminAccessModal.querySelector('.submit-button'));
    });
    
    // Music passcode validation
    musicSettingsModal.querySelector('.submit-button').addEventListener('click', () => {
        const passcode = musicPasscodeInput.value;
        if (validateMusicPasscode(passcode)) {
            closeAllModals();
            musicSettings.classList.remove('hidden');
            musicPasscodeInput.value = '';
        } else {
            showMysticalMessage('Incorrect music passcode!', true);
        }
        createButtonClickParticles(musicSettingsModal.querySelector('.submit-button'));
    });
    
    // Save tips button
    saveTipsButton.addEventListener('click', () => {
        saveTips();
        createButtonClickParticles(saveTipsButton);
    });
    
    // Background URL application
    applyBackgroundButton.addEventListener('click', () => {
        const url = backgroundUrlInput.value.trim();
        if (url) {
            state.backgroundUrl = url;
            saveToLocalStorage(STORAGE_KEYS.BACKGROUND, url);
            applyBackground();
            showMysticalMessage('Background applied!');
        } else {
            showMysticalMessage('Please enter a valid URL', true);
        }
        createButtonClickParticles(applyBackgroundButton);
    });
    
    // Background file upload
    uploadBackgroundButton.addEventListener('click', () => {
        backgroundFileInput.click();
        createButtonClickParticles(uploadBackgroundButton);
    });
    
    backgroundFileInput.addEventListener('change', () => {
        handleFileUpload(
            backgroundFileInput,
            MAX_IMAGE_SIZE,
            /^image\/(jpeg|png|gif)$/,
            'Invalid file type! Please upload JPG, PNG, or GIF.',
            (dataUrl) => {
                state.backgroundUrl = dataUrl;
                backgroundUrlInput.value = 'Uploaded image file';
                saveToLocalStorage(STORAGE_KEYS.BACKGROUND, dataUrl);
                applyBackground();
                showMysticalMessage('Background image uploaded!');
            }
        );
    });
    
    // Music unlock button
    unlockMusicButton.addEventListener('click', () => {
        openModal(musicSettingsModal);
        createButtonClickParticles(unlockMusicButton);
    });
    
    // Music URL application
    applyMusicButton.addEventListener('click', () => {
        const url = musicUrlInput.value.trim();
        if (url) {
            state.musicUrl = url;
            saveToLocalStorage(STORAGE_KEYS.MUSIC, url);
            setupMusic();
            showMysticalMessage('Music applied!');
        } else {
            showMysticalMessage('Please enter a valid URL', true);
        }
        createButtonClickParticles(applyMusicButton);
    });
    
    // Music file upload
    uploadMusicButton.addEventListener('click', () => {
        musicFileInput.click();
        createButtonClickParticles(uploadMusicButton);
    });
    
    musicFileInput.addEventListener('change', () => {
        handleFileUpload(
            musicFileInput,
            MAX_AUDIO_SIZE,
            /^audio\/(mp3|wav|ogg)$/,
            'Invalid file type! Please upload MP3, WAV, or OGG.',
            (dataUrl) => {
                state.musicUrl = dataUrl;
                musicUrlInput.value = 'Uploaded audio file';
                saveToLocalStorage(STORAGE_KEYS.MUSIC, dataUrl);
                setupMusic();
                showMysticalMessage('Music uploaded!');
            }
        );
    });
    
    // Play/pause music
    playPauseButton.addEventListener('click', () => {
        toggleMusic();
        createButtonClickParticles(playPauseButton);
    });
    
    // Close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Close modals when clicking outside
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeAllModals();
            }
        });
    });
    
    // Password toggles
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input[type]');
            if (input.type === 'password') {
                input.type = 'text';
                toggle.querySelector('.mystical-eye').style.opacity = '1';
            } else {
                input.type = 'password';
                toggle.querySelector('.mystical-eye').style.opacity = '0.7';
            }
        });
    });
    
    // Enter key for passcode inputs
    adminPasscodeInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            adminAccessModal.querySelector('.submit-button').click();
        }
    });
    
    musicPasscodeInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            musicSettingsModal.querySelector('.submit-button').click();
        }
    });
}

// ===== INITIALIZATION =====
function init() {
    // Load saved state
    loadStateFromStorage();
    
    // Set up event listeners
    setupEventListeners();
    
    // Update spin button state
    updateSpinButtonState();
    
    // Create ambient particles
    createAmbientParticles();
}

function createAmbientParticles() {
    // Create 8-10 larger background particles
    const particleCount = 8 + Math.floor(Math.random() * 3);
    const colors = [
        'rgba(136, 204, 255, 0.3)', // cool-cyan
        'rgba(204, 204, 255, 0.3)', // ethereal-purple
        'rgba(255, 182, 193, 0.3)', // gentle-pink
        'rgba(221, 160, 221, 0.3)'  // warm-lavender
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 10 + Math.random() * 5;
        
        const particle = createParticle(x, y, color, size, 15000);
        
        // Recreate particle when it disappears
        if (particle) {
            setTimeout(() => {
                createAmbientParticles();
            }, 15000 - Math.random() * 5000);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);
