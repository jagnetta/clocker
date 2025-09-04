// Global variables
let currentTimezoneOffset = 0;
let particles = [];
let currentTheme = 'matrix';
let warpStarsInterval;
let thorEffectsInterval;
let matrixKanjiInterval;
let whiteRabbitActive = false;
let activeUfos = 0;
let lokiTrickActive = false;
let isMobileDevice = false;

// Accurate timezone data based on IANA timezone standards
const timezones = {
    // UTC-12: Baker Island, Howland Island
    '-12': { name: 'AoE', label: 'Anywhere on Earth', dst: false },
    
    // UTC-11: American Samoa, Niue
    '-11': { name: 'NUT', label: 'Niue Time', dst: false },
    
    // UTC-10: Hawaii, Cook Islands
    '-10': { name: 'HST', label: 'Hawaii Standard Time', dst: false },
    
    // UTC-9.5: Marquesas Islands (France)
    '-9.5': { name: 'MART', label: 'Marquesas Islands Time', dst: false },
    
    // UTC-9: Alaska (DST to UTC-8)
    '-9': { name: 'AKST', label: 'Alaska Standard Time', dst: true, dstName: 'AKDT', dstOffset: -8 },
    
    // UTC-8: Pacific Time (DST to UTC-7)
    '-8': { name: 'PST', label: 'Pacific Standard Time', dst: true, dstName: 'PDT', dstOffset: -7 },
    
    // UTC-7: Mountain Time (DST to UTC-6), Arizona stays on MST
    '-7': { name: 'MST', label: 'Mountain Standard Time', dst: true, dstName: 'MDT', dstOffset: -6 },
    
    // UTC-6: Central Time (DST to UTC-5)
    '-6': { name: 'CST', label: 'Central Standard Time', dst: true, dstName: 'CDT', dstOffset: -5 },
    
    // UTC-5: Eastern Time (DST to UTC-4)
    '-5': { name: 'EST', label: 'Eastern Standard Time', dst: true, dstName: 'EDT', dstOffset: -4 },
    
    // UTC-4: Atlantic Time (DST to UTC-3)
    '-4': { name: 'AST', label: 'Atlantic Standard Time', dst: true, dstName: 'ADT', dstOffset: -3 },
    
    // UTC-3.5: Newfoundland Time (DST to UTC-2.5)
    '-3.5': { name: 'NST', label: 'Newfoundland Standard Time', dst: true, dstName: 'NDT', dstOffset: -2.5 },
    
    // UTC-3: Argentina, Brazil (some regions), Uruguay
    '-3': { name: 'ART', label: 'Argentina Time', dst: false },
    
    // UTC-2: South Georgia, South Sandwich Islands
    '-2': { name: 'GST', label: 'South Georgia Time', dst: false },
    
    // UTC-1: Cape Verde, Azores (DST to UTC+0)
    '-1': { name: 'CVT', label: 'Cape Verde Time', dst: false },
    
    // UTC+0: Greenwich Mean Time, Western European Time (DST to UTC+1)
    '0': { name: 'GMT', label: 'Greenwich Mean Time', dst: true, dstName: 'BST', dstOffset: 1 },
    
    // UTC+1: Central European Time (DST to UTC+2)
    '1': { name: 'CET', label: 'Central European Time', dst: true, dstName: 'CEST', dstOffset: 2 },
    
    // UTC+2: Eastern European Time (DST to UTC+3)
    '2': { name: 'EET', label: 'Eastern European Time', dst: true, dstName: 'EEST', dstOffset: 3 },
    
    // UTC+3: Moscow, East Africa
    '3': { name: 'MSK', label: 'Moscow Standard Time', dst: false },
    
    // UTC+3.5: Iran Time (DST to UTC+4.5)
    '3.5': { name: 'IRST', label: 'Iran Standard Time', dst: true, dstName: 'IRDT', dstOffset: 4.5 },
    
    // UTC+4: Gulf Standard Time, Azerbaijan
    '4': { name: 'GST', label: 'Gulf Standard Time', dst: false },
    
    // UTC+4.5: Afghanistan Time
    '4.5': { name: 'AFT', label: 'Afghanistan Time', dst: false },
    
    // UTC+5: Pakistan, Kazakhstan west
    '5': { name: 'PKT', label: 'Pakistan Standard Time', dst: false },
    
    // UTC+5.5: India Standard Time, Sri Lanka
    '5.5': { name: 'IST', label: 'India Standard Time', dst: false },
    
    // UTC+5.75: Nepal Time
    '5.75': { name: 'NPT', label: 'Nepal Time', dst: false },
    
    // UTC+6: Bangladesh, Kazakhstan east
    '6': { name: 'BST', label: 'Bangladesh Standard Time', dst: false },
    
    // UTC+6.5: Myanmar Time
    '6.5': { name: 'MMT', label: 'Myanmar Time', dst: false },
    
    // UTC+7: Indochina Time, Thailand, Vietnam
    '7': { name: 'ICT', label: 'Indochina Time', dst: false },
    
    // UTC+8: China Standard Time, Singapore, Philippines
    '8': { name: 'CST', label: 'China Standard Time', dst: false },
    
    // UTC+8.75: Australian Central Western Standard Time
    '8.75': { name: 'ACWST', label: 'Australian Central Western Standard Time', dst: false },
    
    // UTC+9: Japan Standard Time, Korea
    '9': { name: 'JST', label: 'Japan Standard Time', dst: false },
    
    // UTC+9.5: Australian Central Standard Time (DST to UTC+10.5)
    '9.5': { name: 'ACST', label: 'Australian Central Standard Time', dst: true, dstName: 'ACDT', dstOffset: 10.5 },
    
    // UTC+10: Australian Eastern Standard Time (DST to UTC+11)
    '10': { name: 'AEST', label: 'Australian Eastern Standard Time', dst: true, dstName: 'AEDT', dstOffset: 11 },
    
    // UTC+10.5: Lord Howe Standard Time (DST to UTC+11 - unique 30min DST)
    '10.5': { name: 'LHST', label: 'Lord Howe Standard Time', dst: true, dstName: 'LHDT', dstOffset: 11 },
    
    // UTC+11: Solomon Islands, Vanuatu
    '11': { name: 'SBT', label: 'Solomon Islands Time', dst: false },
    
    // UTC+12: New Zealand Standard Time (DST to UTC+13)
    '12': { name: 'NZST', label: 'New Zealand Standard Time', dst: true, dstName: 'NZDT', dstOffset: 13 },
    
    // UTC+12.75: Chatham Standard Time (DST to UTC+13.75)
    '12.75': { name: 'CHAST', label: 'Chatham Standard Time', dst: true, dstName: 'CHADT', dstOffset: 13.75 },
    
    // UTC+13: Tonga, Samoa
    '13': { name: 'TOT', label: 'Tonga Time', dst: false },
    
    // UTC+14: Line Islands (Kiribati)
    '14': { name: 'LINT', label: 'Line Islands Time', dst: false }
};

