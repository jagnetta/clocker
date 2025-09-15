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
    
    // Ensure theme is properly set (should already be done by switchToTheme)
    currentTheme = 'lcars';
    
    // Setup weather panel
    const lcarsBg = document.getElementById('lcarsBg');
    if (lcarsBg && typeof setupWeather === 'function') {
        setupWeather(lcarsBg);
    }
    
    // FORCE ensure LCARS theme class is applied and others are removed
    document.body.classList.remove('matrix-theme', 'thor-theme', 'og-theme');
    document.body.classList.add('lcars-theme');
    
    // Force clean up any lingering Matrix/Thor contamination
    document.body.removeAttribute('style');
    
    // Force stop ALL animations that might be affecting layout
    const animatedElements = document.querySelectorAll('*');
    animatedElements.forEach(el => {
        if (el.style) {
            // Stop animations completely
            if (el.style.animation && el.style.animation !== 'none') {
                el.style.animation = 'none';
            }
            if (el.style.animationPlayState) {
                el.style.animationPlayState = 'paused';
            }
            // Reset transforms that cause movement
            if (el.style.transform && (el.style.transform.includes('translate') || el.style.transform.includes('matrix'))) {
                el.style.transform = '';
            }
            // Reset transitions that might cause movement
            if (el.style.transition) {
                el.style.transition = 'none';
            }
        }
    });
    
    // SPECIFICALLY target and fix the clock display positioning
    const clockDisplay = document.querySelector('.clock-display');
    if (clockDisplay && clockDisplay.style) {
        clockDisplay.style.transform = '';
        clockDisplay.style.animation = 'none';
        clockDisplay.style.transition = 'none';
        clockDisplay.style.top = '';
        clockDisplay.style.left = '';
        clockDisplay.style.position = '';
        // Force reflow
        clockDisplay.offsetHeight;
    }
    
    // FORCE proper background management
    const matrixBg = document.getElementById('matrixBg');
    const lcarsBg = document.getElementById('lcarsBg'); 
    const thorBg = document.getElementById('thorBg');
    
    if (matrixBg) {
        matrixBg.classList.add('hidden');
        matrixBg.removeAttribute('style');
    }
    if (thorBg) {
        thorBg.classList.add('hidden');
        thorBg.removeAttribute('style');
    }
    if (lcarsBg) {
        lcarsBg.removeAttribute('style');
        lcarsBg.classList.remove('hidden');
        
        // Force LCARS background visibility with !important override
        lcarsBg.style.setProperty('opacity', '1', 'important');
        lcarsBg.style.setProperty('visibility', 'visible', 'important');
        lcarsBg.style.setProperty('display', 'block', 'important');
        lcarsBg.style.setProperty('z-index', '1', 'important');
        
        lcarsBg.offsetHeight; // Force reflow
        
        // Ensure LCARS interface elements are visible
        const lcarsInterface = lcarsBg.querySelector('.lcars-interface');
        if (lcarsInterface) {
            lcarsInterface.style.setProperty('opacity', '1', 'important');
            lcarsInterface.style.setProperty('visibility', 'visible', 'important');
            lcarsInterface.style.setProperty('display', 'block', 'important');
        }
    }
    
    // Force cleanup any lingering Matrix/Thor elements
    const contaminationElements = document.querySelectorAll(
        '.matrix-column-char, .matrix-white-rabbit, .matrix-red-pill, .matrix-blue-pill, .lightning-flash, .mjolnir-strike, .loki-illusion'
    );
    contaminationElements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
    });
    
    // AGGRESSIVE Matrix color contamination cleanup
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        if (el.style) {
            // Remove Matrix green colors
            if (el.style.color === 'rgb(0, 255, 0)' || el.style.color === '#00ff00' || 
                el.style.color === '#00FF00' || el.style.color.toLowerCase().includes('#0f0')) {
                el.style.color = '';
            }
            // Remove Matrix text-shadow
            if (el.style.textShadow && (el.style.textShadow.includes('0 0') || el.style.textShadow.includes('green'))) {
                el.style.textShadow = '';
            }
            // Remove Matrix background colors
            if (el.style.background && el.style.background.includes('#00ff00')) {
                el.style.background = '';
            }
        }
    });
    
    // Clear all effect containers
    const containers = ['particles', 'lightningEffects', 'thorParticles', 'asgardRunes'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            container.removeAttribute('style');
        }
    });
    
    // FORCE cleanup any existing LCARS effects before starting new ones
    if (warpStarsInterval) {
        clearInterval(warpStarsInterval);
        warpStarsInterval = null;
    }
    
    // Clear warp container completely and reset
    const warpContainer = document.getElementById('warpStars');
    if (warpContainer) {
        warpContainer.innerHTML = '';
        warpContainer.removeAttribute('style');
        // Force stop any CSS animations on the container
        warpContainer.style.animation = 'none';
        warpContainer.offsetHeight; // Force reflow
        warpContainer.style.animation = '';
    }
    
    // Remove any lingering LCARS animation elements
    const existingLcarsElements = document.querySelectorAll('.warp-star, .star-trek-flyby, .photon-torpedo-formation');
    existingLcarsElements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
    });
    
    // Reset UFO counter
    activeUfos = 0;
    
    // Wait a moment for cleanup to complete before starting new effects
    setTimeout(() => {
        // Start LCARS-specific effects
        if (!isMobileDevice) {
            initWarpSpeed();
        }
    }, 50);
    
    // Update LCARS-specific labels
    updateLcarsLabels();
    
    // Force DOM reflow and CSS application with delay
    document.body.offsetHeight; // Force reflow
    
    setTimeout(() => {
        // Double-check theme class application
        if (!document.body.classList.contains('lcars-theme')) {
            document.body.classList.add('lcars-theme');
        }
        
        // Force another reflow to ensure LCARS styles are applied
        const clockDisplay = document.querySelector('.clock-display');
        if (clockDisplay) {
            clockDisplay.offsetHeight;
        }
        
        // Final check to ensure LCARS background is visible
        const finalLcarsBg = document.getElementById('lcarsBg');
        if (finalLcarsBg) {
            finalLcarsBg.style.setProperty('opacity', '1', 'important');
            finalLcarsBg.style.setProperty('visibility', 'visible', 'important');
            const lcarsInterface = finalLcarsBg.querySelector('.lcars-interface');
            if (lcarsInterface) {
                lcarsInterface.style.setProperty('opacity', '1', 'important');
                lcarsInterface.style.setProperty('visibility', 'visible', 'important');
            }
        }
        
    }, 100);
}

