// Global variables
let currentTimezoneOffset = 0;
let particles = [];
let currentTheme = 'matrix';
let warpStarsInterval;
let thorEffectsInterval;
let matrixKanjiInterval;

// Comprehensive timezone data with DST rules
const timezones = {
    '-12': { name: 'BIT', label: 'Baker Island Time', dst: false },
    '-11': { name: 'NUT', label: 'Niue Time', dst: false },
    '-10': { name: 'HST', label: 'Hawaii Standard Time', dst: false },
    '-9.5': { name: 'MART', label: 'Marquesas Time', dst: false },
    '-9': { name: 'AKST', label: 'Alaska Standard Time', dst: true, dstName: 'AKDT', dstOffset: -8 },
    '-8': { name: 'PST', label: 'Pacific Standard Time', dst: true, dstName: 'PDT', dstOffset: -7 },
    '-7': { name: 'MST', label: 'Mountain Standard Time', dst: true, dstName: 'MDT', dstOffset: -6 },
    '-6': { name: 'CST', label: 'Central Standard Time', dst: true, dstName: 'CDT', dstOffset: -5 },
    '-5': { name: 'EST', label: 'Eastern Standard Time', dst: true, dstName: 'EDT', dstOffset: -4 },
    '-4': { name: 'AST', label: 'Atlantic Standard Time', dst: true, dstName: 'ADT', dstOffset: -3 },
    '-3.5': { name: 'NST', label: 'Newfoundland Standard Time', dst: true, dstName: 'NDT', dstOffset: -2.5 },
    '-3': { name: 'BRT', label: 'Brazil Time', dst: false },
    '-2': { name: 'GST', label: 'South Georgia Time', dst: false },
    '-1': { name: 'CVT', label: 'Cape Verde Time', dst: false },
    '0': { name: 'GMT', label: 'Greenwich Mean Time', dst: true, dstName: 'BST', dstOffset: 1 },
    '1': { name: 'CET', label: 'Central European Time', dst: true, dstName: 'CEST', dstOffset: 2 },
    '2': { name: 'EET', label: 'Eastern European Time', dst: true, dstName: 'EEST', dstOffset: 3 },
    '3': { name: 'MSK', label: 'Moscow Standard Time', dst: false },
    '3.5': { name: 'IRST', label: 'Iran Standard Time', dst: true, dstName: 'IRDT', dstOffset: 4.5 },
    '4': { name: 'GST', label: 'Gulf Standard Time', dst: false },
    '4.5': { name: 'AFT', label: 'Afghanistan Time', dst: false },
    '5': { name: 'PKT', label: 'Pakistan Standard Time', dst: false },
    '5.5': { name: 'IST', label: 'India Standard Time', dst: false },
    '5.75': { name: 'NPT', label: 'Nepal Time', dst: false },
    '6': { name: 'BST', label: 'Bangladesh Standard Time', dst: false },
    '6.5': { name: 'MMT', label: 'Myanmar Time', dst: false },
    '7': { name: 'ICT', label: 'Indochina Time', dst: false },
    '8': { name: 'CST', label: 'China Standard Time', dst: false },
    '8.75': { name: 'CWST', label: 'Central Western Standard Time', dst: false },
    '9': { name: 'JST', label: 'Japan Standard Time', dst: false },
    '9.5': { name: 'ACST', label: 'Australian Central Standard Time', dst: true, dstName: 'ACDT', dstOffset: 10.5 },
    '10': { name: 'AEST', label: 'Australian Eastern Standard Time', dst: true, dstName: 'AEDT', dstOffset: 11 },
    '10.5': { name: 'LHST', label: 'Lord Howe Standard Time', dst: true, dstName: 'LHDT', dstOffset: 11 },
    '11': { name: 'SBT', label: 'Solomon Islands Time', dst: false },
    '12': { name: 'NZST', label: 'New Zealand Standard Time', dst: true, dstName: 'NZDT', dstOffset: 13 },
    '12.75': { name: 'CHAST', label: 'Chatham Standard Time', dst: true, dstName: 'CHADT', dstOffset: 13.75 },
    '13': { name: 'TOT', label: 'Tonga Time', dst: false },
    '14': { name: 'LINT', label: 'Line Islands Time', dst: false }
};

// DST calculation functions
function isDSTActive(date, offset) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Northern Hemisphere DST (March-November)
    if (offset >= -9 && offset <= 3) {
        // Second Sunday in March to First Sunday in November (US/Canada/Europe style)
        const marchSecondSunday = getNthSundayOfMonth(year, 2, 2); // March = 2
        const novemberFirstSunday = getNthSundayOfMonth(year, 10, 1); // November = 10
        
        if (offset >= -9 && offset <= -4) {
            // US/Canada DST rules
            return date >= marchSecondSunday && date < novemberFirstSunday;
        } else if (offset >= 0 && offset <= 3) {
            // European DST rules (last Sunday in March to last Sunday in October)
            const marchLastSunday = getLastSundayOfMonth(year, 2);
            const octoberLastSunday = getLastSundayOfMonth(year, 9);
            return date >= marchLastSunday && date < octoberLastSunday;
        }
    }
    
    // Southern Hemisphere DST (October-March)
    if (offset >= 9.5 && offset <= 13) {
        // First Sunday in October to First Sunday in April (Australia/NZ style)
        const octoberFirstSunday = getNthSundayOfMonth(year, 9, 1); // October = 9
        const aprilFirstSunday = getNthSundayOfMonth(year, 3, 1); // April = 3
        
        // Handle year transition
        if (month >= 9) { // Oct, Nov, Dec
            return date >= octoberFirstSunday;
        } else if (month <= 3) { // Jan, Feb, Mar, Apr
            return date < aprilFirstSunday;
        }
        return false;
    }
    
    // Iran DST (March 22 to September 22 approximately)
    if (offset === 3.5) {
        return month >= 2 && month <= 8; // Simplified: March to September
    }
    
    return false;
}