// Enhanced DST calculation functions with accurate regional rules
function isDSTActive(date, offset) {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    const day = date.getDate();
    
    // Handle specific timezone DST rules
    switch (offset) {
        // US/Canada Timezones: Second Sunday in March to First Sunday in November
        case -9: // Alaska
        case -8: // Pacific
        case -7: // Mountain (most regions)
        case -6: // Central
        case -5: // Eastern
        case -4: // Atlantic
            return isUSCanadaDST(date, year);
            
        // Newfoundland: Same dates as US/Canada
        case -3.5:
            return isUSCanadaDST(date, year);
            
        // European Timezones: Last Sunday in March to Last Sunday in October
        case 0: // GMT/BST
        case 1: // CET/CEST
        case 2: // EET/EEST
            return isEuropeanDST(date, year);
            
        // Iran: March 22 to September 22 (Nowruz-based)
        case 3.5:
            return isIranDST(date, year);
            
        // Australia: First Sunday in October to First Sunday in April
        case 9.5: // ACST/ACDT
        case 10: // AEST/AEDT
            return isAustraliaDST(date, year);
            
        // Lord Howe Island: First Sunday in October to First Sunday in April (30min shift)
        case 10.5:
            return isAustraliaDST(date, year);
            
        // New Zealand: Last Sunday in September to First Sunday in April
        case 12: // NZST/NZDT
            return isNewZealandDST(date, year);
            
        // Chatham Islands: Same as New Zealand
        case 12.75:
            return isNewZealandDST(date, year);
            
        default:
            return false;
    }
}

// US/Canada DST: Second Sunday in March to First Sunday in November
function isUSCanadaDST(date, year) {
    const marchSecondSunday = getNthSundayOfMonth(year, 2, 2);
    const novemberFirstSunday = getNthSundayOfMonth(year, 10, 1);
    return date >= marchSecondSunday && date < novemberFirstSunday;
}

// European DST: Last Sunday in March to Last Sunday in October
function isEuropeanDST(date, year) {
    const marchLastSunday = getLastSundayOfMonth(year, 2);
    const octoberLastSunday = getLastSundayOfMonth(year, 9);
    return date >= marchLastSunday && date < octoberLastSunday;
}

// Iran DST: Approximately March 22 to September 22 (varies by year)
function isIranDST(date, year) {
    // Nowruz typically starts around March 20-21
    const startDate = new Date(year, 2, 22); // March 22
    const endDate = new Date(year, 8, 22);   // September 22
    return date >= startDate && date < endDate;
}

// Australia DST: First Sunday in October to First Sunday in April (next year)
function isAustraliaDST(date, year) {
    const month = date.getMonth();
    
    if (month >= 9) { // October, November, December
        const octoberFirstSunday = getNthSundayOfMonth(year, 9, 1);
        return date >= octoberFirstSunday;
    } else if (month <= 3) { // January, February, March, April
        const aprilFirstSunday = getNthSundayOfMonth(year, 3, 1);
        return date < aprilFirstSunday;
    }
    return false; // May through September
}

