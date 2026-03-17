// Global variables
const MAIN_CONTAINER = document.querySelector('.main-container');
let IS_POINTER_DOWN = false;
const HEART_GENERATION_RATE = 50; // milliseconds between hearts
let LAST_POINTER_POSITION = { x: 0, y: 0 };
let heartInterval = null;

// Function to generate a heart SVG element
function generateHeart(position) {
    const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    heart.setAttribute('viewBox', '0 0 24 24');
    heart.classList.add('heart', 'fade-out');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
        'd',
        'M12 21s-7.2-4.6-9.6-8.5C.8 9.8 2.2 6.6 5.4 5.6c1.9-.6 4 .1 5.2 1.6 1.2-1.5 3.3-2.2 5.2-1.6 3.2 1 4.6 4.2 3 6.9C19.2 16.4 12 21 12 21z'
    );

    heart.appendChild(path);

    heart.style.left = `${position.x}px`;
    heart.style.top = `${position.y}px`;

    // Random horizontal drift (-100px to +100px)
    const driftX = (Math.random() - 0.5) * 200;
    heart.style.setProperty('--drift-x', `${driftX}px`);

    return heart;
}

// Function to start generating hearts
function startHeartGeneration() {
    if (heartInterval) return;
    
    // Generate first heart immediately
    const heart = generateHeart(LAST_POINTER_POSITION);
    MAIN_CONTAINER.appendChild(heart);
    setTimeout(() => heart.remove(), 2100);
    
    // Start continuous generation
    heartInterval = setInterval(() => {
        if (IS_POINTER_DOWN) {
            const heart = generateHeart(LAST_POINTER_POSITION);
            MAIN_CONTAINER.appendChild(heart);
            setTimeout(() => heart.remove(), 2100);
        }
    }, HEART_GENERATION_RATE);
}

// Function to stop generating hearts
function stopHeartGeneration() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
    IS_POINTER_DOWN = false;
}

// Track mouse movement when pointer is down
MAIN_CONTAINER.addEventListener('pointermove', (event) => {
    if (IS_POINTER_DOWN) {
        LAST_POINTER_POSITION = { x: event.clientX, y: event.clientY };
    }
});

MAIN_CONTAINER.addEventListener('pointerdown', (event) => {
    IS_POINTER_DOWN = true;
    LAST_POINTER_POSITION = { x: event.clientX, y: event.clientY };
    
    // Start generating hearts
    startHeartGeneration();
});

// Stop generating hearts when pointer is released
MAIN_CONTAINER.addEventListener('pointerup', () => {
    stopHeartGeneration();
});

// Also stop if pointer leaves the container while pressed
MAIN_CONTAINER.addEventListener('pointerleave', (event) => {
    if (IS_POINTER_DOWN) {
        stopHeartGeneration();
    }
});