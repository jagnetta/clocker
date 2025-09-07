/**
 * Thor Theme Module
 * Contains all Thor/Asgard theme related JavaScript functionality
 * Including lightning effects, sparks, runes, Mjolnir strikes, and theme switching
 */

// Thor theme global variables
let thorEffectsInterval;

/**
 * Initialize Thor theme - main entry point for activating Thor theme
 * This function can be called from external scripts to activate Thor theme
 */
function initThorTheme() {
    console.log('🔨 Initializing Thor theme...');
    
    // Ensure theme is properly set (should already be done by switchToTheme)
    currentTheme = 'thor';
    
    // Start Thor-specific effects
    if (!isMobileDevice) {
        initThorEffects();
    }
    
    // Update Thor-specific labels
    updateThorLabels();
    
    console.log('🔨 THOR THEME ACTIVATED - FOR ASGARD! 🔨');
}

/**
 * Switch to Thor theme
 * Sets up all visual elements and effects for Thor theme
 */
function switchToThorTheme() {
    // Set theme variables (assumes currentTheme is a global variable)
    if (typeof currentTheme !== 'undefined') {
        currentTheme = 'thor';
    }
    
    // Remove other theme classes
    document.body.classList.remove('lcars-theme', 'matrix-theme');
    document.body.classList.add('thor-theme');
    
    // Show/hide backgrounds (assumes these elements exist in the main page)
    const backgrounds = [
        { id: 'matrixBg', show: false },
        { id: 'lcarsBg', show: false },
        { id: 'thorBg', show: true }
    ];
    
    backgrounds.forEach(bg => {
        const element = document.getElementById(bg.id);
        if (element) {
            if (bg.show) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
            }
        }
    });
    
    // Stop other theme effects and force cleanup
    if (typeof warpStarsInterval !== 'undefined' && warpStarsInterval) {
        clearInterval(warpStarsInterval);
    }
    if (typeof matrixKanjiInterval !== 'undefined' && matrixKanjiInterval) {
        clearInterval(matrixKanjiInterval);
    }
    
    // FORCE cleanup Matrix contamination
    if (typeof cleanupMatrixTheme === 'function') {
        cleanupMatrixTheme();
    }
    if (typeof cleanupLcarsTheme === 'function') {
        cleanupLcarsTheme();
    }
    
    // Remove Matrix elements that might be lingering
    const matrixElements = document.querySelectorAll(
        '.matrix-column-char, .matrix-white-rabbit, .matrix-red-pill, .matrix-blue-pill, .warp-star, .star-trek-flyby'
    );
    matrixElements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
    });
    
    // Clear particles container
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        particlesContainer.removeAttribute('style');
    }
    
    // Clear warp stars
    const warpContainer = document.getElementById('warpStars');
    if (warpContainer) {
        warpContainer.innerHTML = '';
        warpContainer.removeAttribute('style');
    }
    
    // Start Thor effects (only if not mobile)
    if (!isMobileDevice || typeof isMobileDevice === 'undefined') {
        initThorEffects();
    }
    
    // Update theme labels (assumes this function exists globally)
    if (typeof updateThemeLabels === 'function') {
        updateThemeLabels();
    }
    
    console.log('🔨 THOR THEME ACTIVATED - FOR ASGARD! 🔨');
}

/**
 * Initialize Thor effects
 * Creates and manages lightning, sparks, and runes
 */