/**
 * Clean up LCARS theme effects and resources - complete cleanup
 */
function cleanupLcarsTheme() {
    
    // Clear intervals
    if (warpStarsInterval) {
        clearInterval(warpStarsInterval);
        warpStarsInterval = null;
    }
    
    // Clear warp stars container completely
    const warpContainer = document.getElementById('warpStars');
    if (warpContainer) {
        warpContainer.innerHTML = '';
        warpContainer.removeAttribute('style');
    }
    
    // Remove any lingering LCARS elements more comprehensively
    const lcarsElements = document.querySelectorAll(
        '.warp-star, .star-trek-flyby, .photon-torpedo-formation, .lcars-element, .lcars-panel'
    );
    lcarsElements.forEach(el => el.remove());
    
    // Clear active UFO counter
    activeUfos = 0;
    
    // Remove LCARS-specific body classes
    document.body.classList.remove('lcars-theme');
    
    // Hide LCARS background
    const lcarsBg = document.getElementById('lcarsBg');
    if (lcarsBg) {
        lcarsBg.classList.add('hidden');
        lcarsBg.removeAttribute('style');
    }
    
    // Force cleanup of any LCARS-themed elements that might affect other themes
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        if (el.style && el.style.color === 'rgb(255, 153, 0)' && !el.closest('.clock-display, .weather-panel')) {
            el.style.color = '';
        }
        if (el.style && el.style.textShadow && el.style.textShadow.includes('255, 153, 0')) {
            el.style.textShadow = '';
        }
    });
    
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
    
    // Remove ALL theme classes first to prevent contamination
    document.body.classList.remove('matrix-theme', 'thor-theme', 'og-theme');
    document.body.classList.add('lcars-theme');
    
    // Force clean body styles to prevent Matrix green contamination
    document.body.removeAttribute('style');
    
    // Show/hide backgrounds properly with complete reset
    const matrixBg = document.getElementById('matrixBg');
    const lcarsBg = document.getElementById('lcarsBg'); 
    const thorBg = document.getElementById('thorBg');
    
    // Force hide other backgrounds and reset their styles
    if (matrixBg) {
        matrixBg.classList.add('hidden');
        matrixBg.removeAttribute('style');
    }
    if (thorBg) {
        thorBg.classList.add('hidden');
        thorBg.removeAttribute('style');
    }
    
    // Show LCARS background cleanly
    if (lcarsBg) {
        lcarsBg.removeAttribute('style');
        lcarsBg.classList.remove('hidden');
        lcarsBg.offsetHeight; // Force reflow
    }
    
    // Clean up Matrix contamination completely
    if (typeof cleanupMatrixTheme === 'function') {
        cleanupMatrixTheme();
    }
    
    // Stop other effects
    if (typeof thorEffectsInterval !== 'undefined' && thorEffectsInterval) {
        clearInterval(thorEffectsInterval);
    }
    if (typeof matrixKanjiInterval !== 'undefined' && matrixKanjiInterval) {
        clearInterval(matrixKanjiInterval);
    }
    
    // FORCE cleanup Thor contamination too
    if (typeof cleanupThorEffects === 'function') {
        cleanupThorEffects();
    }
    
    // Force remove any lingering elements from ALL other themes
    const allOtherThemeElements = document.querySelectorAll(
        '.matrix-column-char, .matrix-white-rabbit, .matrix-red-pill, .matrix-blue-pill, .matrix-particle, .lightning-flash, .mjolnir-strike, .loki-illusion, .loki-shapeshift, .thor-particle'
    );
    allOtherThemeElements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
    });
    
    // Clear ALL effect containers
    const allContainers = ['particles', 'lightningEffects', 'thorParticles', 'asgardRunes'];
    allContainers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            container.removeAttribute('style');
        }
    });
    
    // Start warp effects (only if not mobile)
    if (!isMobileDevice) {
        initWarpSpeed();
    }
    
    // Update labels
    updateLcarsLabels();
    
}