function getNthSundayOfMonth(year, month, n) {
    const firstDay = new Date(year, month, 1);
    const firstSunday = new Date(year, month, 1 + (7 - firstDay.getDay()) % 7);
    return new Date(year, month, firstSunday.getDate() + (n - 1) * 7);
}

function getLastSundayOfMonth(year, month) {
    const lastDay = new Date(year, month + 1, 0);
    const lastSunday = new Date(year, month, lastDay.getDate() - lastDay.getDay());
    return lastSunday;
}

// Initialize Matrix-style flowing columns
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const matrixChars = ['0', '1', 'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ', 'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ', 'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ', 'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン', '日', '月', '火', '水', '木', '金', '土', '人', '大', '小', '中', '国', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '円', '時', '分', '年', '間', '今', '後', '前', '新', '古', '高', '低', '上', '下', '左', '右', '東', '西', '南', '北'];
    
    // Create columns across the full screen width
    const columnWidth = 60; // pixels - increased for fewer streaming lines
    const numColumns = Math.floor(window.innerWidth / columnWidth);
    
    for (let col = 0; col < numColumns; col++) {
        createMatrixColumn(col, columnWidth, matrixChars, particlesContainer);
    }
}

function createMatrixColumn(columnIndex, columnWidth, matrixChars, container) {
    const columnLength = 5 + Math.floor(Math.random() * 45); // Random length 5-50 characters
    const columnX = columnIndex * columnWidth;
    const animationDelay = Math.random() * 5; // Stagger start times
    const fallSpeed = 4 + Math.random() * 6; // Random speed 4-10 seconds
    
    // Assign random blur and size for this entire column
    const blurLevels = [0.5, 1.2, 2.0, 2.8, 3.5]; // Different blur intensities
    const fontSizes = [20, 18, 16, 14, 12]; // Corresponding font sizes (larger = less blur)
    const blurIndex = Math.floor(Math.random() * blurLevels.length);
    const columnBlur = blurLevels[blurIndex];
    const columnFontSize = fontSizes[blurIndex];
    
    for (let i = 0; i < columnLength; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-column-char';
        char.style.left = columnX + 'px';
        char.style.top = (-30 - (i * 25)) + 'px'; // Stack characters above screen
        char.style.animationDelay = animationDelay + 's';
        char.style.animationDuration = fallSpeed + 's';
        char.style.opacity = Math.max(0.1, 1 - (i * 0.05)); // Fade out towards tail
        
        // Apply column-specific blur and font size
        char.style.filter = `blur(${columnBlur}px)`;
        char.style.fontSize = columnFontSize + 'px';
        
        // Add random rotation
        const rotations = [0, 90, 180, 270];
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        char.style.setProperty('--char-rotation', `rotate(${randomRotation}deg)`);
        
        // Set random character
        const randomChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        char.textContent = randomChar;
        
        container.appendChild(char);
        
        // Restart column when animation ends
        char.addEventListener('animationend', () => {
            restartMatrixColumn(char, columnIndex, columnWidth, matrixChars, container, columnLength);
        });
    }
}

function restartMatrixColumn(triggerChar, columnIndex, columnWidth, matrixChars, container, originalLength) {
    // Remove all characters from this column
    const existingChars = container.querySelectorAll('.matrix-column-char');
    existingChars.forEach(char => {
        if (parseInt(char.style.left) === columnIndex * columnWidth) {
            char.remove();
        }
    });
    
    // Create new column with random length
    createMatrixColumn(columnIndex, columnWidth, matrixChars, container);
}

// Enhanced ordinal suffix function
function getOrdinalSuffix(day) {
    const dayNum = parseInt(day);
    if (dayNum >= 11 && dayNum <= 13) {
        return dayNum + 'th';
    }
    switch (dayNum % 10) {
        case 1: return dayNum + 'st';
        case 2: return dayNum + 'nd';
        case 3: return dayNum + 'rd';
        default: return dayNum + 'th';
    }
}

// Enhanced date formatting
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();
    
    return {
        day: dayName,
        date: `${monthName} ${getOrdinalSuffix(dayNum)}, ${year}`
    };
}

// Enhanced time formatting with timezone and DST
function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    
    // Get timezone info with DST consideration
    const timezoneInfo = getTimezoneInfo(date, currentTimezoneOffset);
    
    return `${hours}:${minutesStr}:${secondsStr} <span class="time-suffix">${ampm}</span> <span class="time-suffix">${timezoneInfo.name}</span>`;
}