// New Zealand DST: Last Sunday in September to First Sunday in April (next year)
function isNewZealandDST(date, year) {
    const month = date.getMonth();
    
    if (month >= 8) { // September, October, November, December
        const septemberLastSunday = getLastSundayOfMonth(year, 8);
        return date >= septemberLastSunday;
    } else if (month <= 3) { // January, February, March, April
        const aprilFirstSunday = getNthSundayOfMonth(year, 3, 1);
        return date < aprilFirstSunday;
    }
    return false; // May through August
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
    const fallSpeed = 8 + Math.random() * 12; // Random speed 8-20 seconds for quicker movement
    
    // Assign random blur and size for distant viewing perspective
    const blurLevels = [2.0, 3.5, 5.5, 7.5, 10.0]; // All pushed further back with more blur
    const fontSizes = [22, 18, 15, 12, 9]; // All smaller as if viewed from distance
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
        // Find the closest valid timezone offset
        const validOffsets = Object.keys(timezones).map(parseFloat).sort((a, b) => a - b);
        const closest = validOffsets.reduce((prev, curr) => {
            return Math.abs(curr - offset) < Math.abs(prev - offset) ? curr : prev;
        });
        return timezones[closest.toString()];
    }
    
    console.log(`🕐 Checking timezone ${offset}: ${timezoneInfo.name} (${timezoneInfo.label})`);
    
    if (timezoneInfo.dst && isDSTActive(date, offset)) {
        console.log(`☀️ DST is active for ${timezoneInfo.name} -> ${timezoneInfo.dstName}`);
        return {
            name: timezoneInfo.dstName,
            label: timezoneInfo.label.replace('Standard', 'Daylight'),
            isDST: true,
            dstOffset: timezoneInfo.dstOffset
        };
    } else {
        console.log(`❄️ Standard time for ${timezoneInfo.name}`);
        return {
            name: timezoneInfo.name,
            label: timezoneInfo.label,
            isDST: false
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
    const timezoneDescElement = document.getElementById('timezoneDesc');
    
    // Update content
    dayElement.textContent = formatted.day;
    dayElement.setAttribute('data-text', formatted.day);
    dateElement.textContent = formatted.date;
    timeElement.innerHTML = timeStr;
    
    // Update timezone description
    if (timezoneDescElement) {
        const timezoneInfo = getTimezoneInfo(now, currentTimezoneOffset);
        timezoneDescElement.textContent = timezoneInfo.label;
    }
}

// Enhanced font sizing with better calculations
function adjustFontSizes() {
    const dayEl = document.getElementById('day');
    const dateEl = document.getElementById('date');
    const timeEl = document.getElementById('time');
    const timezoneDescEl = document.getElementById('timezoneDesc');
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
    
    // Set timezone description font size (smaller than date)
    if (timezoneDescEl) {
        const timezoneDescSize = Math.max(dateSize * 0.35, 6);
        timezoneDescEl.style.fontSize = timezoneDescSize + 'px';
    }
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
    
    // Add mouse wheel support for timezone adjustment
    const timezoneContainer = document.querySelector('.timezone-container');
    if (timezoneContainer) {
        timezoneContainer.addEventListener('wheel', function(event) {
            event.preventDefault(); // Prevent page scrolling
            
            const step = 0.5; // Match the slider step
            const currentValue = parseFloat(slider.value);
            const minValue = parseFloat(slider.min);
            const maxValue = parseFloat(slider.max);
            
            // Determine direction (negative deltaY = scroll up = increase timezone)
            const direction = event.deltaY < 0 ? 1 : -1;
            const newValue = currentValue + (direction * step);
            
            // Clamp to slider bounds
            const clampedValue = Math.max(minValue, Math.min(maxValue, newValue));
            
            if (clampedValue !== currentValue) {
                slider.value = clampedValue;
                currentTimezoneOffset = clampedValue;
                updateTimezoneDisplay();
                updateClock();
                
                // Add visual feedback
                timezoneContainer.style.boxShadow = '0 0 40px rgba(0, 255, 0, 0.8)';
                setTimeout(() => {
                    timezoneContainer.style.boxShadow = '';
                }, 150);
            }
        });
    }
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

// Mobile detection function
function detectMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini'];
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 768;
    
    // Check user agent for mobile keywords
    const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
    
    // Combined mobile detection
    isMobileDevice = isMobileUserAgent || (isTouchDevice && hasSmallScreen);
    
    if (isMobileDevice) {
        document.body.classList.add('mobile-device');
        console.log('📱 Mobile device detected - applying simplified styles');
    }
    
    return isMobileDevice;
}

// Initialize everything
function init() {
    // Detect mobile device first
    detectMobileDevice();
    
    // Only initialize complex effects on non-mobile devices
    if (!isMobileDevice) {
        initParticles();
    }
    
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

// Generate location data based on city name
function generateLocationData(cityName) {
    const cityMap = {
        'taunton': { state: 'MA', country: 'US', zip: '02780' },
        'boston': { state: 'MA', country: 'US', zip: '02101' },
        'new york': { state: 'NY', country: 'US', zip: '10001' },
        'los angeles': { state: 'CA', country: 'US', zip: '90210' },
        'chicago': { state: 'IL', country: 'US', zip: '60601' },
        'miami': { state: 'FL', country: 'US', zip: '33101' },
        'london': { state: 'ENG', country: 'GB', zip: 'SW1A 1AA' },
        'paris': { state: 'IDF', country: 'FR', zip: '75001' },
        'berlin': { state: 'BE', country: 'DE', zip: '10115' },
        'tokyo': { state: 'TK', country: 'JP', zip: '100-0001' },
        'toronto': { state: 'ON', country: 'CA', zip: 'M5H 2N2' },
        'vancouver': { state: 'BC', country: 'CA', zip: 'V6B 1A1' },
        'sydney': { state: 'NSW', country: 'AU', zip: '2000' },
        'melbourne': { state: 'VIC', country: 'AU', zip: '3000' },
        'calcutta': { state: 'WB', country: 'IN', zip: '700001' },
        'kolkata': { state: 'WB', country: 'IN', zip: '700001' },
        'mumbai': { state: 'MH', country: 'IN', zip: '400001' },
        'delhi': { state: 'DL', country: 'IN', zip: '110001' },
        'bangkok': { state: 'BKK', country: 'TH', zip: '10100' },
        'singapore': { state: 'SG', country: 'SG', zip: '018956' },
        'moscow': { state: 'MOW', country: 'RU', zip: '101000' },
        'beijing': { state: 'BJ', country: 'CN', zip: '100000' },
        'seoul': { state: 'SEL', country: 'KR', zip: '04524' }
    };
    
    const cityKey = cityName.toLowerCase();
    if (cityMap[cityKey]) {
        return cityMap[cityKey];
    }
    
    // Generate generic location data for unknown cities
    const genericStates = ['CA', 'NY', 'TX', 'FL', 'WA', 'CO', 'OR'];
    const genericZips = ['12345', '54321', '98765', '11111', '22222'];
    
    return {
        state: genericStates[Math.floor(Math.random() * genericStates.length)],
        country: 'US',
        zip: genericZips[Math.floor(Math.random() * genericZips.length)]
    };
}

// City-specific weather patterns
function getCityWeatherPattern(cityName) {
    const cityKey = cityName.toLowerCase();
    const currentMonth = new Date().getMonth(); // 0-11
    const isWinter = currentMonth >= 11 || currentMonth <= 2;
    const isSummer = currentMonth >= 5 && currentMonth <= 8;
    
    const cityPatterns = {
        'london': {
            winter: [
                { desc: 'Cloudy', temp: 42, chance: 0.4 },
                { desc: 'Light Rain', temp: 39, chance: 0.3 },
                { desc: 'Overcast', temp: 45, chance: 0.2 },
                { desc: 'Drizzle', temp: 41, chance: 0.1 }
            ],
            summer: [
                { desc: 'Partly Cloudy', temp: 68, chance: 0.3 },
                { desc: 'Cloudy', temp: 65, chance: 0.25 },
                { desc: 'Light Rain', temp: 63, chance: 0.25 },
                { desc: 'Sunny', temp: 72, chance: 0.2 }
            ],
            spring: [
                { desc: 'Light Rain', temp: 55, chance: 0.35 },
                { desc: 'Partly Cloudy', temp: 58, chance: 0.3 },
                { desc: 'Cloudy', temp: 52, chance: 0.2 },
                { desc: 'Sunny', temp: 62, chance: 0.15 }
            ]
        },
        'new york': {
            winter: [
                { desc: 'Snow', temp: 32, chance: 0.25 },
                { desc: 'Cloudy', temp: 38, chance: 0.3 },
                { desc: 'Clear Skies', temp: 35, chance: 0.25 },
                { desc: 'Overcast', temp: 40, chance: 0.2 }
            ],
            summer: [
                { desc: 'Sunny', temp: 82, chance: 0.4 },
                { desc: 'Partly Cloudy', temp: 78, chance: 0.3 },
                { desc: 'Thunderstorm', temp: 75, chance: 0.15 },
                { desc: 'Hot', temp: 88, chance: 0.15 }
            ],
            spring: [
                { desc: 'Partly Cloudy', temp: 68, chance: 0.3 },
                { desc: 'Light Rain', temp: 62, chance: 0.25 },
                { desc: 'Sunny', temp: 72, chance: 0.25 },
                { desc: 'Cloudy', temp: 65, chance: 0.2 }
            ]
        },
        'calcutta': {
            winter: [
                { desc: 'Sunny', temp: 78, chance: 0.4 },
                { desc: 'Clear Skies', temp: 82, chance: 0.3 },
                { desc: 'Partly Cloudy', temp: 75, chance: 0.2 },
                { desc: 'Haze', temp: 80, chance: 0.1 }
            ],
            summer: [
                { desc: 'Hot', temp: 95, chance: 0.35 },
                { desc: 'Thunderstorm', temp: 88, chance: 0.25 },
                { desc: 'Sunny', temp: 92, chance: 0.2 },
                { desc: 'Partly Cloudy', temp: 89, chance: 0.2 }
            ],
            spring: [
                { desc: 'Sunny', temp: 86, chance: 0.35 },
                { desc: 'Hot', temp: 90, chance: 0.25 },
                { desc: 'Partly Cloudy', temp: 83, chance: 0.2 },
                { desc: 'Clear Skies', temp: 88, chance: 0.2 }
            ]
        },
        'kolkata': {
            winter: [
                { desc: 'Sunny', temp: 78, chance: 0.4 },
                { desc: 'Clear Skies', temp: 82, chance: 0.3 },
                { desc: 'Partly Cloudy', temp: 75, chance: 0.2 },
                { desc: 'Haze', temp: 80, chance: 0.1 }
            ],
            summer: [
                { desc: 'Hot', temp: 95, chance: 0.35 },
                { desc: 'Thunderstorm', temp: 88, chance: 0.25 },
                { desc: 'Sunny', temp: 92, chance: 0.2 },
                { desc: 'Partly Cloudy', temp: 89, chance: 0.2 }
            ],
            spring: [
                { desc: 'Sunny', temp: 86, chance: 0.35 },
                { desc: 'Hot', temp: 90, chance: 0.25 },
                { desc: 'Partly Cloudy', temp: 83, chance: 0.2 },
                { desc: 'Clear Skies', temp: 88, chance: 0.2 }
            ]
        },
        'mumbai': {
            winter: [
                { desc: 'Sunny', temp: 85, chance: 0.4 },
                { desc: 'Partly Cloudy', temp: 82, chance: 0.3 },
                { desc: 'Clear Skies', temp: 88, chance: 0.2 },
                { desc: 'Haze', temp: 84, chance: 0.1 }
            ],
            summer: [
                { desc: 'Rain', temp: 82, chance: 0.4 },
                { desc: 'Thunderstorm', temp: 80, chance: 0.3 },
                { desc: 'Hot', temp: 92, chance: 0.2 },
                { desc: 'Cloudy', temp: 85, chance: 0.1 }
            ],
            spring: [
                { desc: 'Hot', temp: 90, chance: 0.4 },
                { desc: 'Sunny', temp: 88, chance: 0.3 },
                { desc: 'Partly Cloudy', temp: 86, chance: 0.2 },
                { desc: 'Haze', temp: 92, chance: 0.1 }
            ]
        },
        'delhi': {
            winter: [
                { desc: 'Fog', temp: 62, chance: 0.35 },
                { desc: 'Clear Skies', temp: 68, chance: 0.3 },
                { desc: 'Sunny', temp: 65, chance: 0.2 },
                { desc: 'Cold', temp: 58, chance: 0.15 }
            ],
            summer: [
                { desc: 'Hot', temp: 105, chance: 0.4 },
                { desc: 'Sunny', temp: 102, chance: 0.3 },
                { desc: 'Haze', temp: 98, chance: 0.2 },
                { desc: 'Thunderstorm', temp: 95, chance: 0.1 }
            ],
            spring: [
                { desc: 'Sunny', temp: 85, chance: 0.35 },
                { desc: 'Clear Skies', temp: 88, chance: 0.3 },
                { desc: 'Hot', temp: 92, chance: 0.2 },
                { desc: 'Partly Cloudy', temp: 82, chance: 0.15 }
            ]
        },
        'tokyo': {
            winter: [
                { desc: 'Clear Skies', temp: 45, chance: 0.4 },
                { desc: 'Sunny', temp: 48, chance: 0.3 },
                { desc: 'Cloudy', temp: 42, chance: 0.2 },
                { desc: 'Cold', temp: 38, chance: 0.1 }
            ],
            summer: [
                { desc: 'Hot', temp: 85, chance: 0.3 },
                { desc: 'Partly Cloudy', temp: 82, chance: 0.25 },
                { desc: 'Rain', temp: 78, chance: 0.25 },
                { desc: 'Thunderstorm', temp: 80, chance: 0.2 }
            ],
            spring: [
                { desc: 'Sunny', temp: 68, chance: 0.35 },
                { desc: 'Partly Cloudy', temp: 65, chance: 0.3 },
                { desc: 'Light Rain', temp: 62, chance: 0.2 },
                { desc: 'Clear Skies', temp: 70, chance: 0.15 }
            ]
        },
        'paris': {
            winter: [
                { desc: 'Cloudy', temp: 43, chance: 0.35 },
                { desc: 'Light Rain', temp: 40, chance: 0.25 },
                { desc: 'Overcast', temp: 46, chance: 0.25 },
                { desc: 'Cold', temp: 37, chance: 0.15 }
            ],
            summer: [
                { desc: 'Sunny', temp: 75, chance: 0.35 },
                { desc: 'Partly Cloudy', temp: 72, chance: 0.3 },
                { desc: 'Clear Skies', temp: 78, chance: 0.2 },
                { desc: 'Light Rain', temp: 68, chance: 0.15 }
            ],
            spring: [
                { desc: 'Partly Cloudy', temp: 62, chance: 0.3 },
                { desc: 'Light Rain', temp: 58, chance: 0.25 },
                { desc: 'Sunny', temp: 66, chance: 0.25 },
                { desc: 'Cloudy', temp: 60, chance: 0.2 }
            ]
        },
        'sydney': {
            winter: [
                { desc: 'Sunny', temp: 65, chance: 0.4 },
                { desc: 'Partly Cloudy', temp: 62, chance: 0.3 },
                { desc: 'Clear Skies', temp: 68, chance: 0.2 },
                { desc: 'Light Rain', temp: 58, chance: 0.1 }
            ],
            summer: [
                { desc: 'Hot', temp: 85, chance: 0.35 },
                { desc: 'Sunny', temp: 82, chance: 0.3 },
                { desc: 'Partly Cloudy', temp: 78, chance: 0.2 },
                { desc: 'Clear Skies', temp: 88, chance: 0.15 }
            ],
            spring: [
                { desc: 'Sunny', temp: 72, chance: 0.35 },
                { desc: 'Partly Cloudy', temp: 68, chance: 0.3 },
                { desc: 'Light Rain', temp: 65, chance: 0.2 },
                { desc: 'Clear Skies', temp: 75, chance: 0.15 }
            ]
        }
    };
    
    // Default pattern for unknown cities
    const defaultPattern = {
        winter: [
            { desc: 'Cloudy', temp: 45, chance: 0.3 },
            { desc: 'Sunny', temp: 50, chance: 0.25 },
            { desc: 'Light Rain', temp: 42, chance: 0.25 },
            { desc: 'Overcast', temp: 48, chance: 0.2 }
        ],
        summer: [
            { desc: 'Sunny', temp: 78, chance: 0.4 },
            { desc: 'Partly Cloudy', temp: 75, chance: 0.3 },
            { desc: 'Hot', temp: 85, chance: 0.2 },
            { desc: 'Clear Skies', temp: 80, chance: 0.1 }
        ],
        spring: [
            { desc: 'Partly Cloudy', temp: 68, chance: 0.3 },
            { desc: 'Sunny', temp: 72, chance: 0.25 },
            { desc: 'Light Rain', temp: 62, chance: 0.25 },
            { desc: 'Clear Skies', temp: 75, chance: 0.2 }
        ]
    };
    
    const cityPattern = cityPatterns[cityKey] || defaultPattern;
    
    // Determine season
    let season = 'spring';
    if (isWinter) season = 'winter';
    else if (isSummer) season = 'summer';
    
    // For Southern Hemisphere cities, flip seasons
    const southernCities = ['sydney', 'melbourne'];
    if (southernCities.includes(cityKey)) {
        if (season === 'winter') season = 'summer';
        else if (season === 'summer') season = 'winter';
    }
    
    return cityPattern[season] || cityPattern.spring;
}

// Generate city-specific weather data
function generateDemoWeatherData(cityName) {
    const now = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Get city-specific weather pattern
    const weatherPattern = getCityWeatherPattern(cityName);
    
    console.log(`🌤️ Generating weather for ${cityName}:`, weatherPattern);
    
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
        
        // Select weather condition based on weighted probability
        let selectedCondition;
        const random = Math.random();
        let cumulativeProbability = 0;
        
        for (const condition of weatherPattern) {
            cumulativeProbability += condition.chance;
            if (random <= cumulativeProbability) {
                selectedCondition = condition;
                break;
            }
        }
        
        // Fallback to first condition if none selected
        if (!selectedCondition) {
            selectedCondition = weatherPattern[0];
        }
        
        // Add some daily variation
        const tempVariation = Math.round(Math.random() * 8 - 4); // ±4°F variation
        
        days.push({
            day: dayLabel,
            temperature: selectedCondition.temp + tempVariation,
            description: selectedCondition.desc,
            icon: getWeatherIcon(selectedCondition.desc)
        });
    }
    
    return days;
}

// Create weather ticker content
function createWeatherTicker(weatherData, cityName) {
    const weatherScroll = document.getElementById('weatherScroll');
    
    // Clear existing content
    weatherScroll.innerHTML = '';
    
    // Get location data for this city
    const locationData = generateLocationData(cityName);
    const formattedLocation = `${cityName}, ${locationData.state} ${locationData.country} ${locationData.zip}`;
    
    // Helper function to create weather content block
    function createWeatherContent() {
        const contentBlock = document.createElement('div');
        contentBlock.style.display = 'inline-flex';
        contentBlock.style.alignItems = 'center';
        
        // Add formatted location at the start
        const startSeparator = document.createElement('div');
        startSeparator.className = 'weather-separator';
        startSeparator.innerHTML = `<span class="city-separator">-- ${formattedLocation} --</span>`;
        contentBlock.appendChild(startSeparator);
        
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
            
            contentBlock.appendChild(weatherDay);
            
            // Add formatted location separator after each weather item
            const separator = document.createElement('div');
            separator.className = 'weather-separator';
            separator.innerHTML = `<span class="city-separator">-- ${formattedLocation} --</span>`;
            contentBlock.appendChild(separator);
        });
        
        return contentBlock;
    }
    
    // Create chain of 20 weather text strings for long continuous scroll
    for (let i = 0; i < 20; i++) {
        weatherScroll.appendChild(createWeatherContent());
    }
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
    
    // Start matrix effects (only if not mobile)
    if (!isMobileDevice) {
        initParticles();
    }
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
    
    // Start warp effects (only if not mobile)
    if (!isMobileDevice) {
        initWarpSpeed();
    }
    
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
    
    // Start Thor effects (only if not mobile)
    if (!isMobileDevice) {
        initThorEffects();
    }
    
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