/**
 * Update theme labels for LCARS theme
 */
function updateLcarsLabels() {
    const timezoneLabel = document.querySelector('.timezone-label');
    const weatherPanelCityLabel = document.querySelector('#weatherPanel .city-label');
    
    if (timezoneLabel) timezoneLabel.textContent = '🖖 TEMPORAL COORDINATES 🖖';
    if (weatherPanelCityLabel) weatherPanelCityLabel.textContent = '🌌 ATMOSPHERIC CONDITIONS';
}

/**
 * Initialize warp speed effect for LCARS theme
 */
function initWarpSpeed() {
    const warpContainer = document.getElementById('warpStars');
    if (!warpContainer) {
        return;
    }
    
    // Double-check: clear any existing interval first
    if (warpStarsInterval) {
        clearInterval(warpStarsInterval);
        warpStarsInterval = null;
    }
    
    // Clear existing stars completely
    warpContainer.innerHTML = '';
    
    // Create initial stars
    for (let i = 0; i < 40; i++) {
        createWarpStar();
    }
    
    // Continuously create new stars with defensive checks
    warpStarsInterval = registerInterval(setInterval(() => {
        // Check if container still exists and theme is still LCARS
        if (!document.getElementById('warpStars') || !document.body.classList.contains('lcars-theme')) {
            if (warpStarsInterval) {
                clearInterval(warpStarsInterval);
                warpStarsInterval = null;
            }
            return;
        }
        
        createWarpStar();
        
        // Clean up old stars
        const stars = warpContainer.querySelectorAll('.warp-star');
        if (stars.length > 80) {
            const oldStar = stars[0];
            if (oldStar && oldStar.parentNode) {
                oldStar.parentNode.removeChild(oldStar);
            }
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
        return;
    }
    
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
    starTrekObject.style.fontSize = '200px';
    starTrekObject.style.zIndex = '10000';
    starTrekObject.style.filter = `
        brightness(1.8) 
        drop-shadow(6px 6px 12px rgba(0, 0, 0, 0.6))
        drop-shadow(0 0 30px rgba(255, 153, 0, 0.9))
        drop-shadow(0 0 60px rgba(255, 153, 0, 0.7))
        drop-shadow(0 0 90px rgba(255, 204, 102, 0.5))
    `;
    starTrekObject.style.textShadow = '0 0 30px #ff9900, 0 0 60px #ffcc66, 0 0 90px #ff9900';
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
        if (currentX <= 0 || currentX >= vw - 200) {
            vx = -vx;
            currentX = Math.max(0, Math.min(currentX, vw - 200));
            bounces++;
        }
        
        if (currentY <= 0 || currentY >= vh - 200) {
            vy = -vy;
            currentY = Math.max(0, Math.min(currentY, vh - 200));
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
                starTrekObject.style.filter = `
                    brightness(2.0) 
                    drop-shadow(0 0 40px rgba(255, 153, 0, 0.9))
                    drop-shadow(0 0 80px rgba(255, 153, 0, 0.7))
                    blur(5px)
                `;
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
        createStarTrekFlyby(clickX, clickY);
    } else {
        createKlingonFlyby(clickX, clickY);
    }
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