// Get current timezone info with DST consideration
function getTimezoneInfo(date, offset) {
    const timezoneInfo = timezones[offset.toString()];
    if (!timezoneInfo) {
        return { name: 'UTC', label: 'Coordinated Universal Time', isDST: false };
    }
    
    if (timezoneInfo.dst && isDSTActive(date, offset)) {
        return {
            name: timezoneInfo.dstName,
            label: timezoneInfo.label.replace('Standard', 'Daylight'),
            isDST: true,
            offset: timezoneInfo.dstOffset
        };
    }
    
    return {
        name: timezoneInfo.name,
        label: timezoneInfo.label,
        isDST: false,
        offset: offset
    };
}

// Get date with timezone offset including DST
function getTimezoneDate() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    
    // First get the date with standard offset to check DST
    const standardDate = new Date(utc + (currentTimezoneOffset * 3600000));
    const timezoneInfo = getTimezoneInfo(standardDate, currentTimezoneOffset);
    
    // If DST is active, use the DST offset instead
    const actualOffset = timezoneInfo.isDST ? timezoneInfo.offset : currentTimezoneOffset;
    
    return new Date(utc + (actualOffset * 3600000));
}

// Update timezone display with DST consideration
function updateTimezoneDisplay() {
    const display = document.getElementById('timezoneDisplay');
    const now = getTimezoneDate();
    const timezoneInfo = getTimezoneInfo(now, currentTimezoneOffset);
    
    // Show current effective offset (including DST)
    const effectiveOffset = timezoneInfo.isDST ? timezoneInfo.offset : currentTimezoneOffset;
    
    let offsetStr;
    if (effectiveOffset === 0) {
        offsetStr = 'UTC±0';
    } else if (effectiveOffset > 0) {
        offsetStr = `UTC+${effectiveOffset}`;
    } else {
        offsetStr = `UTC${effectiveOffset}`;
    }
    
    // Add DST indicator
    const dstIndicator = timezoneInfo.isDST ? ' 🌞 DST' : '';
    
    // Check if this is the browser's detected timezone
    const browserTZ = getBrowserTimezoneName();
    const browserOffset = detectBrowserTimezone();
    const isLocalTime = Math.abs(currentTimezoneOffset - browserOffset) < 0.1;
    const localIndicator = isLocalTime ? ' 🏠 LOCAL' : '';
    
    display.textContent = `${offsetStr} (${timezoneInfo.name}) - ${timezoneInfo.label}${dstIndicator}${localIndicator}`;
}

// Main clock update function
function updateClock() {
    const now = getTimezoneDate();
    const formatted = formatDate(now);
    const timeStr = formatTime(now);
    
    const dayElement = document.getElementById('day');
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    
    // Update content
    dayElement.textContent = formatted.day;
    dayElement.setAttribute('data-text', formatted.day);
    dateElement.textContent = formatted.date;
    timeElement.innerHTML = timeStr;
}

// Enhanced font sizing with better calculations
function adjustFontSizes() {
    const dayEl = document.getElementById('day');
    const dateEl = document.getElementById('date');
    const timeEl = document.getElementById('time');
    const clockDisplay = document.querySelector('.clock-display');
    
    if (!dayEl || !dateEl || !timeEl || !clockDisplay) return;
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get text content - for time, account for HTML spans
    const dayText = dayEl.textContent;
    const dateText = dateEl.textContent;
    const timeText = timeEl.textContent; // This includes AM/PM and timezone
    
    // Enhanced font sizing - scale to fit viewport while ensuring readability
    // Use viewport-based scaling with text length consideration
    const baseScale = Math.min(viewportWidth, viewportHeight) / 800; // Base scale factor
    
    const daySize = Math.min(
        viewportWidth * 0.12 / (dayText.length * 0.1), 
        viewportHeight * 0.12,
        baseScale * 80
    );
    const dateSize = Math.min(
        viewportWidth * 0.08 / (dateText.length * 0.08), 
        viewportHeight * 0.08,
        baseScale * 50
    );
    // For time, scale more conservatively to fit in 75vw panel
    const availablePanelWidth = viewportWidth * 0.75 - 120; // Account for padding
    const timeSize = Math.min(
        availablePanelWidth / (timeText.length * 0.45), // Scale based on available panel width
        viewportHeight * 0.1,
        baseScale * 60
    );
    
    // Apply font sizes with proper minimums
    dayEl.style.fontSize = Math.max(daySize, 20) + 'px';
    dateEl.style.fontSize = Math.max(dateSize, 16) + 'px';
    timeEl.style.fontSize = Math.max(timeSize, 18) + 'px';
    
    // Set time-suffix font size to match date line
    const timeSuffixSize = Math.max(dateSize, 16);
    const timeSuffixElements = document.querySelectorAll('.time-suffix');
    timeSuffixElements.forEach(el => {
        el.style.fontSize = timeSuffixSize + 'px';
    });
}