function initThorEffects() {
    const lightningContainer = document.getElementById('lightningEffects');
    const thorContainer = document.getElementById('thorParticles');
    const runesContainer = document.getElementById('asgardRunes');
    
    if (!lightningContainer || !thorContainer || !runesContainer) return;
    
    // Clear existing effects
    lightningContainer.innerHTML = '';
    thorContainer.innerHTML = '';
    runesContainer.innerHTML = '';
    
    // Create Asgardian runes
    const runes = ['ᚦ', 'ᚢ', 'ᚱ', 'ᚬ', 'ᛅ', 'ᛋ', 'ᚴ', 'ᚱ', 'ᛁ', 'ᛋ', 'ᚨ', 'ᛒ', 'ᚲ', 'ᛞ', 'ᛖ', 'ᚠ', 'ᚷ', 'ᚺ', 'ᛁ', 'ᛃ', 'ᚲ', 'ᛚ', 'ᛗ', 'ᚾ', 'ᛟ', 'ᛈ', 'ᚱ', 'ᛊ', 'ᛏ', 'ᚢ', 'ᚹ', 'ᛉ'];
    for (let i = 0; i < 25; i++) {
        createAsgardRune(runesContainer, runes);
    }
    
    // Periodically create effects
    thorEffectsInterval = registerInterval(setInterval(() => {
        // Lightning bolts
        if (Math.random() < 0.3) {
            createLightningBolt(lightningContainer);
        }
        
        // Thor sparks
        if (Math.random() < 0.6) {
            createThorSpark(thorContainer);
        }
        
        // Add more runes periodically
        if (Math.random() < 0.4) {
            createAsgardRune(runesContainer, runes);
        }
        
        // Clean up old effects
        const bolts = lightningContainer.querySelectorAll('.lightning-bolt');
        const sparks = thorContainer.querySelectorAll('.thor-spark');
        const currentRunes = runesContainer.querySelectorAll('.rune');
        if (bolts.length > 10) bolts[0].remove();
        if (sparks.length > 50) sparks[0].remove();
        if (currentRunes.length > 40) currentRunes[0].remove();
    }, 200));
}

/**
 * Create lightning bolt effect
 */
function createLightningBolt(container) {
    const bolt = document.createElement('div');
    bolt.className = 'lightning-bolt';
    
    const xPos = Math.random() * window.innerWidth;
    const duration = Math.random() * 0.5 + 0.3; // 0.3-0.8 seconds
    
    bolt.style.left = xPos + 'px';
    bolt.style.top = '-100px';
    bolt.style.animationDuration = duration + 's';
    
    container.appendChild(bolt);
    
    setTimeout(() => {
        if (bolt.parentNode) {
            bolt.remove();
        }
    }, duration * 1000 + 100);
}

/**
 * Create Thor spark effect
 */
function createThorSpark(container) {
    const spark = document.createElement('div');
    spark.className = 'thor-spark';
    
    const xPos = Math.random() * window.innerWidth;
    const duration = Math.random() * 6 + 4; // 4-10 seconds
    
    spark.style.left = xPos + 'px';
    spark.style.bottom = '-10px';
    spark.style.animationDuration = duration + 's';
    
    container.appendChild(spark);
    
    setTimeout(() => {
        if (spark.parentNode) {
            spark.remove();
        }
    }, duration * 1000 + 100);
}

/**
 * Create Asgardian rune with depth effects
 */
function createAsgardRune(container, runeArray) {
    const rune = document.createElement('div');
    rune.className = 'rune';
    
    const randomRune = runeArray[Math.floor(Math.random() * runeArray.length)];
    const xPos = Math.random() * window.innerWidth;
    const yPos = Math.random() * window.innerHeight;
    const delay = Math.random() * 4; // 0-4 second delay (faster)
    const rotation = Math.random() * 360; // Random rotation
    
    // Create depth layers with different visual properties
    const depthLayers = [
        { // Far background - large, very blurred, dim
            scale: 1.5 + Math.random() * 1.0,  // 1.5-2.5x size
            blur: 8 + Math.random() * 5,       // 8-13px blur
            opacity: 0.15 + Math.random() * 0.1, // 0.15-0.25 opacity
            brightness: 0.3 + Math.random() * 0.2, // 0.3-0.5 brightness
            translateZ: -200 - Math.random() * 100 // -200 to -300px depth
        },
        { // Mid background - medium, some blur
            scale: 0.8 + Math.random() * 0.8,  // 0.8-1.6x size
            blur: 3 + Math.random() * 3,       // 3-6px blur
            opacity: 0.25 + Math.random() * 0.2, // 0.25-0.45 opacity
            brightness: 0.6 + Math.random() * 0.3, // 0.6-0.9 brightness
            translateZ: -50 - Math.random() * 100 // -50 to -150px depth
        },
        { // Foreground - sharp, bright
            scale: 0.7 + Math.random() * 0.6,  // 0.7-1.3x size
            blur: 0 + Math.random() * 1,       // 0-1px blur (sharp)
            opacity: 0.4 + Math.random() * 0.3, // 0.4-0.7 opacity
            brightness: 0.8 + Math.random() * 0.4, // 0.8-1.2 brightness
            translateZ: 0 + Math.random() * 50   // 0 to +50px depth
        },
        { // Very close - small, very bright, sharp
            scale: 0.5 + Math.random() * 0.4,  // 0.5-0.9x size
            blur: 0,                           // No blur (very sharp)
            opacity: 0.6 + Math.random() * 0.3, // 0.6-0.9 opacity
            brightness: 1.0 + Math.random() * 0.5, // 1.0-1.5 brightness
            translateZ: 100 + Math.random() * 100   // +100 to +200px depth
        }
    ];
    
    // Randomly select a depth layer
    const layer = depthLayers[Math.floor(Math.random() * depthLayers.length)];
    
    rune.textContent = randomRune;
    rune.style.left = xPos + 'px';
    rune.style.top = yPos + 'px';
    rune.style.animationDelay = delay + 's';
    rune.style.transform = `rotate(${rotation}deg) scale(${layer.scale}) translateZ(${layer.translateZ}px)`;
    rune.style.filter = `blur(${layer.blur}px) brightness(${layer.brightness})`;
    rune.style.opacity = layer.opacity;
    
    // Add depth-specific class for additional styling
    if (layer.translateZ < -150) {
        rune.classList.add('rune-far');
    } else if (layer.translateZ < -50) {
        rune.classList.add('rune-mid');
    } else if (layer.translateZ > 50) {
        rune.classList.add('rune-close');
    } else {
        rune.classList.add('rune-normal');
    }
    
    container.appendChild(rune);
}

