/**
 * Matrix Theme Module
 * Contains all Matrix-specific functionality
 * The default theme with green terminal aesthetics and Matrix rain effects
 */

// Matrix theme variables
let matrixKanjiInterval;
let matrixParticles = [];

/**
 * Initialize and activate the Matrix theme
 * This is the main entry point for the Matrix theme
 */
function initMatrixTheme() {
    
    // Ensure theme is properly set (should already be done by switchToTheme)
    currentTheme = 'matrix';
    
    // Start Matrix-specific effects
    if (!isMobileDevice) {
        initMatrixParticles();
    }
    initMatrixKanjiRotation();
    initMatrixSpecialClick();
    
    // Update labels to Matrix theme
    updateMatrixLabels();
    
}

/**
 * Switch to Matrix theme and initialize all effects
 */
function switchToMatrixTheme() {
    // Set theme
    if (typeof currentTheme !== 'undefined') {
        currentTheme = 'matrix';
    }
    
    // Remove other theme classes
    document.body.classList.remove('lcars-theme', 'thor-theme');
    document.body.classList.add('matrix-theme');
    
    // Show/hide backgrounds with complete reset
    const matrixBg = document.getElementById('matrixBg');
    const lcarsBg = document.getElementById('lcarsBg');
    const thorBg = document.getElementById('thorBg');
    
    // Force hide other backgrounds and reset their styles
    if (lcarsBg) {
        lcarsBg.classList.add('hidden');
        lcarsBg.removeAttribute('style');
    }
    if (thorBg) {
        thorBg.classList.add('hidden');
        thorBg.removeAttribute('style');
    }
    
    // Show Matrix background cleanly
    if (matrixBg) {
        matrixBg.removeAttribute('style');
        matrixBg.classList.remove('hidden');
        matrixBg.offsetHeight; // Force reflow
    }
    
    // Stop other effects - check if cleanup functions exist
    if (typeof cleanupLcarsTheme === 'function') {
        cleanupLcarsTheme();
    }
    if (typeof cleanupThorEffects === 'function') {
        cleanupThorEffects();
    }
    
    // Start Matrix effects (only if not mobile)
    if (typeof isMobileDevice === 'undefined' || !isMobileDevice) {
        initMatrixParticles();
    }
    initMatrixKanjiRotation();
    
    // Update labels
    updateMatrixLabels();
    
}

/**
 * Update theme labels for Matrix theme
 */
function updateMatrixLabels() {
    const timezoneLabel = document.querySelector('.timezone-label');
    const cityLabel = document.querySelector('.city-label');
    
    if (timezoneLabel) timezoneLabel.textContent = '⚡ TEMPORAL ZONE CONTROL ⚡';
    if (cityLabel) cityLabel.textContent = '🌐 WEATHER DATA INTERFACE';
}

/**
 * Initialize Matrix-style flowing columns
 */
function initMatrixParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    matrixParticles = [];
    
    const matrixChars = [
        '0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 
        'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 
        'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'マ', 'ミ', 'ム', 'メ', 
        'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン',
        '日', '月', '火', '水', '木', '金', '土', '人', '大', '小', '中', '国',
        '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千',
        '万', '円', '時', '分', '年', '間', '今', '後', '前', '新', '古', '高',
        '低', '上', '下', '左', '右', '東', '西', '南', '北'
    ];
    
    // Create columns across the full screen width (10% fewer columns)
    const columnWidth = 67; // Increased from 60 to reduce columns by ~10%
    const numColumns = Math.floor(window.innerWidth / columnWidth);
    
    for (let col = 0; col < numColumns; col++) {
        createMatrixColumn(col, columnWidth, matrixChars, particlesContainer);
    }
}

/**
 * Create a single Matrix column
 */