// Detect browser's timezone automatically
function detectBrowserTimezone() {
    try {
        // Use modern Intl.DateTimeFormat API for accurate timezone detection
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log(`🌍 Detected timezone: ${timezone}`);
        
        // Get current date to check DST status
        const now = new Date();
        
        // Calculate the actual current offset (including DST)
        const currentOffset = -now.getTimezoneOffset() / 60;
        
        // Create a date in January (winter) and July (summer) to detect DST capability
        const janDate = new Date(now.getFullYear(), 0, 15); // January 15
        const julDate = new Date(now.getFullYear(), 6, 15); // July 15
        
        const janOffset = -janDate.getTimezoneOffset() / 60;
        const julOffset = -julDate.getTimezoneOffset() / 60;
        
        // Determine if this timezone uses DST
        const usesDST = janOffset !== julOffset;
        const standardOffset = Math.min(janOffset, julOffset); // Standard time is the smaller offset (more negative)
        
        console.log(`📅 Current offset: UTC${currentOffset >= 0 ? '+' : ''}${currentOffset}`);
        console.log(`❄️ Winter offset: UTC${janOffset >= 0 ? '+' : ''}${janOffset}`);
        console.log(`☀️ Summer offset: UTC${julOffset >= 0 ? '+' : ''}${julOffset}`);
        console.log(`🔄 Uses DST: ${usesDST ? 'Yes' : 'No'}`);
        
        // Find the best matching timezone in our data
        let bestMatch = 0;
        let bestScore = -1;
        
        for (const offset in timezones) {
            const numOffset = parseFloat(offset);
            const tzInfo = timezones[offset];
            let score = 0;
            
            // Primary match: standard offset matches
            if (Math.abs(numOffset - standardOffset) < 0.1) {
                score += 100;
            }
            
            // Secondary match: DST capability matches
            if (tzInfo.dst === usesDST) {
                score += 50;
            }
            
            // Tertiary match: current offset matches (considering DST)
            if (usesDST && tzInfo.dst && tzInfo.dstOffset) {
                if (Math.abs(tzInfo.dstOffset - currentOffset) < 0.1) {
                    score += 75;
                }
            } else if (!usesDST || !tzInfo.dst) {
                if (Math.abs(numOffset - currentOffset) < 0.1) {
                    score += 75;
                }
            }
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = numOffset;
            }
        }
        
        console.log(`🎯 Best match: UTC${bestMatch >= 0 ? '+' : ''}${bestMatch} (score: ${bestScore})`);
        console.log(`🕒 For EDT users: Detected offset should be -5 (EST standard) with current showing -4 (EDT active)`);
        return bestMatch;
        
    } catch (error) {
        console.warn('⚠️ Timezone detection failed, falling back to offset calculation:', error);
        // Fallback to simple offset calculation
        return -new Date().getTimezoneOffset() / 60;
    }
}

// Enhanced timezone name detection
function getBrowserTimezoneName() {
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Get localized timezone name
        const shortName = new Intl.DateTimeFormat('en', {
            timeZoneName: 'short',
            timeZone: timezone
        }).formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value || '';
        
        const longName = new Intl.DateTimeFormat('en', {
            timeZoneName: 'long',
            timeZone: timezone
        }).formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value || '';
        
        return {
            identifier: timezone,
            short: shortName,
            long: longName
        };
    } catch (error) {
        return null;
    }
}

// Timezone slider event handler
function initTimezoneSlider() {
    const slider = document.getElementById('timezoneSlider');
    
    // Auto-detect browser timezone
    const detectedOffset = detectBrowserTimezone();
    const browserTZ = getBrowserTimezoneName();
    
    // Set slider to detected timezone
    slider.value = detectedOffset;
    currentTimezoneOffset = detectedOffset;
    updateTimezoneDisplay();
    
    // Log detection results
    if (browserTZ) {
        console.log(`🌐 Browser timezone info:
        📍 Identifier: ${browserTZ.identifier}
        🏷️ Short name: ${browserTZ.short}
        📝 Long name: ${browserTZ.long}`);
    }
    
    slider.addEventListener('input', function() {
        currentTimezoneOffset = parseFloat(this.value);
        updateTimezoneDisplay();
        updateClock(); // Immediate update
    });
    
    // Add glowing effect on hover
    slider.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(0, 255, 0, 1)';
    });
    
    slider.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
    });
}

// Enhanced keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'c') {
            const now = getTimezoneDate();
            const formatted = formatDate(now);
            const timeStr = formatTime(now);
            
            // Create Matrix exit message
            const message = `⚡ MATRIX INTERFACE TERMINATED ⚡\n⏰ ${timeStr} on ${formatted.day}, ${formatted.date}\n🔌 Connection to the Matrix has been severed. Wake up, Neo. 🔌`;
            alert(message);
        }
        
        // Easter eggs for extra sass
        if (event.key === 'ArrowUp') {
            document.body.style.transform = 'rotate(1deg)';
            setTimeout(() => document.body.style.transform = '', 500);
        }
        
        if (event.key === 'ArrowDown') {
            document.body.style.transform = 'rotate(-1deg)';
            setTimeout(() => document.body.style.transform = '', 500);
        }
    });
}

// Remove screen shake effect
function addScreenShake() {
    // Shake effect disabled
}