/**
 * Create lightning flash effect on click
 */
function createLightningFlash(clickX, clickY) {
    const flash = document.createElement('div');
    flash.className = 'lightning-flash';
    
    // Position lightning at click location
    flash.style.left = clickX + 'px';
    flash.style.top = '0px';
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        if (flash.parentNode) {
            flash.remove();
        }
    }, 400);
}

/**
 * Create Mjolnir strike effect
 */
function createMjolnirStrike(clickX, clickY) {
    console.log('Mjolnir answers the call...', clickX, clickY);
    
    const mjolnir = document.createElement('div');
    mjolnir.className = 'mjolnir-strike';
    mjolnir.innerHTML = '🔨';
    
    // Starting position at click location
    mjolnir.style.position = 'fixed';
    mjolnir.style.left = clickX + 'px';
    mjolnir.style.top = clickY + 'px';
    mjolnir.style.fontSize = '120px';
    mjolnir.style.zIndex = '10000';
    mjolnir.style.filter = 'brightness(1.5) drop-shadow(0 0 25px #ffd700) drop-shadow(0 0 50px #ffff00)';
    mjolnir.style.textShadow = '0 0 30px #ffd700, 0 0 60px #ffff00';
    mjolnir.style.transition = 'none';
    
    document.body.appendChild(mjolnir);
    
    // Get viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Mjolnir moves at UFO speed
    let vx = (Math.random() - 0.5) * 25;
    let vy = (Math.random() - 0.5) * 25;
    
    if (Math.abs(vx) < 10) vx = vx > 0 ? 10 : -10;
    if (Math.abs(vy) < 10) vy = vy > 0 ? 10 : -10;
    
    let currentX = clickX;
    let currentY = clickY;
    let bounces = 0;
    const maxBounces = 3; // Mjolnir returns to Thor quickly
    
    function animateMjolnir() {
        currentX += vx;
        currentY += vy;
        
        // Mjolnir bounces with thunderous force
        if (currentX <= 0 || currentX >= vw - 120) {
            vx = -vx;
            currentX = Math.max(0, Math.min(currentX, vw - 120));
            bounces++;
        }
        
        if (currentY <= 0 || currentY >= vh - 120) {
            vy = -vy;
            currentY = Math.max(0, Math.min(currentY, vh - 120));
            bounces++;
        }
        
        mjolnir.style.left = currentX + 'px';
        mjolnir.style.top = currentY + 'px';
        
        if (bounces < maxBounces) {
            requestAnimationFrame(animateMjolnir);
        } else {
            // Mjolnir returns to Thor's hand
            const exitDirection = getMjolnirReturnDirection(currentX, currentY, vw, vh);
            
            mjolnir.style.transition = 'all 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            setTimeout(() => {
                mjolnir.style.transform = `translate(${exitDirection.x}px, ${exitDirection.y}px) scale(0.3) rotate(720deg)`;
                mjolnir.style.opacity = '0';
                mjolnir.style.filter = 'brightness(1.5) drop-shadow(0 0 25px #ffd700) drop-shadow(0 0 50px #ffff00) blur(4px)';
            }, 50);
            
            setTimeout(() => {
                if (mjolnir.parentNode) {
                    mjolnir.remove();
                }
            }, 2300);
        }
    }
    
    function getMjolnirReturnDirection(x, y, vw, vh) {
        const distToLeft = x;
        const distToRight = vw - x;
        const distToTop = y;
        const distToBottom = vh - y;
        
        const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
        
        if (minDist === distToLeft) {
            return { x: -500, y: 0 }; // Return left
        } else if (minDist === distToRight) {
            return { x: 500, y: 0 }; // Return right
        } else if (minDist === distToTop) {
            return { x: 0, y: -500 }; // Return up
        } else {
            return { x: 0, y: 500 }; // Return down
        }
    }
    
    animateMjolnir();
}