function createLokiTrick(clickX, clickY) {
    // Prevent multiple Loki tricks
    if (lokiTrickActive) {
        console.log('Loki is already causing mischief, skipping...');
        return;
    }
    
    console.log('Loki\'s trickery begins...', clickX, clickY);
    lokiTrickActive = true;
    
    // Loki's shapeshifting symbols with different characteristics
    const lokiShapes = [
        { symbol: '🐴', name: 'Mare', speed: 12 },      // Medium speed - Sleipnir's mother
        { symbol: '🐟', name: 'Salmon', speed: 18 },    // Fast - slippery like Loki
        { symbol: '🪰', name: 'Fly', speed: 25 },       // Fastest - small and quick
        { symbol: '👵', name: 'Crone', speed: 8 },      // Slowest - wise but careful
        { symbol: '🦊', name: 'Fox', speed: 15 }        // Medium-fast - cunning and quick
    ];
    
    const shape = lokiShapes[Math.floor(Math.random() * lokiShapes.length)];
    
    const lokiTrickster = document.createElement('div');
    lokiTrickster.className = 'loki-trickster';
    lokiTrickster.innerHTML = shape.symbol;
    
    // Starting position at click location
    lokiTrickster.style.position = 'fixed';
    lokiTrickster.style.left = clickX + 'px';
    lokiTrickster.style.top = clickY + 'px';
    lokiTrickster.style.fontSize = '100px';
    lokiTrickster.style.zIndex = '10000';
    lokiTrickster.style.filter = 'brightness(1.4) drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 40px #ffff00)';
    lokiTrickster.style.textShadow = '0 0 25px #ffd700, 0 0 50px #ffff00';
    lokiTrickster.style.transition = 'none';
    
    document.body.appendChild(lokiTrickster);
    
    // Get viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Starting velocity - match UFO speed (ignore shape-specific speeds)
    let vx = (Math.random() - 0.5) * 25;
    let vy = (Math.random() - 0.5) * 25;
    
    // Ensure significant movement - match UFO speed
    if (Math.abs(vx) < 10) vx = vx > 0 ? 10 : -10;
    if (Math.abs(vy) < 10) vy = vy > 0 ? 10 : -10;
    
    let currentX = clickX;
    let currentY = clickY;
    let bounces = 0;
    const maxBounces = 4; // Loki is trickier - more bounces
    
    function animateLokiTrick() {
        currentX += vx;
        currentY += vy;
        
        // Loki bounces off the walls of Asgard
        if (currentX <= 0 || currentX >= vw - 100) {
            vx = -vx;
            currentX = Math.max(0, Math.min(currentX, vw - 100));
            bounces++;
        }
        
        if (currentY <= 0 || currentY >= vh - 100) {
            vy = -vy;
            currentY = Math.max(0, Math.min(currentY, vh - 100));
            bounces++;
        }
        
        lokiTrickster.style.left = currentX + 'px';
        lokiTrickster.style.top = currentY + 'px';
        
        if (bounces < maxBounces) {
            requestAnimationFrame(animateLokiTrick);
        } else {
            // Loki vanishes into the void
            const exitDirection = getLokiExitDirection(currentX, currentY, vw, vh);
            
            lokiTrickster.style.transition = 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            setTimeout(() => {
                lokiTrickster.style.transform = `translate(${exitDirection.x}px, ${exitDirection.y}px) scale(0.1)`;
                lokiTrickster.style.opacity = '0';
                lokiTrickster.style.filter = 'brightness(1.4) drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 40px #ffff00) blur(5px)';
            }, 50);
            
            setTimeout(() => {
                if (lokiTrickster.parentNode) {
                    lokiTrickster.remove();
                }
                lokiTrickActive = false; // Allow new Loki tricks
            }, 2500);
        }
    }
    
    function getLokiExitDirection(x, y, vw, vh) {
        const distToLeft = x;
        const distToRight = vw - x;
        const distToTop = y;
        const distToBottom = vh - y;
        
        const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
        
        if (minDist === distToLeft) {
            return { x: -600, y: 0 }; // Vanish left
        } else if (minDist === distToRight) {
            return { x: 600, y: 0 }; // Vanish right
        } else if (minDist === distToTop) {
            return { x: 0, y: -600 }; // Vanish up
        } else {
            return { x: 0, y: 600 }; // Vanish down
        }
    }
    
    animateLokiTrick();
}

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
    
    // Clean up - allow enough time for full animation completion
    setTimeout(() => {
        document.querySelectorAll('.simple-matrix-pill').forEach(pill => {
            if (pill.parentNode) pill.remove();
        });
    }, 5000); // Extended to 5 seconds to ensure both pills complete their animations
}