function createMatrixColumn(columnIndex, columnWidth, matrixChars, container) {
    const columnLength = 5 + Math.floor(Math.random() * 45);
    const columnX = columnIndex * columnWidth;
    const animationDelay = Math.random() * 0.1; // Start within 100ms, most immediately
    const fallSpeed = 8 + Math.random() * 12;
    
    const blurLevels = [2.0, 3.5, 5.5, 7.5, 10.0];
    const fontSizes = [22, 18, 15, 12, 9];
    const blurIndex = Math.floor(Math.random() * blurLevels.length);
    const columnBlur = blurLevels[blurIndex];
    const columnFontSize = fontSizes[blurIndex];
    
    for (let i = 0; i < columnLength; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-column-char';
        char.style.left = columnX + 'px';
        char.style.top = (-30 - (i * 25)) + 'px';
        char.style.animationDelay = animationDelay + 's';
        char.style.animationDuration = fallSpeed + 's';
        char.style.opacity = Math.max(0.1, 1 - (i * 0.05));
        
        char.style.filter = `blur(${columnBlur}px)`;
        char.style.fontSize = columnFontSize + 'px';
        
        const rotations = [0, 90, 180, 270];
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        char.style.setProperty('--char-rotation', `rotate(${randomRotation}deg)`);
        
        const randomChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        char.textContent = randomChar;
        
        container.appendChild(char);
        matrixParticles.push(char);
        
        registerEventListener(char, 'animationend', () => {
            restartMatrixColumn(char, columnIndex, columnWidth, matrixChars, container, columnLength);
        });
    }
}

/**
 * Restart Matrix column when animation ends
 */
function restartMatrixColumn(triggerChar, columnIndex, columnWidth, matrixChars, container, originalLength) {
    const existingChars = container.querySelectorAll('.matrix-column-char');
    existingChars.forEach(char => {
        if (parseInt(char.style.left) === columnIndex * columnWidth) {
            const index = matrixParticles.indexOf(char);
            if (index > -1) {
                matrixParticles.splice(index, 1);
            }
            char.remove();
        }
    });
    
    createMatrixColumn(columnIndex, columnWidth, matrixChars, container);
}

// Matrix kanji variables
let matrixClockKanjiInterval;

/**
 * Matrix kanji rotation
 */
function initMatrixKanjiRotation() {
    if (matrixKanjiInterval) {
        clearInterval(matrixKanjiInterval);
    }
    if (matrixClockKanjiInterval) {
        clearInterval(matrixClockKanjiInterval);
    }
    
    const matrixKanji = [
        '時', '空', '夢', '魂', '心', '光', '影', '真', '偽', '現', '幻', '始', '終',
        '道', '力', '愛', '死', '生', '運', '選', '自', '由', '束', '縛', '解', '放',
        '知', '無', '有', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
        '百', '千', '万', '億', '兆'
    ];
    
    // Set up clock display kanji cycling (changes kanji every 3 seconds to match CSS animation)
    let clockKanjiIndex = 0;
    const updateClockKanji = () => {
        const randomKanji = matrixKanji[Math.floor(Math.random() * matrixKanji.length)];
        document.documentElement.style.setProperty('--matrix-kanji', `"${randomKanji}"`);
    };
    
    // Initialize with first kanji
    updateClockKanji();
    
    // Change clock kanji every 3 seconds (matches CSS animation duration)
    matrixClockKanjiInterval = registerInterval(setInterval(updateClockKanji, 3000));
    
    // Matrix column kanji rotation (for falling rain effect)
    matrixKanjiInterval = registerInterval(setInterval(() => {
        const kanjiElements = document.querySelectorAll('.matrix-column-char');
        kanjiElements.forEach(char => {
            if (Math.random() < 0.3) {
                const randomKanji = matrixKanji[Math.floor(Math.random() * matrixKanji.length)];
                char.textContent = randomKanji;
            }
        });
    }, 3000));
}

/**
 * Create massive white rabbit effect on click (as large as Trogdor!)
 */