// Initialize everything
function init() {
    initParticles();
    initTimezoneSlider();
    initKeyboardShortcuts();
    addScreenShake();
    
    updateClock();
    adjustFontSizes();
    
    // Update every second
    setInterval(updateClock, 1000);
    
    // Adjust font sizes on window resize
    window.addEventListener('resize', adjustFontSizes);
    
    // Add some sass to the console
    // Add enhanced console message with auto-detection info
    const browserTZ = getBrowserTimezoneName();
    const detectedOffset = detectBrowserTimezone();
    
    console.log(`
    ⚡ MATRIX TEMPORAL INTERFACE ONLINE ⚡
    ════════════════════════════════════════════════════════════════
    Welcome to the Matrix. Reality is now under your control.
    
    🌐 AUTO-DETECTED TEMPORAL ZONE:
    📍 ${browserTZ ? browserTZ.identifier : 'Unknown Sector'}
    🔢 ${browserTZ ? browserTZ.short : 'N/A'}
    ⏰ Temporal Offset: UTC${detectedOffset >= 0 ? '+' : ''}${detectedOffset}
    
    🔋 SYSTEM CAPABILITIES:
    🤖 Automatic geographical temporal detection
    🌞 Full seasonal time adjustment algorithms
    🔄 Real-time temporal zone calculations
    🌏 35+ global temporal regions supported
    🏠 Local temporal zone indicator
    🌡️ Weather data interface access
    
    ⚡ INTERFACE CONTROLS:
    • Adjust the temporal zone control
    • Ctrl+C to exit the Matrix
    • Arrow keys for system calibration
    • Click interface for system reset
    
    💊 Choose your pill wisely. There is no spoon. 💊
    `);
}

// Add Matrix shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes matrixShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px) rotate(-0.5deg); }
        50% { transform: translateX(3px) rotate(0.5deg); }
        75% { transform: translateX(-2px) rotate(-0.3deg); }
    }