/**
 * Create Loki mischief effect
 */
function createLokiTrick(clickX, clickY) {
    console.log('Loki weaves his mischief...', clickX, clickY);
    
    // Create multiple illusion effects
    const numberOfIllusions = 3 + Math.floor(Math.random() * 4); // 3-6 illusions
    
    for (let i = 0; i < numberOfIllusions; i++) {
        setTimeout(() => {
            createLokiIllusion(clickX, clickY, i);
        }, i * 200); // Stagger the illusions
    }
    
    // Create shapeshifting effect
    setTimeout(() => {
        createLokiShapeshift(clickX, clickY);
    }, 500);
}

/**
 * Create individual Loki illusion
 */
function createLokiIllusion(originX, originY, index) {
    const illusion = document.createElement('div');
    illusion.className = 'loki-illusion';
    
    // Loki's trickster symbols
    const tricksterSymbols = ['🐍', '🎭', '🃏', '👻', '🔮', '⚡', '🌪️', '🔥'];
    const symbol = tricksterSymbols[Math.floor(Math.random() * tricksterSymbols.length)];
    
    illusion.innerHTML = symbol;
    illusion.style.position = 'fixed';
    illusion.style.fontSize = '60px';
    illusion.style.zIndex = '9999';
    illusion.style.pointerEvents = 'none';
    
    // Random position near the click
    const offsetX = (Math.random() - 0.5) * 400;
    const offsetY = (Math.random() - 0.5) * 400;
    illusion.style.left = (originX + offsetX) + 'px';
    illusion.style.top = (originY + offsetY) + 'px';
    
    // Green mystical glow for Loki's magic
    illusion.style.filter = `
        brightness(1.3) 
        drop-shadow(0 0 15px #00ff88) 
        drop-shadow(0 0 30px #00cc66)
        hue-rotate(${Math.random() * 60}deg)
    `;
    illusion.style.textShadow = '0 0 20px #00ff88, 0 0 40px #00cc66';
    
    // Animation
    illusion.style.opacity = '0';
    illusion.style.transform = 'scale(0.5) rotate(0deg)';
    illusion.style.transition = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    document.body.appendChild(illusion);
    
    // Animate in
    setTimeout(() => {
        illusion.style.opacity = '0.9';
        illusion.style.transform = `scale(1.2) rotate(${360 + Math.random() * 180}deg)`;
    }, 50);
    
    // Flicker effect (Loki's trickery)
    const flickerInterval = setInterval(() => {
        illusion.style.opacity = Math.random() > 0.3 ? '0.9' : '0.3';
    }, 100);
    
    // Animate out and cleanup
    setTimeout(() => {
        clearInterval(flickerInterval);
        illusion.style.transition = 'all 0.6s ease-out';
        illusion.style.opacity = '0';
        illusion.style.transform = `scale(0.3) rotate(${720 + Math.random() * 360}deg)`;
        
        setTimeout(() => {
            if (illusion.parentNode) {
                illusion.remove();
            }
        }, 600);
    }, 1500 + Math.random() * 1000);
}

/**
 * Create Loki shapeshifting effect
 */