function createWhiteRabbit(clickX, clickY) {
    // Prevent multiple rabbits
    if (whiteRabbitActive) {
        console.log('White rabbit already active, skipping...');
        return;
    }
    
    console.log('Follow the white rabbit...', clickX, clickY);
    whiteRabbitActive = true;
    
    const rabbit = document.createElement('div');
    rabbit.className = 'white-rabbit';
    rabbit.innerHTML = '🐰';
    
    // Starting position at click location
    rabbit.style.position = 'fixed';
    rabbit.style.left = clickX + 'px';
    rabbit.style.top = clickY + 'px';
    rabbit.style.fontSize = '120px';
    rabbit.style.zIndex = '10000';
    rabbit.style.filter = 'brightness(2) drop-shadow(0 0 20px white) drop-shadow(0 0 40px white)';
    rabbit.style.textShadow = '0 0 30px white, 0 0 60px white';
    rabbit.style.transition = 'none'; // Remove transition for manual control
    
    document.body.appendChild(rabbit);
    
    // Get viewport dimensions
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Starting velocity (pixels per frame) - match UFO speed
    let vx = (Math.random() - 0.5) * 25; // Random horizontal velocity
    let vy = (Math.random() - 0.5) * 25; // Random vertical velocity
    
    // Make sure velocity is significant - match UFO speed
    if (Math.abs(vx) < 10) vx = vx > 0 ? 10 : -10;
    if (Math.abs(vy) < 10) vy = vy > 0 ? 10 : -10;
    
    let currentX = clickX;
    let currentY = clickY;
    let bounces = 0;
    const maxBounces = 4; // Two complete bounces (4 wall hits)
    
    function animateRabbit() {
        // Update position
        currentX += vx;
        currentY += vy;
        
        // Check for wall collisions and bounce
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
        
        // Update rabbit position
        rabbit.style.left = currentX + 'px';
        rabbit.style.top = currentY + 'px';
        
        // Continue bouncing until we hit max bounces
        if (bounces < maxBounces) {
            requestAnimationFrame(animateRabbit);
        } else {
            // After bouncing, exit toward nearest edge
            const exitDirection = getExitDirection(currentX, currentY, vw, vh);
            
            // Transition to exit animation
            rabbit.style.transition = 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            setTimeout(() => {
                rabbit.style.transform = `translate(${exitDirection.x}px, ${exitDirection.y}px) scale(0.3)`;
                rabbit.style.opacity = '0';
                rabbit.style.filter = 'brightness(2) drop-shadow(0 0 20px white) drop-shadow(0 0 40px white) blur(4px)';
            }, 50);
            
            // Clean up
            setTimeout(() => {
                if (rabbit.parentNode) {
                    rabbit.remove();
                }
                whiteRabbitActive = false; // Allow new rabbits
            }, 2500);
        }
    }
    
    // Helper function to determine exit direction
    function getExitDirection(x, y, vw, vh) {
        const distToLeft = x;
        const distToRight = vw - x;
        const distToTop = y;
        const distToBottom = vh - y;
        
        const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
        
        if (minDist === distToLeft) {
            return { x: -500, y: 0 }; // Exit left
        } else if (minDist === distToRight) {
            return { x: 500, y: 0 }; // Exit right
        } else if (minDist === distToTop) {
            return { x: 0, y: -500 }; // Exit top
        } else {
            return { x: 0, y: 500 }; // Exit bottom
        }
    }
    
    // Start the bouncing animation
    animateRabbit();
}