function createWhiteRabbit(clickX, clickY) {
    const rabbit = document.createElement('div');
    rabbit.className = 'matrix-white-rabbit';
    rabbit.innerHTML = '🐰';
    rabbit.style.position = 'fixed';
    rabbit.style.left = clickX + 'px';
    rabbit.style.top = clickY + 'px';
    rabbit.style.fontSize = '200px'; // Same size as Trogdor!
    rabbit.style.zIndex = '10000';
    rabbit.style.pointerEvents = 'none';
    rabbit.style.opacity = '0';
    rabbit.style.transform = 'scale(0.3)';
    rabbit.style.filter = `
        drop-shadow(6px 6px 12px rgba(0, 0, 0, 0.6))
        drop-shadow(0 0 30px rgba(255, 255, 255, 0.9))
        drop-shadow(0 0 60px rgba(0, 255, 0, 0.7))
        drop-shadow(0 0 90px rgba(255, 255, 255, 0.5))
    `;
    rabbit.style.animation = 'matrixRabbitMassive 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    
    document.body.appendChild(rabbit);
    
    // Move rabbit across screen like Trogdor
    const endX = Math.random() * (window.innerWidth - 300);
    const endY = Math.random() * (window.innerHeight - 250);
    
    setTimeout(() => {
        rabbit.style.left = endX + 'px';
        rabbit.style.top = endY + 'px';
        rabbit.style.transition = 'left 4s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 100);
    
    setTimeout(() => {
        if (rabbit.parentNode) {
            rabbit.parentNode.removeChild(rabbit);
        }
    }, 4000);
}

/**
 * Initialize Matrix special click events
 */
function initMatrixSpecialClick() {
    // Matrix click events are handled by the global click system
    // This function exists to maintain consistency with the init pattern
}

/**
 * Create red and blue pill animation that spirals toward user
 */
function createMatrixPills(clickX, clickY) {
    // Create both pills
    const redPill = createPill(clickX - 30, clickY, '#ff0000', 'matrix-red-pill');
    const bluePill = createPill(clickX + 30, clickY, '#0066ff', 'matrix-blue-pill');
    
    setTimeout(() => {
        // Both pills move straight toward user from their click positions
        animatePillStraight(redPill);
        animatePillStraight(bluePill);
    }, 100);
    
    // Remove pills after animation
    setTimeout(() => {
        if (redPill.parentNode) redPill.remove();
        if (bluePill.parentNode) bluePill.remove();
    }, 6500);
}

/**
 * Create individual pill element
 */
function createPill(x, y, color, className) {
    const pill = document.createElement('div');
    pill.className = className;
    pill.style.position = 'fixed';
    pill.style.left = x + 'px';
    pill.style.top = y + 'px';
    pill.style.width = '15px';
    pill.style.height = '30px';
    pill.style.backgroundColor = color;
    pill.style.borderRadius = '15px';
    pill.style.pointerEvents = 'none';
    pill.style.zIndex = '10000';
    pill.style.opacity = '1';
    pill.style.transform = 'scale(0.3)';
    pill.style.transformStyle = 'preserve-3d';
    pill.style.filter = `
        drop-shadow(0 0 20px rgba(0, 255, 0, 0.8))
        drop-shadow(0 0 40px rgba(0, 200, 0, 0.6))
    `;
    
    // Add 3D tubular effect with gradients and shadows
    pill.style.background = `
        linear-gradient(90deg, 
            ${color} 0%, 
            ${lightenColor(color, 40)} 50%, 
            ${color} 100%
        )
    `;
    pill.style.boxShadow = `
        inset -3px 0 6px rgba(0, 0, 0, 0.3),
        inset 3px 0 6px rgba(255, 255, 255, 0.2),
        0 0 10px ${color}
    `;
    
    document.body.appendChild(pill);
    return pill;
}

/**
 * Lighten a hex color by a percentage
 */
function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

/**
 * Animate pill straight toward user (growing, spinning, twisting)
 */
function animatePillStraight(pill) {
    const duration = 6000; // Extended from 4s to 6s
    const startTime = Date.now();
    
    // Slower, more graceful rotation speeds
    const spinSpeed = 0.5 + Math.random() * 1; // 0.5-1.5 rotations per second
    const twistSpeed = 0.3 + Math.random() * 0.7; // 0.3-1 twists per second
    const revolveSpeed = 0.2 + Math.random() * 0.5; // 0.2-0.7 revolutions per second
    
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Scale - start small (0.3) and grow much larger toward user (3.0)
        const scale = 0.3 + (progress * 2.7); // Grow from 30% to 300% size
        
        // Opacity - stay solid (1.0) for 80% of duration, then fade quickly in last 20%
        let opacity = 1.0;
        if (progress > 0.8) {
            const fadeProgress = (progress - 0.8) / 0.2; // 0 to 1 in last 20%
            opacity = 1 - (fadeProgress * 0.95); // Fade to 5% opacity
        }
        
        // Multiple rotation effects
        const timeInSeconds = elapsed / 1000;
        const spinRotation = (timeInSeconds * spinSpeed * 360) % 360; // Spin around Z-axis
        const twistRotation = (timeInSeconds * twistSpeed * 360) % 360; // Twist around X-axis
        const revolveRotation = (timeInSeconds * revolveSpeed * 360) % 360; // Revolve around Y-axis
        
        // Apply complex 3D transformation
        pill.style.transform = `
            scale(${scale}) 
            rotateZ(${spinRotation}deg) 
            rotateX(${twistRotation}deg) 
            rotateY(${revolveRotation}deg)
        `;
        pill.style.opacity = opacity;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };
    
    requestAnimationFrame(animate);
}

/**
 * Handle Matrix theme click events
 */
function handleMatrixClick(clickX, clickY) {
    const randomValue = Math.random();
    if (randomValue < 0.10) {
        createWhiteRabbit(clickX, clickY);
    } else {
        createMatrixPills(clickX, clickY);
    }
}

/**
 * Clean up Matrix effects completely
 */
function cleanupMatrixTheme() {
    
    // Clear ALL Matrix intervals
    if (matrixKanjiInterval) {
        clearInterval(matrixKanjiInterval);
        matrixKanjiInterval = null;
    }
    
    // Clear clock kanji interval
    if (matrixClockKanjiInterval) {
        clearInterval(matrixClockKanjiInterval);
        matrixClockKanjiInterval = null;
    }
    
    // Clear any Matrix particle creation loops
    if (typeof matrixParticleInterval !== 'undefined' && matrixParticleInterval) {
        clearInterval(matrixParticleInterval);
        matrixParticleInterval = null;
    }
    
    // FORCE stop all Matrix animations first
    const allMatrixElements = document.querySelectorAll('.matrix-column-char, .matrix-white-rabbit, .matrix-red-pill, .matrix-blue-pill');
    allMatrixElements.forEach(el => {
        if (el.style) {
            el.style.animation = 'none';
            el.style.animationPlayState = 'paused';
        }
    });
    
    // Clear particles container completely
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        // Force stop container animations
        particlesContainer.style.animation = 'none';
        particlesContainer.style.animationPlayState = 'paused';
        // Remove all children
        particlesContainer.innerHTML = '';
        // Remove any inline styles that might persist
        particlesContainer.removeAttribute('style');
        // Force reflow
        particlesContainer.offsetHeight;
    }
    
    // Clear particles array
    matrixParticles = [];
    
    // Force cleanup any animations on the clock display that might be moving
    const clockDisplay = document.querySelector('.clock-display');
    if (clockDisplay) {
        clockDisplay.style.animation = 'none';
        clockDisplay.style.transform = '';
        clockDisplay.style.transition = 'none';
        clockDisplay.offsetHeight; // Force reflow
        clockDisplay.style.transition = '';
    }
    
    // Remove any lingering Matrix elements more comprehensively
    const matrixElements = document.querySelectorAll(
        '.matrix-column-char, .matrix-white-rabbit, .matrix-red-pill, .matrix-blue-pill, .matrix-particle, .floating-particles > *'
    );
    matrixElements.forEach(el => {
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
    
    // Clear any matrix-specific DOM modifications
    const floatingParticles = document.querySelector('.floating-particles');
    if (floatingParticles) {
        floatingParticles.innerHTML = '';
        floatingParticles.removeAttribute('style');
    }
    
    // Remove Matrix-specific body classes and any lingering matrix styles
    document.body.classList.remove('matrix-theme');
    
    // Remove any matrix-specific inline styles from body
    const bodyStyle = document.body.style;
    if (bodyStyle.background && bodyStyle.background.includes('rgba(0, 40, 0')) {
        document.body.removeAttribute('style');
    }
    
    
    // Remove Matrix theme class completely
    document.body.classList.remove('matrix-theme');
    
    // Hide Matrix background
    const matrixBg = document.getElementById('matrixBg');
    if (matrixBg) {
        matrixBg.classList.add('hidden');
        // Remove any inline styles from the background
        matrixBg.removeAttribute('style');
        // Force stop any background animations
        matrixBg.style.animation = 'none';
        matrixBg.offsetHeight; // Force reflow
        matrixBg.style.animation = '';
    }
    
    // Reset kanji CSS custom property
    document.documentElement.style.removeProperty('--matrix-kanji');
    
    // Force cleanup of any matrix-themed elements that might affect other themes
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        if (el.style && el.style.color === 'rgb(0, 255, 0)' && !el.closest('.clock-display, .weather-panel')) {
            el.style.color = '';
        }
        if (el.style && el.style.textShadow && el.style.textShadow.includes('0 0 8px #00ff00')) {
            el.style.textShadow = '';
        }
    });
    
}

// Export functions for module usage
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        initMatrixTheme,
        switchToMatrixTheme,
        handleMatrixClick,
        cleanupMatrixTheme,
        updateMatrixLabels
    };
} else if (typeof window !== 'undefined') {
    // Browser environment - attach to window object
    window.MatrixTheme = {
        initMatrixTheme,
        switchToMatrixTheme,
        handleMatrixClick,
        cleanupMatrixTheme,
        updateMatrixLabels
    };
}