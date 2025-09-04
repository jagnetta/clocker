// Global variables
let currentTimezoneOffset = 0;
let particles = [];
let currentTheme = 'matrix';
let matrixKanjiInterval;
let isMobileDevice = false;

// Use timezone data from timezones.js - create compatibility layer
let currentTimezoneIndex = 0;

// Create timezone offset map from the global timezones array for backward compatibility
function createTimezoneOffsetMap() {
    const offsetMap = {};
    if (typeof timezones === 'undefined') {
        console.error('timezones array not loaded from timezones.js');
        return {};
    }
    
    timezones.forEach((tz, index) => {
        // Parse offset string like "UTC-05:00" or "UTC+09:30"
        const offsetStr = tz.offset.replace('UTC', '');
        let offset;
        
        if (offsetStr.includes(':')) {
            const [hours, minutes] = offsetStr.split(':');
            offset = parseFloat(hours) + (parseFloat(minutes) / 60) * Math.sign(parseFloat(hours));
        } else {
            offset = parseFloat(offsetStr);
        }
        
        // Store with both string and numeric keys for compatibility
        const key = offset.toString();
        offsetMap[key] = {
            name: tz.abbreviation,
            label: tz.name,
            dst: false, // Simplified implementation
            index: index,
            offset: offset
        };
    });
    return offsetMap;
}

// Initialize timezone data when DOM loads
let timezoneOffsetMap = {};
document.addEventListener('DOMContentLoaded', function() {
    timezoneOffsetMap = createTimezoneOffsetMap();
    if (Object.keys(timezoneOffsetMap).length === 0) {
        console.warn('No timezone data loaded, using fallback');
        // Fallback for testing
        timezoneOffsetMap = {
            '0': { name: 'GMT', label: 'Greenwich Mean Time', dst: false, index: 0, offset: 0 }
        };
    }
});

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
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
    
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

