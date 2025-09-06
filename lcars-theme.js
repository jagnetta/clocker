/**
 * LCARS Star Trek Theme Module
 * Contains all LCARS-specific functionality extracted from the main script
 */

// LCARS theme variables
let warpStarsInterval;
let activeUfos = 0;

/**
 * Initialize and activate the LCARS theme
 * This is the main entry point for the LCARS theme
 */
function initLcarsTheme() {
    console.log('🖖 Initializing LCARS theme...');
    
    // Ensure theme is properly set (should already be done by switchToTheme)
    currentTheme = 'lcars';
    
    // Start LCARS-specific effects
    if (!isMobileDevice) {
        initWarpSpeed();
    }
    
    // Update LCARS-specific labels
    updateLcarsLabels();
    
    console.log('🖖 LCARS INTERFACE ENGAGED 🖖');
}

/**
 * Clean up LCARS theme effects and resources
 */
function cleanupLcarsTheme() {
    console.log('🧹 Cleaning up LCARS theme...');
    
    // Clear LCARS-specific intervals
    if (warpStarsInterval) {
        clearInterval(warpStarsInterval);
        warpStarsInterval = null;
    }
    
    // Remove all warp stars
    const warpContainer = document.getElementById('warpStars');
    if (warpContainer) {
        warpContainer.innerHTML = '';
    }
    
    // Reset UFO counter
    activeUfos = 0;
    
    console.log('✅ LCARS theme cleanup complete');
}

/**
 * Switch to LCARS theme and initialize all effects
 * @deprecated - Use initLcarsTheme() instead for proper theme switching
 */
function switchToLcarsTheme() {
    // Set theme
    if (typeof currentTheme !== 'undefined') {
        currentTheme = 'lcars';
    }
    document.body.classList.remove('thor-theme');
    document.body.classList.add('lcars-theme');
    
    // Show/hide backgrounds
    document.getElementById('matrixBg').classList.add('hidden');
    document.getElementById('lcarsBg').classList.remove('hidden');
    document.getElementById('thorBg').classList.add('hidden');
    
    // Stop other effects
    if (typeof thorEffectsInterval !== 'undefined' && thorEffectsInterval) {
        clearInterval(thorEffectsInterval);
    }
    if (typeof matrixKanjiInterval !== 'undefined' && matrixKanjiInterval) {
        clearInterval(matrixKanjiInterval);
    }
    
    // Start warp effects (only if not mobile)
    if (!isMobileDevice) {
        initWarpSpeed();
    }
    
    // Update labels
    updateLcarsLabels();
    
    console.log('🖖 LCARS INTERFACE ENGAGED 🖖');
}

/**
 * Update theme labels for LCARS theme
 */
function updateLcarsLabels() {
    const timezoneLabel = document.querySelector('.timezone-label');
    const cityLabel = document.querySelector('.city-label');
    
    if (timezoneLabel) timezoneLabel.textContent = '🖖 TEMPORAL COORDINATES 🖖';
    if (cityLabel) cityLabel.textContent = '🌌 ATMOSPHERIC CONDITIONS';
}

/**
 * Initialize warp speed effect for LCARS theme
 */
function initWarpSpeed() {
    const warpContainer = document.getElementById('warpStars');
    
    // Clear existing stars
    warpContainer.innerHTML = '';
    
    // Create initial stars
    for (let i = 0; i < 40; i++) {
        createWarpStar();
    }
    
    // Continuously create new stars
    warpStarsInterval = registerInterval(setInterval(() => {
        createWarpStar();
        
        // Clean up old stars
        const stars = warpContainer.querySelectorAll('.warp-star');
        if (stars.length > 80) {
            stars[0].remove();
        }
    }, 300));
}

/**
 * Create a single warp star
 */