// Global click handler
function handleGlobalClick(event) {
    console.log('Global click detected! Current theme:', currentTheme);
    
    // Don't trigger on theme selector clicks
    if (event.target.closest('.theme-selector')) {
        console.log('Theme selector clicked, ignoring');
        return;
    }
    
    // Don't trigger on timezone container clicks
    if (event.target.closest('.timezone-container')) {
        console.log('Timezone panel clicked, ignoring');
        return;
    }
    
    // Don't trigger on weather tracker clicks
    if (event.target.closest('.weather-ticker')) {
        console.log('Weather tracker clicked, ignoring');
        return;
    }
    
    // Don't trigger on weather search panel clicks
    if (event.target.closest('.city-input-container')) {
        console.log('Weather search panel clicked, ignoring');
        return;
    }
    
    // Don't trigger on interactive elements (inputs, buttons, sliders)
    if (event.target.matches('input, button, select, textarea, [contenteditable]') || 
        event.target.closest('input, button, select, textarea, [contenteditable]')) {
        console.log('Interactive element clicked, ignoring');
        return;
    }
    
    // Get click coordinates
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    console.log('Processing click at:', clickX, clickY, 'Theme:', currentTheme);
    
    if (currentTheme === 'thor') {
        const randomValue = Math.random();
        if (randomValue < 0.25) {
            console.log('Loki causes mischief...');
            createLokiTrick(clickX, clickY);
        } else if (randomValue < 0.30) {
            console.log('Mjolnir strikes...');
            createMjolnirStrike(clickX, clickY);
        } else {
            console.log('Triggering Thor lightning');
            createLightningFlash(clickX, clickY);
        }
    } else if (currentTheme === 'lcars') {
        // 25% chance to show UFO/Galaxy, 75% chance for photon torpedoes
        if (Math.random() < 0.25) {
            console.log('Engage! Star Trek flyby...');
            createStarTrekFlyby(clickX, clickY);
        } else {
            console.log('Triggering LCARS photon torpedoes');
            createKlingonFlyby(clickX, clickY);
        }
    } else if (currentTheme === 'matrix') {
        // 20% chance to show white rabbit, 80% chance for pills
        if (Math.random() < 0.2) {
            console.log('Follow the white rabbit...');
            createWhiteRabbit(clickX, clickY);
        } else {
            console.log('Triggering Matrix pills');
            createPillFlyby(clickX, clickY);
        }
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