// Get current timezone info with DST consideration from timezones.js data
function getTimezoneInfo(date, offset) {
    // Use the current timezone from the slider if available
    if (typeof timezones !== 'undefined' && timezones[currentTimezoneIndex]) {
        const selectedTz = timezones[currentTimezoneIndex];
        
        // Check if DST is currently active and return correct abbreviation
        if (selectedTz.daylightSaving.observesDST && isDSTActiveForTimezone(date, selectedTz)) {
            return {
                name: selectedTz.daylightSaving.dstAbbreviation,
                label: selectedTz.name,
                isDST: true,
                offset: offset
            };
        } else {
            return {
                name: selectedTz.abbreviation,
                label: selectedTz.name,
                isDST: false,
                offset: offset
            };
        }
    }
    
    // Fallback to offset-based lookup if timezones.js not available
    const timezoneInfo = timezoneOffsetMap[offset.toString()];
    if (!timezoneInfo) {
        return { name: 'UTC', label: 'Coordinated Universal Time', isDST: false, offset: 0 };
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
    
    // Use timezone from the array if available
    if (typeof timezones !== 'undefined' && timezones[currentTimezoneIndex]) {
        const selectedTz = timezones[currentTimezoneIndex];
        const now = new Date();
        
        // Determine if DST is active and get correct offset/abbreviation
        let effectiveOffset = selectedTz.offset;
        let effectiveAbbrev = selectedTz.abbreviation;
        let dstIndicator = '';
        
        if (selectedTz.daylightSaving.observesDST && isDSTActiveForTimezone(now, selectedTz)) {
            effectiveOffset = selectedTz.daylightSaving.dstOffset;
            effectiveAbbrev = selectedTz.daylightSaving.dstAbbreviation;
            dstIndicator = ' ☀️ DST';
        }
        
        // Check if this is the browser's detected timezone
        const browserOffset = detectBrowserTimezone();
        const isLocalTime = Math.abs(currentTimezoneOffset - browserOffset) < 0.1;
        const localIndicator = isLocalTime ? ' 🏠 LOCAL' : '';
        
        display.textContent = `${effectiveOffset} (${effectiveAbbrev}) - ${selectedTz.name}${dstIndicator}${localIndicator}`;
    } else {
        // Fallback to old method
        const now = getTimezoneDate();
        const timezoneInfo = getTimezoneInfo(now, currentTimezoneOffset);
        
        let offsetStr;
        if (currentTimezoneOffset === 0) {
            offsetStr = 'UTC±0';
        } else if (currentTimezoneOffset > 0) {
            offsetStr = `UTC+${currentTimezoneOffset}`;
        } else {
            offsetStr = `UTC${currentTimezoneOffset}`;
        }
        
        display.textContent = `${offsetStr} (${timezoneInfo.name}) - ${timezoneInfo.label}`;
    }
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

// Timezone slider initialization - using discrete positions from timezones.js
function initTimezoneSlider() {
    const slider = document.getElementById('timezoneSlider');
    if (!slider) return;
    
    // Auto-detect browser timezone and find closest match
    const detectedOffset = detectBrowserTimezone();
    const browserTZ = getBrowserTimezoneName();
    
    // Find and select the closest timezone from the array
    let closestIndex = 0;
    let minDifference = Infinity;
    let exactMatch = false;
    
    if (typeof timezones !== 'undefined' && Array.isArray(timezones)) {
        // First try to find exact timezone match by name
        const browserTZName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date();
        
        timezones.forEach((tz, index) => {
            // Check for timezone name matches (common patterns)
            if (browserTZName && !exactMatch) {
                const tzNameLower = tz.name.toLowerCase();
                const browserNameLower = browserTZName.toLowerCase();
                
                // Direct name matching
                if (browserNameLower.includes('new_york') && tzNameLower.includes('eastern') ||
                    browserNameLower.includes('chicago') && tzNameLower.includes('central') ||
                    browserNameLower.includes('denver') && tzNameLower.includes('mountain') ||
                    browserNameLower.includes('los_angeles') && tzNameLower.includes('pacific') ||
                    browserNameLower.includes('london') && tzNameLower.includes('greenwich') ||
                    browserNameLower.includes('paris') && tzNameLower.includes('central european') ||
                    browserNameLower.includes('tokyo') && tzNameLower.includes('japan') ||
                    browserNameLower.includes('sydney') && tzNameLower.includes('australian eastern') ||
                    browserNameLower.includes('india') && tzNameLower.includes('indian')) {
                    closestIndex = index;
                    exactMatch = true;
                    return;
                }
            }
            
            // Calculate current effective offset for this timezone (including DST)
            let effectiveOffset = tz.offset;
            if (tz.daylightSaving.observesDST && isDSTActiveForTimezone(now, tz)) {
                effectiveOffset = tz.daylightSaving.dstOffset;
            }
            
            const offsetStr = effectiveOffset.replace('UTC', '');
            let offset;
            
            if (offsetStr.includes(':')) {
                const [hours, minutes] = offsetStr.split(':');
                offset = parseFloat(hours) + (parseFloat(minutes) / 60) * Math.sign(parseFloat(hours));
            } else {
                offset = parseFloat(offsetStr);
            }
            
            const difference = Math.abs(offset - detectedOffset);
            if (difference < minDifference && !exactMatch) {
                minDifference = difference;
                closestIndex = index;
            }
        });
    }
    
    // Set slider to closest timezone index
    currentTimezoneIndex = closestIndex;
    slider.value = closestIndex;
    
    // Update offset for backward compatibility
    updateCurrentTimezoneFromIndex();
    
    console.log(`🌐 Browser timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
    console.log(`⏰ Detected offset: UTC${detectedOffset >= 0 ? '+' : ''}${detectedOffset}`);
    console.log(`🎯 Selected timezone: ${timezones[closestIndex]?.name} (${exactMatch ? 'exact match' : 'closest match'})`);
    console.log(`🎚️ Slider position: ${closestIndex}`);
    
    updateTimezoneDisplay();
    updateClock();
    
    // Add event listener for slider changes
    slider.addEventListener('input', function() {
        currentTimezoneIndex = parseInt(this.value);
        updateCurrentTimezoneFromIndex();
        updateTimezoneDisplay();
        updateClock();
    });
    
    // Add mouse wheel support for timezone adjustment
    const timezoneContainer = document.querySelector('.timezone-container');
    if (timezoneContainer) {
        timezoneContainer.addEventListener('wheel', function(event) {
            event.preventDefault(); // Prevent page scrolling
            
            const currentValue = parseInt(slider.value);
            const minValue = parseInt(slider.min);
            const maxValue = parseInt(slider.max);
            
            // Determine direction (negative deltaY = scroll up = increase timezone index)
            const direction = event.deltaY < 0 ? 1 : -1;
            const newValue = currentValue + direction;
            
            // Clamp to slider bounds
            const clampedValue = Math.max(minValue, Math.min(maxValue, newValue));
            
            if (clampedValue !== currentValue) {
                slider.value = clampedValue;
                currentTimezoneIndex = clampedValue;
                updateCurrentTimezoneFromIndex();
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

// Helper function to update currentTimezoneOffset from currentTimezoneIndex
function updateCurrentTimezoneFromIndex() {
    if (typeof timezones === 'undefined' || !timezones[currentTimezoneIndex]) {
        currentTimezoneOffset = 0;
        return;
    }
    
    const selectedTz = timezones[currentTimezoneIndex];
    const now = new Date();
    
    // Check if DST is currently active for this timezone
    let effectiveOffset = selectedTz.offset;
    if (selectedTz.daylightSaving.observesDST && isDSTActiveForTimezone(now, selectedTz)) {
        effectiveOffset = selectedTz.daylightSaving.dstOffset;
    }
    
    // Parse the offset string
    const offsetStr = effectiveOffset.replace('UTC', '');
    if (offsetStr.includes(':')) {
        const [hours, minutes] = offsetStr.split(':');
        currentTimezoneOffset = parseFloat(hours) + (parseFloat(minutes) / 60) * Math.sign(parseFloat(hours));
    } else {
        currentTimezoneOffset = parseFloat(offsetStr);
    }
}

// Check if DST is currently active for a specific timezone
function isDSTActiveForTimezone(date, timezone) {
    if (!timezone.daylightSaving.observesDST) {
        return false;
    }
    
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-11
    
    // Get the timezone's base offset for DST calculation
    const baseOffsetStr = timezone.offset.replace('UTC', '');
    let baseOffset;
    if (baseOffsetStr.includes(':')) {
        const [hours, minutes] = baseOffsetStr.split(':');
        baseOffset = parseFloat(hours) + (parseFloat(minutes) / 60) * Math.sign(parseFloat(hours));
    } else {
        baseOffset = parseFloat(baseOffsetStr);
    }
    
    // Create date in the timezone's local time for DST calculation
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const localDate = new Date(utc + (baseOffset * 3600000));
    const localMonth = localDate.getMonth();
    
    // Determine DST rules based on timezone location
    if (timezone.abbreviation.includes('ST') || timezone.abbreviation.includes('DT')) {
        // North American timezones: Second Sunday in March to First Sunday in November
        if (timezone.abbreviation === 'HST' || timezone.abbreviation === 'AKST' || 
            timezone.abbreviation === 'PST' || timezone.abbreviation === 'MST' || 
            timezone.abbreviation === 'CST' || timezone.abbreviation === 'EST' ||
            timezone.abbreviation === 'AST' || timezone.abbreviation === 'NST') {
            return (localMonth > 2 && localMonth < 10) || 
                   (localMonth === 2 && getSecondSunday(year, 3) <= localDate.getDate()) ||
                   (localMonth === 10 && getFirstSunday(year, 11) > localDate.getDate());
        }
    }
    
    // European timezones: Last Sunday in March to Last Sunday in October
    if (timezone.abbreviation === 'GMT' || timezone.abbreviation === 'CET' || 
        timezone.abbreviation === 'EET' || timezone.abbreviation === 'AZOT') {
        return (localMonth > 2 && localMonth < 9) || 
               (localMonth === 2 && getLastSunday(year, 3) <= localDate.getDate()) ||
               (localMonth === 9 && getLastSunday(year, 10) > localDate.getDate());
    }
    
    // Australian timezones: First Sunday in October to First Sunday in April
    if (timezone.abbreviation === 'ACST' || timezone.abbreviation === 'AEST' || 
        timezone.abbreviation === 'LHDT' || timezone.abbreviation === 'NZST' || 
        timezone.abbreviation === 'CHAST') {
        return (localMonth > 9 || localMonth < 3) ||
               (localMonth === 9 && getFirstSunday(year, 10) <= localDate.getDate()) ||
               (localMonth === 3 && getFirstSunday(year, 4) > localDate.getDate());
    }
    
    // Iran: March 22 to September 22 (approximate)
    if (timezone.abbreviation === 'IRST') {
        return localMonth > 2 && localMonth < 8;
    }
    
    return false;
}

// Helper functions for DST date calculations
function getFirstSunday(year, month) {
    const date = new Date(year, month - 1, 1);
    const dayOfWeek = date.getDay();
    return 1 + (7 - dayOfWeek) % 7;
}

function getSecondSunday(year, month) {
    return getFirstSunday(year, month) + 7;
}

function getLastSunday(year, month) {
    const date = new Date(year, month, 0); // Last day of the month
    const dayOfWeek = date.getDay();
    return date.getDate() - dayOfWeek;
}

// Keyboard shortcuts
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

// Add screen shake function
function addScreenShake() {
    // Matrix shake is already defined in the CSS
}

// Mobile device detection
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
    if (desc.includes('snow') || desc.includes('blizzard')) return weatherIcons.snow;
    if (desc.includes('sleet')) return weatherIcons.sleet;
    if (desc.includes('thunder') || desc.includes('storm')) return weatherIcons.thunderstorm;
    if (desc.includes('fog') || desc.includes('mist')) return weatherIcons.fog;
    if (desc.includes('wind')) return weatherIcons.wind;
    
    return weatherIcons.default;
}

// Convert Kelvin to Fahrenheit
function kelvinToFahrenheit(kelvin) {
    return Math.round((kelvin - 273.15) * 9/5 + 32);
}

// Generate location data for demo weather
function generateLocationData(cityName) {
    // Hash function to generate consistent but pseudo-random data
    let hash = 0;
    for (let i = 0; i < cityName.length; i++) {
        const char = cityName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use hash to generate consistent coordinates
    const lat = (Math.abs(hash) % 17000) / 100 - 85; // -85 to 85
    const lon = ((Math.abs(hash * 3) % 36000) / 100) - 180; // -180 to 180
    
    return {
        latitude: Math.round(lat * 100) / 100,
        longitude: Math.round(lon * 100) / 100
    };
}

// Get city weather pattern for consistent demo data
function getCityWeatherPattern(cityName) {
    const patterns = {
        // Common city weather patterns
        'london': { temp: 285, desc: 'Overcast clouds', humidity: 75, pattern: 'cloudy' },
        'paris': { temp: 288, desc: 'Partly cloudy', humidity: 65, pattern: 'mixed' },
        'new york': { temp: 290, desc: 'Clear sky', humidity: 60, pattern: 'clear' },
        'tokyo': { temp: 292, desc: 'Light rain', humidity: 80, pattern: 'rainy' },
        'sydney': { temp: 295, desc: 'Sunny', humidity: 55, pattern: 'sunny' },
        'berlin': { temp: 286, desc: 'Few clouds', humidity: 70, pattern: 'mixed' },
        'moscow': { temp: 278, desc: 'Snow', humidity: 85, pattern: 'cold' },
        'mumbai': { temp: 303, desc: 'Thunderstorm', humidity: 90, pattern: 'tropical' },
        'cairo': { temp: 308, desc: 'Clear sky', humidity: 30, pattern: 'desert' },
        'reykjavik': { temp: 275, desc: 'Overcast clouds', humidity: 80, pattern: 'cold' },
        'miami': { temp: 298, desc: 'Partly cloudy', humidity: 75, pattern: 'tropical' },
        'vancouver': { temp: 283, desc: 'Light rain', humidity: 78, pattern: 'rainy' },
        'dubai': { temp: 313, desc: 'Clear sky', humidity: 45, pattern: 'desert' },
        'singapore': { temp: 301, desc: 'Thunderstorm', humidity: 85, pattern: 'tropical' },
        'stockholm': { temp: 280, desc: 'Snow', humidity: 82, pattern: 'cold' },
        'los angeles': { temp: 295, desc: 'Clear sky', humidity: 50, pattern: 'sunny' },
        'chicago': { temp: 285, desc: 'Overcast clouds', humidity: 68, pattern: 'mixed' },
        'toronto': { temp: 282, desc: 'Light snow', humidity: 75, pattern: 'cold' },
        'rio de janeiro': { temp: 299, desc: 'Partly cloudy', humidity: 70, pattern: 'tropical' },
        'amsterdam': { temp: 287, desc: 'Drizzle', humidity: 78, pattern: 'rainy' }
    };
    
    return patterns[cityName.toLowerCase()] || null;
}

// Generate demo weather data
function generateDemoWeatherData(cityName) {
    const now = new Date();
    const hour = now.getHours();
    const season = Math.floor((now.getMonth() % 12) / 3); // 0=winter, 1=spring, 2=summer, 3=fall
    
    // Try to get city-specific pattern first
    let cityPattern = getCityWeatherPattern(cityName);
    
    if (!cityPattern) {
        // Generate based on city name hash for consistency
        let hash = 0;
        for (let i = 0; i < cityName.length; i++) {
            const char = cityName.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        const patternTypes = ['sunny', 'cloudy', 'rainy', 'mixed', 'cold', 'tropical', 'desert'];
        const patternIndex = Math.abs(hash) % patternTypes.length;
        const pattern = patternTypes[patternIndex];
        
        // Base temperature varies by pattern and season
        const baseTemps = {
            'sunny': [285, 290, 300, 292], // by season
            'cloudy': [280, 285, 295, 287],
            'rainy': [278, 283, 290, 285],
            'mixed': [282, 287, 297, 289],
            'cold': [265, 275, 285, 278],
            'tropical': [295, 298, 305, 300],
            'desert': [288, 303, 318, 305]
        };
        
        // Weather descriptions by pattern
        const descriptions = {
            'sunny': ['Clear sky', 'Sunny', 'Few clouds'],
            'cloudy': ['Overcast clouds', 'Cloudy', 'Broken clouds'],
            'rainy': ['Light rain', 'Moderate rain', 'Drizzle', 'Showers'],
            'mixed': ['Partly cloudy', 'Scattered clouds', 'Few clouds'],
            'cold': ['Snow', 'Light snow', 'Overcast clouds', 'Fog'],
            'tropical': ['Thunderstorm', 'Heavy rain', 'Partly cloudy', 'Humid'],
            'desert': ['Clear sky', 'Hot', 'Dusty', 'Sunny']
        };
        
        const baseTemp = baseTemps[pattern][season];
        const tempVariation = (Math.abs(hash * 7) % 20) - 10; // -10 to +10
        const temp = baseTemp + tempVariation;
        
        const descIndex = Math.abs(hash * 3) % descriptions[pattern].length;
        const desc = descriptions[pattern][descIndex];
        
        const humidityBase = {
            'sunny': 50, 'cloudy': 70, 'rainy': 85, 'mixed': 60,
            'cold': 80, 'tropical': 85, 'desert': 25
        };
        
        const humidity = humidityBase[pattern] + ((Math.abs(hash * 5) % 30) - 15);
        
        cityPattern = { temp, desc, humidity: Math.max(10, Math.min(95, humidity)), pattern };
    }
    
    // Add time-based variations
    let { temp, desc, humidity } = cityPattern;
    
    // Night is typically cooler
    if (hour < 6 || hour > 20) {
        temp -= 5;
    }
    
    // Add some daily variation
    const dayHash = Math.abs((cityName + now.getDate()).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0));
    
    temp += (dayHash % 8) - 4; // -4 to +4 degree variation
    
    const location = generateLocationData(cityName);
    
    return {
        coord: location,
        weather: [{ description: desc }],
        main: {
            temp: temp,
            humidity: Math.max(10, Math.min(95, humidity + ((dayHash % 20) - 10)))
        },
        name: cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase()
    };
}

// Create weather ticker display
function createWeatherTicker(weatherData, cityName) {
    const icon = getWeatherIcon(weatherData.weather[0].description);
    const tempF = kelvinToFahrenheit(weatherData.main.temp);
    const coords = `${weatherData.coord.latitude}°, ${weatherData.coord.longitude}°`;
    
    return `
        <div class="weather-item">
            <span class="weather-icon">${icon}</span>
            <span class="weather-city">${weatherData.name}</span>
            <span class="weather-temp">${tempF}°F</span>
            <span class="weather-desc">${weatherData.weather[0].description}</span>
            <span class="weather-humidity">💧${weatherData.main.humidity}%</span>
            <span class="weather-coords">📍${coords}</span>
        </div>
    `;
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
    const resetButton = document.getElementById('resetWeather');
    resetButton.addEventListener('click', function() {
        const weatherTicker = document.getElementById('weatherTicker');
        weatherTicker.innerHTML = '';
        weatherTicker.classList.add('hidden');
        cityInput.value = '';
        console.log('🌦️ Weather data cleared');
    });
}

// Handle weather request (simplified for demo)
function handleWeatherRequest() {
    const cityInput = document.getElementById('cityInput');
    const cityName = cityInput.value.trim();
    
    if (!cityName) {
        alert('Please enter a city name');
        return;
    }
    
    console.log(`🌦️ Fetching weather for: ${cityName}`);
    
    // Generate demo data
    const weatherData = generateDemoWeatherData(cityName);
    const weatherTicker = document.getElementById('weatherTicker');
    
    weatherTicker.innerHTML = createWeatherTicker(weatherData, cityName);
    weatherTicker.classList.remove('hidden');
    
    cityInput.value = ''; // Clear input
}

// Matrix theme functions
function switchToMatrixTheme() {
    currentTheme = 'matrix';
    document.body.classList.remove('lcars-theme', 'thor-theme');
    
    // Show matrix background
    document.getElementById('matrixBg').classList.remove('hidden');
    
    // Start matrix effects (only if not mobile)
    if (!isMobileDevice) {
        initParticles();
    }
    initMatrixKanjiRotation();
    
    console.log('⚡ MATRIX THEME ACTIVATED ⚡');
}

// Matrix kanji rotation
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
        '道', // way
        '力', // power
        '愛', // love
        '死', // death
        '生', // life
        '運', // fate
        '選', // choice
        '自', // self
        '由', // freedom
        '束', // restraint
        '縛', // binding
        '解', // release
        '放', // liberation
        '知', // knowledge
        '無', // nothingness
        '有', // existence
        '一', // one
        '二', // two
        '三', // three
        '四', // four
        '五', // five
        '六', // six
        '七', // seven
        '八', // eight
        '九', // nine
        '十', // ten
        '百', // hundred
        '千', // thousand
        '万', // ten thousand
        '億', // hundred million
        '兆'  // trillion
    ];
    
    // Rotate characters every 3 seconds
    matrixKanjiInterval = setInterval(() => {
        const kanjiElements = document.querySelectorAll('.matrix-column-char');
        kanjiElements.forEach(char => {
            if (Math.random() < 0.3) { // 30% chance to change
                const randomKanji = matrixKanji[Math.floor(Math.random() * matrixKanji.length)];
                char.textContent = randomKanji;
            }
        });
    }, 3000);
}

// Theme switching infrastructure (simplified for Matrix only)
function initThemeSwitcher() {
    // Set to Matrix theme by default
    switchToMatrixTheme();
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
    
    // Matrix theme effects - create white rabbit
    createWhiteRabbit(event.clientX, event.clientY);
}

// White Rabbit effect (simplified)
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
    initThemeSwitcher();
    initWeather();
    
    updateClock();
    adjustFontSizes();
    
    // Update every second
    setInterval(updateClock, 1000);
    
    // Adjust font sizes on window resize
    window.addEventListener('resize', adjustFontSizes);
    
    // Add global click handler
    document.addEventListener('click', handleGlobalClick);
    
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
    
    @keyframes fadeInOut {
        0% { opacity: 0; transform: scale(0.5); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.5) translateY(-50px); }
    }
`;
document.head.appendChild(style);

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);