function createLokiShapeshift(clickX, clickY) {
    const shapeshifter = document.createElement('div');
    shapeshifter.className = 'loki-shapeshift';
    shapeshifter.style.position = 'fixed';
    shapeshifter.style.left = clickX + 'px';
    shapeshifter.style.top = clickY + 'px';
    shapeshifter.style.fontSize = '80px';
    shapeshifter.style.zIndex = '10000';
    shapeshifter.style.pointerEvents = 'none';
    
    // Loki shapeshifts through different forms
    const shapes = ['🐍', '🐺', '🦅', '🐉', '👤', '🎭'];
    let currentShape = 0;
    
    shapeshifter.innerHTML = shapes[currentShape];
    shapeshifter.style.filter = 'brightness(1.5) drop-shadow(0 0 25px #00ff88) drop-shadow(0 0 50px #00cc66)';
    shapeshifter.style.textShadow = '0 0 30px #00ff88, 0 0 60px #00cc66';
    shapeshifter.style.opacity = '0';
    shapeshifter.style.transform = 'scale(0.5)';
    shapeshifter.style.transition = 'all 0.3s ease-in-out';
    
    document.body.appendChild(shapeshifter);
    
    // Fade in
    setTimeout(() => {
        shapeshifter.style.opacity = '1';
        shapeshifter.style.transform = 'scale(1)';
    }, 50);
    
    // Shapeshift animation
    const shapeInterval = setInterval(() => {
        currentShape = (currentShape + 1) % shapes.length;
        shapeshifter.innerHTML = shapes[currentShape];
        shapeshifter.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            shapeshifter.style.transform = 'scale(1)';
        }, 150);
    }, 400);
    
    // Cleanup
    setTimeout(() => {
        clearInterval(shapeInterval);
        shapeshifter.style.transition = 'all 0.8s ease-out';
        shapeshifter.style.opacity = '0';
        shapeshifter.style.transform = 'scale(0) rotate(360deg)';
        
        setTimeout(() => {
            if (shapeshifter.parentNode) {
                shapeshifter.remove();
            }
        }, 800);
    }, 3000);
}

/**
 * Handle Thor theme click events
 * Should be called from main click handler when Thor theme is active
 */
function handleThorClick(clickX, clickY) {
    const randomValue = Math.random();
    if (randomValue < 0.25) {
        console.log('Loki causes mischief...');
        // Note: createLokiTrick function would need to be implemented or imported
        if (typeof createLokiTrick === 'function') {
            createLokiTrick(clickX, clickY);
        }
    } else if (randomValue < 0.30) {
        console.log('Mjolnir strikes...');
        createMjolnirStrike(clickX, clickY);
    } else {
        console.log('Triggering Thor lightning');
        createLightningFlash(clickX, clickY);
    }
}

/**
 * Clean up Thor effects
 * Call this when switching away from Thor theme
 */
function cleanupThorEffects() {
    console.log('🧹 Starting Thor theme cleanup...');
    
    if (thorEffectsInterval) {
        clearInterval(thorEffectsInterval);
        thorEffectsInterval = null;
    }
    
    // Clear Thor effect containers completely
    const containers = ['lightningEffects', 'thorParticles', 'asgardRunes'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            container.removeAttribute('style');
        }
    });
    
    // Remove any lingering Thor elements
    const thorElements = document.querySelectorAll(
        '.lightning-flash, .mjolnir-strike, .loki-illusion, .loki-shapeshift, .thor-particle'
    );
    thorElements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
    });
    
    // Remove Thor theme class
    document.body.classList.remove('thor-theme');
    
    // Hide Thor background
    const thorBg = document.getElementById('thorBg');
    if (thorBg) {
        thorBg.classList.add('hidden');
        thorBg.removeAttribute('style');
    }
    
    console.log('✅ Thor theme cleanup complete');
}

/**
 * Update Thor-specific labels
 * Call this when Thor theme is active and labels need updating
 */
function updateThorLabels() {
    const timezoneLabel = document.querySelector('.timezone-label');
    const cityLabel = document.querySelector('.city-label');
    
    if (timezoneLabel) timezoneLabel.textContent = '🔨 ASGARDIAN TIME CONTROL 🔨';
    if (cityLabel) cityLabel.textContent = '⚡ MIDGARD WEATHER READINGS ⚡';
}

// Export functions for module usage (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initThorTheme,
        switchToThorTheme,
        initThorEffects,
        createLightningFlash,
        createMjolnirStrike,
        handleThorClick,
        cleanupThorEffects,
        updateThorLabels
    };
}

// Make functions globally available for direct script inclusion
if (typeof window !== 'undefined') {
    window.ThorTheme = {
        initThorTheme,
        switchToThorTheme,
        initThorEffects,
        createLightningFlash,
        createMjolnirStrike,
        handleThorClick,
        cleanupThorEffects,
        updateThorLabels
    };
}