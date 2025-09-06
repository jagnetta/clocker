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
    console.log('⚡ Initializing Matrix theme...');
    
    // Ensure theme is properly set (should already be done by switchToTheme)
    currentTheme = 'matrix';
    
    // Start Matrix-specific effects
    if (!isMobileDevice) {
        initParticles();
    }
    initMatrixKanjiRotation();
    initMatrixSpecialClick();
    
    console.log('⚡ MATRIX THEME ACTIVATED ⚡');
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
    
    // Show/hide backgrounds
    const matrixBg = document.getElementById('matrixBg');
    const lcarsBg = document.getElementById('lcarsBg');
    const thorBg = document.getElementById('thorBg');
    
    if (matrixBg) matrixBg.classList.remove('hidden');
    if (lcarsBg) lcarsBg.classList.add('hidden');
    if (thorBg) thorBg.classList.add('hidden');
    
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
    
    console.log('⚡ MATRIX INTERFACE ACTIVATED ⚡');
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
    
    // Create columns across the full screen width
    const columnWidth = 60;
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
    const animationDelay = Math.random() * 5;
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

/**
 * Matrix kanji rotation
 */
function initMatrixKanjiRotation() {
    if (matrixKanjiInterval) {
        clearInterval(matrixKanjiInterval);
    }
    
    const matrixKanji = [
        '時', '空', '夢', '魂', '心', '光', '影', '真', '偽', '現', '幻', '始', '終',
        '道', '力', '愛', '死', '生', '運', '選', '自', '由', '束', '縛', '解', '放',
        '知', '無', '有', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
        '百', '千', '万', '億', '兆'
    ];
    
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
 * Create white rabbit effect on click
 */
function createWhiteRabbit(clickX, clickY) {
    const rabbit = document.createElement('div');
    rabbit.innerHTML = '🐰';
    rabbit.style.position = 'fixed';
    rabbit.style.left = clickX + 'px';
    rabbit.style.top = clickY + 'px';
    rabbit.style.fontSize = '24px';
    rabbit.style.zIndex = '10000';
    rabbit.style.pointerEvents = 'none';
    rabbit.style.animation = 'fadeInOut 2s ease-out forwards';
    
    document.body.appendChild(rabbit);
    
    setTimeout(() => {
        if (rabbit.parentNode) {
            rabbit.parentNode.removeChild(rabbit);
        }
    }, 2000);
}

/**
 * Handle Matrix theme click events
 */
function handleMatrixClick(clickX, clickY) {
    console.log('Matrix click detected - creating white rabbit');
    createWhiteRabbit(clickX, clickY);
}

/**
 * Clean up Matrix effects
 */
function cleanupMatrixTheme() {
    if (matrixKanjiInterval) {
        clearInterval(matrixKanjiInterval);
        matrixKanjiInterval = null;
    }
    
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
    }
    
    matrixParticles = [];
    
    console.log('🔌 Matrix theme cleaned up');
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