`;
document.head.appendChild(style);

// Weather functionality
let weatherApiKey = ''; // Using a free weather service that doesn't require API key

// Weather icon mapping
const weatherIcons = {
    'clear': '☀️',
    'sunny': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'overcast': '☁️',
    'rain': '🌧️',
    'drizzle': '🌦️',
    'showers': '🌦️',
    'snow': '🌨️',
    'sleet': '🌨️',
    'thunderstorm': '⛈️',
    'fog': '🌫️',
    'mist': '🌫️',
    'haze': '🌫️',
    'wind': '💨',
    'hot': '🔥',
    'cold': '🥶',
    'default': '🌤️'
};

// Get weather icon based on description
function getWeatherIcon(description) {
    const desc = description.toLowerCase();
    
    if (desc.includes('clear') || desc.includes('sunny')) return weatherIcons.clear;
    if (desc.includes('partly') || desc.includes('few')) return weatherIcons['partly-cloudy'];
    if (desc.includes('cloud') || desc.includes('overcast')) return weatherIcons.cloudy;
    if (desc.includes('rain') || desc.includes('shower')) return weatherIcons.rain;
    if (desc.includes('drizzle')) return weatherIcons.drizzle;
    if (desc.includes('snow') || desc.includes('sleet')) return weatherIcons.snow;
    if (desc.includes('thunder') || desc.includes('storm')) return weatherIcons.thunderstorm;
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return weatherIcons.fog;
    if (desc.includes('wind')) return weatherIcons.wind;
    
    return weatherIcons.default;
}

// Convert Kelvin to Fahrenheit
function kelvinToFahrenheit(kelvin) {
    return Math.round((kelvin - 273.15) * 9/5 + 32);
}

// Fetch weather data using free weather API
async function fetchWeatherData(cityName) {
    try {
        console.log(`🌡️ Engaging meteorological apparatus for city: ${cityName}`);
        
        // Using OpenWeatherMap's free tier (demo data for now)
        // In a real implementation, you'd need an API key
        
        // For demo purposes, let's create realistic weather data
        const demoWeatherData = generateDemoWeatherData(cityName);
        
        return demoWeatherData;
        
    } catch (error) {
        console.error('❌ Weather fetch failed:', error);
        throw new Error('Weather data access denied. Please verify city name and try again.');
    }
}

// Generate demo weather data (for demonstration)
function generateDemoWeatherData(cityName) {
    const now = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const conditions = [
        { desc: 'Sunny', temp: 78 },
        { desc: 'Partly Cloudy', temp: 75 },
        { desc: 'Light Rain', temp: 68 },
        { desc: 'Cloudy', temp: 72 },
        { desc: 'Clear Skies', temp: 80 }
    ];
    
    const days = [];
    for (let i = 0; i < 5; i++) {
        const futureDate = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000));
        let dayLabel;
        
        if (i === 0) {
            dayLabel = 'Today';
        } else if (i === 1) {
            dayLabel = 'Tomorrow';
        } else {
            dayLabel = dayNames[futureDate.getDay()];
        }
        
        days.push({
            day: dayLabel,
            temperature: conditions[i].temp + Math.round(Math.random() * 10 - 5), // Add some randomness
            description: conditions[i].desc,
            icon: getWeatherIcon(conditions[i].desc)
        });
    }
    
    return days;
}

// Create weather ticker content
function createWeatherTicker(weatherData, cityName) {
    const weatherScroll = document.getElementById('weatherScroll');
    
    // Clear existing content
    weatherScroll.innerHTML = '';
    
    // Add city name at the start
    const startSeparator = document.createElement('div');
    startSeparator.className = 'weather-separator';
    startSeparator.innerHTML = `<span class="city-separator">-- ${cityName} --</span>`;
    weatherScroll.appendChild(startSeparator);
    
    // Create weather items
    weatherData.forEach((day, index) => {
        const weatherDay = document.createElement('div');
        weatherDay.className = 'weather-day';
        
        weatherDay.innerHTML = `
            <span class="weather-icon">${day.icon}</span>
            <strong>${day.day}</strong>
            <span class="weather-temp">${day.temperature}°F</span>
            <span class="weather-desc">${day.description}</span>
        `;
        
        weatherScroll.appendChild(weatherDay);
        
        // Add city name separator after each weather item
        const separator = document.createElement('div');
        separator.className = 'weather-separator';
        separator.innerHTML = `<span class="city-separator">-- ${cityName} --</span>`;
        weatherScroll.appendChild(separator);
    });
    
    // Duplicate the weather data multiple times for seamless scrolling
    for (let repeat = 0; repeat < 3; repeat++) {
        weatherData.forEach((day, index) => {
            const weatherDay = document.createElement('div');
            weatherDay.className = 'weather-day';
            
            weatherDay.innerHTML = `
                <span class="weather-icon">${day.icon}</span>
                <strong>${day.day}</strong>
                <span class="weather-temp">${day.temperature}°F</span>
                <span class="weather-desc">${day.description}</span>
            `;
            
            weatherScroll.appendChild(weatherDay);
            
            // Add city name separator after each weather item
            const separator = document.createElement('div');
            separator.className = 'weather-separator';
            separator.innerHTML = `<span class="city-separator">-- ${cityName} --</span>`;
            weatherScroll.appendChild(separator);
        });
    }
    
    // Add city name at the end
    const endSeparator = document.createElement('div');
    endSeparator.className = 'weather-separator';
    endSeparator.innerHTML = `<span class="city-separator">-- ${cityName} --</span>`;
    weatherScroll.appendChild(endSeparator);
}

// Handle weather form submission
async function handleWeatherRequest() {
    const cityInput = document.getElementById('cityInput');
    const weatherButton = document.getElementById('weatherButton');
    const cityInputContainer = document.getElementById('cityInputContainer');
    const weatherTicker = document.getElementById('weatherTicker');
    
    const cityName = cityInput.value.trim();
    
    // Validate city name
    if (cityName.length < 2 || !/^[a-zA-Z\s\-\.\']+$/.test(cityName)) {
        // Add shake animation for invalid input
        cityInput.style.animation = 'matrixShake 0.5s ease-in-out';
        cityInput.style.borderColor = '#ff0000';
        cityInput.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
        
        setTimeout(() => {
            cityInput.style.animation = '';
            cityInput.style.borderColor = '#00ff00';
            cityInput.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.8)';
        }, 500);
        
        return;
    }
    
    try {
        // Show loading state
        weatherButton.textContent = 'Loading...';
        weatherButton.disabled = true;
        
        // Fetch weather data
        const weatherData = await fetchWeatherData(cityName);
        
        // Create ticker content
        createWeatherTicker(weatherData, cityName);
        
        // Hide input, show ticker and reset button
        cityInputContainer.classList.add('hidden');
        weatherTicker.classList.remove('hidden');
        document.getElementById('resetButton').classList.remove('hidden');
        
        console.log(`🌐 Weather data interface successfully connected for city: ${cityName}`);
        
    } catch (error) {
        console.error('Weather error:', error);
        alert('Weather data access failed. The system may be under attack. Try a different city name.');
        
        // Reset button state
        weatherButton.textContent = 'ACCESS DATA';
        weatherButton.disabled = false;
    }
}

// Initialize weather functionality
function initWeather() {
    const cityInput = document.getElementById('cityInput');
    const weatherButton = document.getElementById('weatherButton');
    
    // Handle button click
    weatherButton.addEventListener('click', handleWeatherRequest);
    
    // Handle Enter key
    cityInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleWeatherRequest();
        }
    });
    
    // Add fancy input effects
    cityInput.addEventListener('input', function() {
        // Allow letters, spaces, hyphens, dots, and apostrophes for city names
        this.value = this.value.replace(/[^a-zA-Z\s\-\.\']/g, '');
    });
    
    // Handle reset button
    document.getElementById('resetButton').addEventListener('click', function() {
        const cityInputContainer = document.getElementById('cityInputContainer');
        const weatherTicker = document.getElementById('weatherTicker');
        
        cityInputContainer.classList.remove('hidden');
        weatherTicker.classList.add('hidden');
        this.classList.add('hidden');
        
        // Reset input
        document.getElementById('cityInput').value = '';
        document.getElementById('weatherButton').textContent = 'ACCESS DATA';
        document.getElementById('weatherButton').disabled = false;
    });
}

// Theme switching functionality
function initThemeSwitcher() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedTheme = this.getAttribute('data-theme');
            
            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Switch to selected theme
            switch(selectedTheme) {
                case 'matrix':
                    switchToMatrixTheme();
                    break;
                case 'lcars':
                    switchToLcarsTheme();
                    break;
                case 'thor':
                    switchToThorTheme();
                    break;
            }
        });
    });
}

function switchToMatrixTheme() {
    currentTheme = 'matrix';
    document.body.classList.remove('lcars-theme', 'thor-theme');
    
    // Show/hide backgrounds
    document.getElementById('matrixBg').classList.remove('hidden');
    document.getElementById('lcarsBg').classList.add('hidden');
    document.getElementById('thorBg').classList.add('hidden');
    
    
    // Stop other effects
    if (warpStarsInterval) {
        clearInterval(warpStarsInterval);
    }
    if (thorEffectsInterval) {
        clearInterval(thorEffectsInterval);
    }
    
    // Start matrix effects
    initParticles();
    initMatrixKanjiRotation();
    
    // Update labels
    updateThemeLabels();
    
    console.log('⚡ MATRIX THEME ACTIVATED ⚡');
}

function switchToLcarsTheme() {
    currentTheme = 'lcars';
    document.body.classList.remove('thor-theme');
    document.body.classList.add('lcars-theme');
    
    // Show/hide backgrounds
    document.getElementById('matrixBg').classList.add('hidden');
    document.getElementById('lcarsBg').classList.remove('hidden');
    document.getElementById('thorBg').classList.add('hidden');
    
    
    // Stop other effects
    if (thorEffectsInterval) {
        clearInterval(thorEffectsInterval);
    }
    if (matrixKanjiInterval) {
        clearInterval(matrixKanjiInterval);
    }
    
    // Start warp effects
    initWarpSpeed();
    
    // Update labels
    updateThemeLabels();
    
    console.log('🖖 LCARS INTERFACE ENGAGED 🖖');
}

function switchToThorTheme() {
    currentTheme = 'thor';
    document.body.classList.remove('lcars-theme');
    document.body.classList.add('thor-theme');
    
    // Show/hide backgrounds
    document.getElementById('matrixBg').classList.add('hidden');
    document.getElementById('lcarsBg').classList.add('hidden');
    document.getElementById('thorBg').classList.remove('hidden');
    
    
    // Stop other effects
    if (warpStarsInterval) {
        clearInterval(warpStarsInterval);
    }
    if (matrixKanjiInterval) {
        clearInterval(matrixKanjiInterval);
    }
    
    // Start Thor effects
    initThorEffects();
    
    // Update labels
    updateThemeLabels();
    
    console.log('🔨 THOR THEME ACTIVATED - FOR ASGARD! 🔨');
}

// Initialize warp speed effect for LCARS theme
function initWarpSpeed() {
    const warpContainer = document.getElementById('warpStars');
    
    // Clear existing stars
    warpContainer.innerHTML = '';
    
    // Create initial stars
    for (let i = 0; i < 40; i++) {
        createWarpStar();
    }
    
    // Continuously create new stars
    warpStarsInterval = setInterval(() => {
        createWarpStar();
        
        // Clean up old stars
        const stars = warpContainer.querySelectorAll('.warp-star');
        if (stars.length > 80) {
            stars[0].remove();
        }
    }, 300);
}

function createWarpStar() {
    const warpContainer = document.getElementById('warpStars');
    if (!warpContainer) return;
    
    // 10% chance to create a Borg cube instead of a star
    const isBorgCube = Math.random() < 0.1;
    
    if (isBorgCube) {
        createBorgCube(warpContainer);
    } else {
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
}

function createBorgCube(warpContainer) {
    const borgCube = document.createElement('div');
    borgCube.className = 'space-invader'; // Keep same CSS class for styling
    
    // Borg cube shapes using geometric/mechanical Unicode characters
    const borgCubeShapes = [
        '⬛', // Black large square (classic cube)
        '⬜', // White large square (damaged cube)
        '🔳', // White square button
        '🔲', // Black square button
        '◼️', // Black medium square
        '◻️', // White medium square
        '▪️', // Black small square
        '▫️', // White small square
        '■', // Black square
        '□', // White square
    ];
    
    const shape = borgCubeShapes[Math.floor(Math.random() * borgCubeShapes.length)];
    const xPos = Math.random() * window.innerWidth;
    const yPos = Math.random() * window.innerHeight;
    const duration = Math.random() * 4 + 3; // 3-7 seconds (mechanical, steady movement)
    const delay = Math.random() * 1.5; // 0-1.5 second delay
    
    borgCube.textContent = shape;
    borgCube.style.left = xPos + 'px';
    borgCube.style.top = yPos + 'px';
    borgCube.style.animationDuration = duration + 's';
    borgCube.style.animationDelay = delay + 's';
    
    // Borg cubes maintain perfect geometric orientation (no random rotation)
    borgCube.style.transform = 'rotate(0deg)';
    
    warpContainer.appendChild(borgCube);
    
    // Remove Borg cube after animation
    setTimeout(() => {
        if (borgCube.parentNode) {
            borgCube.remove();
        }
    }, (duration + delay) * 1000 + 100);
}

// Initialize Thor effects
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
    thorEffectsInterval = setInterval(() => {
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
    }, 200);
}

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

function createAsgardRune(container, runeArray) {
    const rune = document.createElement('div');
    rune.className = 'rune';
    
    const randomRune = runeArray[Math.floor(Math.random() * runeArray.length)];
    const xPos = Math.random() * window.innerWidth;
    const yPos = Math.random() * window.innerHeight;
    const delay = Math.random() * 4; // 0-4 second delay (faster)
    const rotation = Math.random() * 360; // Random rotation
    const scale = 0.7 + Math.random() * 0.6; // Random scale between 0.7-1.3
    
    rune.textContent = randomRune;
    rune.style.left = xPos + 'px';
    rune.style.top = yPos + 'px';
    rune.style.animationDelay = delay + 's';
    rune.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    
    container.appendChild(rune);
}

// Matrix kanji rotation for center panel
function initMatrixKanjiRotation() {
    // Stop any existing interval
    if (matrixKanjiInterval) {
        clearInterval(matrixKanjiInterval);
    }
    
    // Array of Matrix-themed kanji characters
    const matrixKanji = [
        '時', // time
        '空', // void/sky  
        '夢', // dream
        '魂', // soul
        '心', // heart
        '光', // light
        '影', // shadow
        '真', // truth
        '偽', // false
        '現', // reality
        '幻', // illusion
        '始', // beginning
        '終', // end
        '無', // nothing
        '有', // existence
        '知', // knowledge
        '力', // power
        '流', // flow
        '変', // change
        '永' // eternity
    ];
    
    let currentIndex = 0;
    const clockIcon = document.querySelector('.clock-display::before') || 
                     document.querySelector('.clock-display');
    
    // Function to update kanji character
    function updateKanji() {
        if (currentTheme === 'matrix' && clockIcon) {
            // Use CSS custom property to change the content
            document.documentElement.style.setProperty('--matrix-kanji', `"${matrixKanji[currentIndex]}"`);
            currentIndex = (currentIndex + 1) % matrixKanji.length;
        }
    }
    
    // Change kanji every 300ms (matches the pulse frequency)
    matrixKanjiInterval = setInterval(updateKanji, 300);
    
    // Set initial kanji
    updateKanji();
}

// Update timezone display labels based on theme
function updateThemeLabels() {
    const timezoneLabel = document.querySelector('.timezone-label');
    const cityLabel = document.querySelector('.city-label');
    
    if (currentTheme === 'matrix') {
        if (timezoneLabel) timezoneLabel.textContent = '⚡ TEMPORAL ZONE CONTROL ⚡';
        if (cityLabel) cityLabel.textContent = '🌐 WEATHER DATA INTERFACE';
    } else if (currentTheme === 'lcars') {
        if (timezoneLabel) timezoneLabel.textContent = '🖖 TEMPORAL COORDINATES 🖖';
        if (cityLabel) cityLabel.textContent = '🌌 ATMOSPHERIC CONDITIONS';
    } else if (currentTheme === 'thor') {
        if (timezoneLabel) timezoneLabel.textContent = '🔨 ASGARDIAN TIME CONTROL 🔨';
        if (cityLabel) cityLabel.textContent = '⚡ MIDGARD WEATHER READINGS ⚡';
    }
}

// Click effects functions
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

function createPillFlyby(clickX, clickY) {
    console.log('Creating Matrix pills at:', clickX, clickY);
    
    // Create simple, visible Matrix pills
    const pillData = [
        { color: '#ff0000', text: 'RED', delay: 0 },
        { color: '#0066ff', text: 'BLUE', delay: 0.3 }
    ];
    
    pillData.forEach((data, index) => {
        const pill = document.createElement('div');
        pill.className = 'simple-matrix-pill';
        
        // Basic pill styling
        pill.style.position = 'fixed';
        pill.style.left = (clickX - 30 + index * 60) + 'px';
        pill.style.top = (clickY - 15) + 'px';
        pill.style.width = '60px';
        pill.style.height = '30px';
        pill.style.borderRadius = '15px';
        pill.style.backgroundColor = data.color;
        pill.style.zIndex = '10000';
        pill.style.boxShadow = `0 0 20px ${data.color}`;
        pill.style.transition = 'all 3s ease-out';
        
        console.log('Created simple pill:', data.color, 'at', pill.style.left, pill.style.top);
        document.body.appendChild(pill);
        
        // Start animation after a delay using CSS transitions
        setTimeout(() => {
            console.log('Starting animation for', data.color, 'pill');
            // Apply dramatic transformation
            pill.style.transform = `scale(10) rotate(${index === 0 ? '720deg' : '-720deg'})`;
            pill.style.opacity = '0';
            pill.style.filter = 'blur(5px)';
        }, data.delay * 1000 + 100);
    });
    
    // Clean up
    setTimeout(() => {
        document.querySelectorAll('.simple-matrix-pill').forEach(pill => {
            if (pill.parentNode) pill.remove();
        });
    }, 4000);
}

// Global click handler
function handleGlobalClick(event) {
    console.log('Global click detected! Current theme:', currentTheme);
    
    // Don't trigger on theme selector clicks
    if (event.target.closest('.theme-selector')) {
        console.log('Theme selector clicked, ignoring');
        return;
    }
    
    // Get click coordinates
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    console.log('Processing click at:', clickX, clickY, 'Theme:', currentTheme);
    
    if (currentTheme === 'thor') {
        console.log('Triggering Thor lightning');
        createLightningFlash(clickX, clickY);
    } else if (currentTheme === 'lcars') {
        console.log('Triggering LCARS photon torpedoes');
        createKlingonFlyby(clickX, clickY);
    } else if (currentTheme === 'matrix') {
        console.log('Triggering Matrix pills');
        createPillFlyby(clickX, clickY);
    } else {
        console.log('Unknown theme, defaulting to Matrix pills');
        createPillFlyby(clickX, clickY);
    }
}

// Start the show!
document.addEventListener('DOMContentLoaded', function() {
    init();
    initWeather();
    initThemeSwitcher();
    updateThemeLabels();
    
    // Add global click handler
    document.addEventListener('click', handleGlobalClick);
});