function createWarpStar() {
    const warpContainer = document.getElementById('warpStars');
    if (!warpContainer) return;
    
    // Create only stars, no Borg cubes
    const star = document.createElement('div');
    star.className = 'warp-star';
    
    // 3D movement toward user
    const size = Math.random() * 3 + 2; // Made slightly larger
    const xPos = Math.random() * window.innerWidth;
    const yPos = Math.random() * window.innerHeight;
    const duration = Math.random() * 3 + 2; // 2-5 seconds
    const delay = Math.random() * 1; // 0-1 second delay
    
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = xPos + 'px';
    star.style.top = yPos + 'px';
    star.style.animationDuration = duration + 's';
    star.style.animationDelay = delay + 's';
    
    warpContainer.appendChild(star);
    
    // Remove star after animation
    setTimeout(() => {
        if (star.parentNode) {
            star.remove();
        }
    }, (duration + delay) * 1000 + 100);
}

/**
 * Create Klingon Flyby (Photon Torpedo Formation)
 */
function createKlingonFlyby(clickX, clickY) {
    // Create photon torpedo triangle formation
    const formation = document.createElement('div');
    formation.className = 'photon-torpedo-formation';
    
    // Position formation at click location
    formation.style.left = clickX + 'px';
    formation.style.top = clickY + 'px';
    
    // Determine movement direction based on click quadrant
    let direction;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    if (clickX < centerX && clickY < centerY) {
        direction = 'top-left'; // Move diagonally up-left
    } else if (clickX >= centerX && clickY < centerY) {
        direction = 'top-right'; // Move diagonally up-right
    } else if (clickX < centerX && clickY >= centerY) {
        direction = 'bottom-left'; // Move diagonally down-left
    } else {
        direction = 'bottom-right'; // Move diagonally down-right
    }
    
    // Also add some pure directional movement
    const movements = ['horizontal', 'vertical', 'diagonal'];
    const randomMovement = movements[Math.floor(Math.random() * movements.length)];
    
    formation.setAttribute('data-direction', direction);
    formation.setAttribute('data-movement', randomMovement);
    
    // Create triangle formation with photon torpedo starburst icons
    const torpedoPositions = [
        { x: 0, y: -40 }, // Top torpedo (triangle point)
        { x: -35, y: 25 }, // Bottom left torpedo
        { x: 35, y: 25 }   // Bottom right torpedo
    ];
    
    torpedoPositions.forEach((pos, i) => {
        const torpedo = document.createElement('div');
        torpedo.className = 'photon-torpedo';
        torpedo.innerHTML = '✦'; // Starburst/photon torpedo icon
        torpedo.style.left = pos.x + 'px';
        torpedo.style.top = pos.y + 'px';
        torpedo.style.animationDelay = (i * 0.1) + 's';
        torpedo.setAttribute('data-torpedo-index', i);
        formation.appendChild(torpedo);
    });
    
    // Set animation based on direction and movement type
    let animationName = `photonTorpedo${direction.replace('-', '')}${randomMovement}`;
    formation.style.animation = `${animationName} 2.5s ease-out`;
    
    document.body.appendChild(formation);
    
    setTimeout(() => {
        if (formation.parentNode) {
            formation.remove();
        }
    }, 2500);
}

/**
 * Create Star Trek UFO Flyby
 */
function createStarTrekFlyby(clickX, clickY) {
    // Prevent more than 2 UFOs
    if (activeUfos >= 2) {
        console.log('Maximum UFOs active, skipping...');
        return;
    }
    
    console.log('Engage! UFO flyby...', clickX, clickY);
    activeUfos++;
    
    // UFO only
    const symbol = '🛸';
    
    const starTrekObject = document.createElement('div');
    starTrekObject.className = 'star-trek-flyby';
    starTrekObject.innerHTML = symbol;
    
    // Starting position at click location
    starTrekObject.style.position = 'fixed';
    starTrekObject.style.left = clickX + 'px';
    starTrekObject.style.top = clickY + 'px';
    starTrekObject.style.fontSize = '80px';
    starTrekObject.style.zIndex = '10000';
    starTrekObject.style.filter = 'brightness(1.5) drop-shadow(0 0 15px #ff9900) drop-shadow(0 0 30px #ff9900)';
    starTrekObject.style.textShadow = '0 0 20px #ff9900, 0 0 40px #ffcc66';
    starTrekObject.style.transition = 'none';
    
    document.body.appendChild(starTrekObject);
    
    // Get viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Starting velocity for faster UFO movement
    let vx = (Math.random() - 0.5) * 25;
    let vy = (Math.random() - 0.5) * 25;
    
    // Ensure significant movement - faster than before
    if (Math.abs(vx) < 10) vx = vx > 0 ? 10 : -10;
    if (Math.abs(vy) < 10) vy = vy > 0 ? 10 : -10;
    
    let currentX = clickX;
    let currentY = clickY;
    let bounces = 0;
    const maxBounces = 3; // Fewer bounces than rabbit
    
    function animateStarTrekObject() {
        currentX += vx;
        currentY += vy;
        
        // Warp core breach - bounce off edges
        if (currentX <= 0 || currentX >= vw - 80) {
            vx = -vx;
            currentX = Math.max(0, Math.min(currentX, vw - 80));
            bounces++;
        }
        
        if (currentY <= 0 || currentY >= vh - 80) {
            vy = -vy;
            currentY = Math.max(0, Math.min(currentY, vh - 80));
            bounces++;
        }
        
        starTrekObject.style.left = currentX + 'px';
        starTrekObject.style.top = currentY + 'px';
        
        if (bounces < maxBounces) {
            requestAnimationFrame(animateStarTrekObject);
        } else {
            // Engage warp drive - exit to nearest edge
            const exitDirection = getWarpExitDirection(currentX, currentY, vw, vh);
            
            starTrekObject.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            setTimeout(() => {
                starTrekObject.style.transform = `translate(${exitDirection.x}px, ${exitDirection.y}px) scale(0.2)`;
                starTrekObject.style.opacity = '0';
                starTrekObject.style.filter = 'brightness(1.5) drop-shadow(0 0 15px #ff9900) drop-shadow(0 0 30px #ff9900) blur(3px)';
            }, 50);
            
            setTimeout(() => {
                if (starTrekObject.parentNode) {
                    starTrekObject.remove();
                }
                activeUfos--; // Allow new UFOs
            }, 2000);
        }
    }
    
    function getWarpExitDirection(x, y, vw, vh) {
        const distToLeft = x;
        const distToRight = vw - x;
        const distToTop = y;
        const distToBottom = vh - y;
        
        const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
        
        if (minDist === distToLeft) {
            return { x: -400, y: 0 };
        } else if (minDist === distToRight) {
            return { x: 400, y: 0 };
        } else if (minDist === distToTop) {
            return { x: 0, y: -400 };
        } else {
            return { x: 0, y: 400 };
        }
    }
    
    animateStarTrekObject();
}

/**
 * Handle click events for LCARS theme
 */
function handleLcarsClick(clickX, clickY) {
    // 25% chance to show UFO/Galaxy, 75% chance for photon torpedoes
    if (Math.random() < 0.25) {
        console.log('Engage! Star Trek flyby...');
        createStarTrekFlyby(clickX, clickY);
    } else {
        console.log('Triggering LCARS photon torpedoes');
        createKlingonFlyby(clickX, clickY);
    }
}

/**
 * Cleanup function for LCARS theme
 */
function cleanupLcarsTheme() {
    if (warpStarsInterval) {
        clearInterval(warpStarsInterval);
        warpStarsInterval = null;
    }
    
    // Clear active UFO counter
    activeUfos = 0;
}

// Export functions for use in main script
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        initLcarsTheme,
        switchToLcarsTheme,
        handleLcarsClick,
        cleanupLcarsTheme
    };
} else if (typeof window !== 'undefined') {
    // Browser environment - attach to window object
    window.LcarsTheme = {
        initLcarsTheme,
        switchToLcarsTheme,
        handleLcarsClick,
        cleanupLcarsTheme
    };
}