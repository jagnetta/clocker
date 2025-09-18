// Global variables
let currentTimezoneOffset = 0;
let currentTheme = null; // Will be set randomly on load
let isMobileDevice = false;

// Modular theme system
let loadedThemes = new Set();
let currentlyLoadedCss = null;
const availableThemes = ['matrix', 'lcars', 'thor', 'sbemail', 'linux'];

// Get themes appropriate for current device
function getMobileAppropriateThemes() {
    if (isMobileDevice) {
        // Mobile devices only get Matrix, LCARS, and Thor
        return ['matrix', 'lcars', 'thor'];
    }
    // Desktop gets all themes
    return availableThemes;
}

// Use timezone data from timezones.js - create compatibility layer
let currentTimezoneIndex = 0;

// Create timezone offset map from the global timezones array for backward compatibility
function createTimezoneOffsetMap() {
    const offsetMap = {};
    if (typeof timezones === 'undefined') {
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
        
        // Parse DST information
        const hasDST = tz.daylightSaving && tz.daylightSaving.observesDST;
        let dstOffset = null;
        
        if (hasDST && tz.daylightSaving.dstOffset) {
            const dstOffsetStr = tz.daylightSaving.dstOffset.replace('UTC', '');
            if (dstOffsetStr.includes(':')) {
                const [hours, minutes] = dstOffsetStr.split(':');
                dstOffset = parseFloat(hours) + (parseFloat(minutes) / 60) * Math.sign(parseFloat(hours));
            } else {
                dstOffset = parseFloat(dstOffsetStr);
            }
        }
        
        // Store with both string and numeric keys for compatibility
        const key = offset.toString();
        offsetMap[key] = {
            name: tz.abbreviation,
            label: tz.name,
            dst: hasDST,
            dstOffset: dstOffset,
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

// Optimized modular theme loading system with proper CSS loading
async function loadTheme(themeName) {
    if (!availableThemes.includes(themeName)) {
        return false;
    }
    
    // Check if theme is appropriate for mobile device
    const appropriateThemes = getMobileAppropriateThemes();
    if (!appropriateThemes.includes(themeName)) {
        return false;
    }
    
    try {
        // Don't remove CSS files - they might be needed later
        // Just load the new theme CSS alongside existing ones
        
        if (!loadedThemes.has(themeName)) {
            
            // Load CSS and JS in parallel for faster loading
            const cssPromise = new Promise((resolve, reject) => {
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = `${themeName}-theme.css`;
                cssLink.onload = resolve;
                cssLink.onerror = reject;
                document.head.appendChild(cssLink);
            });
            
            const jsPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `${themeName}-theme.js`;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
            
            // Wait for both CSS and JS to load
            await Promise.all([cssPromise, jsPromise]);
            
            currentlyLoadedCss = themeName;
            loadedThemes.add(themeName);
        }
        
        // Wait for CSS to fully apply - crucial for preventing skeleton flash
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Validate that theme resources are properly loaded
        const validation = await validateThemeLoad(themeName);
        if (!validation.success) {
            return false;
        }
        
        return true;
        
    } catch (error) {
        return false;
    }
}

// Comprehensive theme validation system
async function validateThemeLoad(themeName) {
    const errors = [];
    const warnings = [];
    
    // Check 1: Validate CSS is loaded and applied
    const cssLink = document.querySelector(`link[href="${themeName}-theme.css"]`);
    if (!cssLink) {
        errors.push(`CSS file not found: ${themeName}-theme.css`);
    }
    
    // Check 2: Validate JS functions are available
    const requiredFunctions = {
        'matrix': ['initMatrixTheme', 'cleanupMatrixTheme'],
        'lcars': ['initLcarsTheme', 'cleanupLcarsTheme'],
        'thor': ['initThorTheme', 'cleanupThorEffects'],
        'sbemail': ['initSBEMAILTheme', 'cleanupSBEMAILTheme'],
        'linux': ['initLinuxTheme', 'cleanupLinuxTheme']
    };
    
    if (requiredFunctions[themeName]) {
        for (const funcName of requiredFunctions[themeName]) {
            if (typeof window[funcName] !== 'function') {
                errors.push(`Function not found: ${funcName}`);
            }
        }
    }
    
    // Check 3: Validate theme-specific DOM requirements
    const domRequirements = await validateThemeDOM(themeName);
    errors.push(...domRequirements.errors);
    warnings.push(...domRequirements.warnings);
    
    // Check 4: Validate theme resources
    const resourceCheck = await validateThemeResources(themeName);
    errors.push(...resourceCheck.errors);
    warnings.push(...resourceCheck.warnings);
    
    const success = errors.length === 0;
    
    if (!success) {
    }
    
    if (warnings.length > 0) {
    }
    
    return {
        success,
        errors,
        warnings,
        themeName
    };
}

// Validate theme-specific DOM requirements
async function validateThemeDOM(themeName) {
    const errors = [];
    const warnings = [];
    
    switch (themeName) {
        case 'matrix':
            // Matrix needs clock container and weather container (using correct selectors)
            if (!document.querySelector('.clock-container')) {
                errors.push('Matrix theme requires .clock-container element');
            }
            if (!document.querySelector('.weather-container')) {
                errors.push('Matrix theme requires .weather-container element');
            }
            break;
            
        case 'lcars':
            // LCARS needs clock container
            if (!document.querySelector('.clock-container')) {
                errors.push('LCARS theme requires .clock-container element');
            }
            break;
            
        case 'thor':
            // Thor needs clock container
            if (!document.querySelector('.clock-container')) {
                errors.push('Thor theme requires .clock-container element');
            }
            break;
            
        case 'linux':
            // Linux needs clock container
            if (!document.querySelector('.clock-container')) {
                errors.push('Linux theme requires .clock-container element');
            }
            break;
            
        case 'sbemail':
            // SBEMAIL creates its own terminal, just needs body
            if (!document.body) {
                errors.push('SBEMAIL theme requires document body');
            }
            break;
    }
    
    return { errors, warnings };
}

// Validate theme resources
async function validateThemeResources(themeName) {
    const errors = [];
    const warnings = [];
    
    // Check for theme-specific background elements
    const backgroundIds = {
        'matrix': 'matrixBg',
        'lcars': 'lcarsBg',
        'thor': 'thorBg'
    };
    
    if (backgroundIds[themeName]) {
        const bgElement = document.getElementById(backgroundIds[themeName]);
        if (!bgElement) {
            warnings.push(`Background element not found: #${backgroundIds[themeName]} (will be created dynamically)`);
        }
    }
    
    return { errors, warnings };
}

// Global arrays to track intervals and event listeners for cleanup
let themeIntervals = [];
let themeEventListeners = [];

// Helper function to clear all theme-specific intervals (not global app intervals)
function clearAllIntervals() {
    themeIntervals.forEach(intervalId => {
        clearInterval(intervalId);
        clearTimeout(intervalId);
    });
    themeIntervals = [];
}

// Helper function to remove all theme event listeners
function removeThemeEventListeners() {
    themeEventListeners.forEach(listener => {
        if (listener.element && listener.event && listener.handler) {
            listener.element.removeEventListener(listener.event, listener.handler);
        }
    });
    themeEventListeners = [];
}

// Optimized theme-specific DOM cleanup - faster and less intrusive
function clearThemeDOM() {
    // Remove dynamically created theme elements only - more targeted
    const themeElementSelectors = [
        '.matrix-particle', '.matrix-column-char', '.matrix-white-rabbit', '.matrix-red-pill', '.matrix-blue-pill',
        '.warp-star', '.star-trek-flyby', '.photon-torpedo-formation', '.lcars-indicator',
        '.lightning-flash', '.mjolnir-strike', '.loki-illusion', '.loki-shapeshift', '.thor-lightning',
        '.sbemail-boxing-gloves', '.sbemail-boxing-gloves-pair', '.sbemail-trsbemaildor', '.sbemail-trsbemaildor-test', '.sbemail-pulsing-star',
        '.sbemail-terminal-window', '.theme-overlay', '.theme-dynamic'
    ];
    
    // Use single query for better performance
    const elementsToRemove = document.querySelectorAll(themeElementSelectors.join(', '));
    elementsToRemove.forEach(el => {
        if (el && el.parentNode) {
            el.parentNode.removeChild(el);
        }
    });
    
    // Clear theme background containers content only
    const containerSelectors = ['#particles', '#warpStars', '#lightningEffects', '#thorParticles', '#asgardRunes', '#compyWindow'];
    containerSelectors.forEach(selector => {
        const container = document.querySelector(selector);
        if (container) {
            container.innerHTML = '';
        }
    });
    
    // Reset body transform from easter egg effects
    document.body.style.transform = '';
}

// Register interval for cleanup
function registerInterval(intervalId) {
    themeIntervals.push(intervalId);
    return intervalId;
}

// Register event listener for cleanup
function registerEventListener(element, event, handler) {
    themeEventListeners.push({ element, event, handler });
    element.addEventListener(event, handler);
}

// Clean up current theme before switching
function cleanupCurrentTheme() {
    if (!currentTheme) return;
    
    // Clear all intervals and timeouts
    clearAllIntervals();
    
    // Remove all theme-specific event listeners
    removeThemeEventListeners();
    
    // Clear all theme-specific DOM modifications
    clearThemeDOM();
    
    // Theme-specific cleanup functions with validation
    const cleanupFunctions = {
        'matrix': 'cleanupMatrixTheme',
        'lcars': 'cleanupLcarsTheme',
        'thor': 'cleanupThorEffects',
        'sbemail': 'cleanupSBEMAILTheme',
        'linux': 'cleanupLinuxTheme'
    };
    
    const cleanupFunctionName = cleanupFunctions[currentTheme];
    if (cleanupFunctionName && typeof window[cleanupFunctionName] === 'function') {
        try {
            window[cleanupFunctionName]();
        } catch (error) {
        }
    }
}

// Flag to indicate when SBEMAIL is handling its own theme switch
window.sbemailThemeSwitchInProgress = false;

// Optimized theme switching with minimal flashing
async function switchToTheme(themeName) {
    if (currentTheme === themeName) {
        return;
    }
    
    // Check if this theme recently failed
    if (lastFailedTheme === themeName && themeFailureCount >= 2) {
        return;
    }
    
    // Special handling for SBEMAIL theme - let it handle its own shutdown with CRT effects
    if (currentTheme === 'sbemail' && !window.sbemailThemeSwitchInProgress) {
        // Always trigger SBEMAIL's own shutdown sequence with CRT effects
        const targetButton = document.querySelector(`[data-theme="${themeName}"]`);
        
        if (targetButton && typeof initiateSystemSwitch === 'function') {
            const allButtons = document.querySelectorAll('.sbemail-control-button.theme-btn');
            
            // Set flag to indicate SBEMAIL is handling its own switch
            window.sbemailThemeSwitchInProgress = true;
            
            initiateSystemSwitch(themeName, targetButton, allButtons);
            return;
        } else {
            // Fallback: interrupt startup processes and continue with normal switch
            if (typeof interruptSbemailProcesses === 'function') {
                interruptSbemailProcesses();
            }
        }
    } else if (currentTheme === 'sbemail' && window.sbemailThemeSwitchInProgress) {
        // SBEMAIL is already handling its own switch, so use fast cleanup instead of 12-second delay
        // This happens when SBEMAIL's CRT effect calls switchToTheme() after completion
    }
    
    // Immediately hide all background elements to prevent flash
    const allBackgroundElements = ['matrixBg', 'lcarsBg', 'thorBg'];
    allBackgroundElements.forEach(bgId => {
        const bgElement = document.getElementById(bgId);
        if (bgElement) {
            bgElement.classList.add('hidden');
            bgElement.style.opacity = '0';
        }
    });
    
    // Step 1: Clean up current theme completely
    cleanupCurrentTheme();
    
    // Step 2: Wait for cleanup to complete - extra time for SBEMAIL theme CRT shutdown effect
    // But use fast cleanup if SBEMAIL is already handling its own switch
    const cleanupDelay = (currentTheme === 'sbemail' && !window.sbemailThemeSwitchInProgress) ? 12000 : 150;
    await new Promise(resolve => setTimeout(resolve, cleanupDelay));
    
    // Step 3: Remove all theme-specific CSS classes from body
    document.body.className = document.body.className.replace(/\b\w+-theme\b/g, '').trim();
    
    // Step 3.3: Clear any inline styles from body that might cause theme bleeding
    document.body.removeAttribute('style');
    
    // Step 3.4: Quick reset of common inline styles that themes might have added
    const styledElements = document.querySelectorAll('[style*="animation"], [style*="transform"], [style*="color: rgb(0, 255, 0)"]');
    styledElements.forEach(el => {
        // Only clear problematic inline styles, don't touch everything
        if (el.style.animation && el.style.animation.includes('matrix')) {
            el.style.animation = '';
        }
        if (el.style.transform && el.style.transform.includes('translate')) {
            el.style.transform = '';
        }
    });
    
    // Step 3.5: Force DOM reflow to ensure styles are applied
    document.body.offsetHeight;
    
    // Step 4: Load new theme resources
    const loaded = await loadTheme(themeName);
    if (!loaded) {
        await handleThemeLoadFailure(themeName);
        return;
    }
    
    // Step 5: Update current theme reference
    currentTheme = themeName;
    
    // Step 6: Update theme selector buttons
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-theme') === themeName) {
            option.classList.add('active');
        }
    });
    
    // Step 7: Apply new theme CSS class
    document.body.classList.add(`${themeName}-theme`);
    
    // Step 7.5: Show the correct background immediately
    const backgroundElements = {
        'matrix': 'matrixBg',
        'lcars': 'lcarsBg', 
        'thor': 'thorBg'
    };
    
    const newBgId = backgroundElements[themeName];
    if (newBgId) {
        const newBgElement = document.getElementById(newBgId);
        if (newBgElement) {
            newBgElement.removeAttribute('style');
            newBgElement.classList.remove('hidden');
            newBgElement.offsetHeight; // Force reflow
        }
    }
    
    // Step 8: Initialize the new theme
    const initResult = await initializeThemeWithValidation(themeName);
    
    if (!initResult.success) {
        // Try to fall back to matrix theme
        if (themeName !== 'matrix') {
            await switchToTheme('matrix');
        }
        return;
    }
    
    
    // Quick health check after theme has had time to initialize
    setTimeout(async () => {
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            const initialTime = clockElement.textContent;
            // Wait longer for clock to update after theme switch
            await new Promise(resolve => setTimeout(resolve, 1500));
            const updatedTime = clockElement.textContent;
            if (initialTime === updatedTime) {
            }
        }
    }, 3000); // Wait 3 seconds for theme to fully stabilize
}

// Initialize theme with validation and error handling
async function initializeThemeWithValidation(themeName) {
    const errors = [];
    const warnings = [];
    
    // Step 1: Validate init function exists
    const initFunctions = {
        'matrix': 'initMatrixTheme',
        'lcars': 'initLcarsTheme', 
        'thor': 'initThorTheme',
        'sbemail': 'initSBEMAILTheme',
        'linux': 'initLinuxTheme'
    };
    
    const initFunctionName = initFunctions[themeName];
    if (!initFunctionName || typeof window[initFunctionName] !== 'function') {
        errors.push(`Init function not found: ${initFunctionName}`);
        return { success: false, errors, warnings };
    }
    
    // Step 2: Execute initialization function
    try {
        const initResult = window[initFunctionName]();
        
        // If init function returns a promise, wait for it
        if (initResult && typeof initResult.then === 'function') {
            await initResult;
        }
    } catch (error) {
        errors.push(`Theme init error: ${error.message}`);
        return { success: false, errors, warnings };
    }
    
    // Step 3: Post-initialization validation
    const postInitValidation = await validateThemePostInit(themeName);
    errors.push(...postInitValidation.errors);
    warnings.push(...postInitValidation.warnings);
    
    const success = errors.length === 0;
    
    if (!success) {
    }
    
    return { success, errors, warnings };
}

// Validate theme after initialization
async function validateThemePostInit(themeName) {
    const errors = [];
    const warnings = [];
    
    // Check theme-specific post-init requirements
    switch (themeName) {
        case 'matrix':
            if (!document.getElementById('matrixBg')) {
                errors.push('Matrix background not created');
            }
            break;
            
        case 'lcars':
            if (!document.getElementById('lcarsBg')) {
                errors.push('LCARS background not created');
            }
            break;
            
        case 'thor':
            if (!document.getElementById('thorBg')) {
                errors.push('Thor background not created');
            }
            break;
            
        case 'linux':
            if (!document.querySelector('.linux-desktop-icons')) {
                errors.push('Linux desktop not created');
            }
            break;
            
        case 'sbemail':
            if (!document.getElementById('sbemailTerminalWindow')) {
                errors.push('SBEMAIL terminal not created');
            }
            break;
    }
    
    return { errors, warnings };
}

// Handle theme loading failures with fallback logic
// Circuit breaker to prevent infinite loops
let themeFailureCount = 0;
let lastFailedTheme = null;
const MAX_THEME_FAILURES = 3;

async function handleThemeLoadFailure(failedTheme) {
    
    // Circuit breaker: prevent infinite loops
    if (failedTheme === lastFailedTheme) {
        themeFailureCount++;
    } else {
        themeFailureCount = 1;
        lastFailedTheme = failedTheme;
    }
    
    if (themeFailureCount >= MAX_THEME_FAILURES) {
        // Disable the failed theme button to prevent further attempts
        const failedButton = document.querySelector(`[data-theme="${failedTheme}"]`);
        if (failedButton) {
            failedButton.disabled = true;
            failedButton.style.opacity = '0.5';
            failedButton.title = `${failedTheme} theme unavailable`;
        }
        return;
    }
    
    // Try fallback themes only if basic HTML structure exists
    const clockContainer = document.querySelector('.clock-container');
    
    if (clockContainer) {
        // Try other standard themes first if structure exists
        const fallbackThemes = ['matrix', 'lcars', 'thor'];
        for (const fallbackTheme of fallbackThemes) {
            if (fallbackTheme !== failedTheme) {
                try {
                    await switchToTheme(fallbackTheme);
                    themeFailureCount = 0;
                    lastFailedTheme = null; // Clear failure tracking
                    return;
                } catch (error) {
                }
            }
        }
    }
    
    // If all else fails, try SBEMAIL as it creates its own structure
    if (failedTheme !== 'sbemail') {
        try {
            await switchToTheme('sbemail');
            themeFailureCount = 0;
            lastFailedTheme = null; // Clear failure tracking
            return;
        } catch (error) {
        }
    }
    
}

// Comprehensive theme health check
async function performThemeHealthCheck() {
    const healthReport = {
        currentTheme,
        allResourcesLoaded: true,
        functionsAvailable: true,
        domElementsPresent: true,
        clockUpdating: false,
        errors: [],
        warnings: []
    };
    
    // Check if current theme resources are loaded
    if (currentTheme) {
        const validation = await validateThemeLoad(currentTheme);
        healthReport.allResourcesLoaded = validation.success;
        healthReport.errors.push(...validation.errors);
        healthReport.warnings.push(...validation.warnings);
    }
    
    // Check clock functionality
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        const initialTime = clockElement.textContent;
        await new Promise(resolve => setTimeout(resolve, 1100));
        const updatedTime = clockElement.textContent;
        healthReport.clockUpdating = initialTime !== updatedTime;
    }
    
    // Check theme button states
    const activeButtons = document.querySelectorAll('.theme-option.active');
    if (activeButtons.length !== 1) {
        healthReport.warnings.push(`Expected 1 active theme button, found ${activeButtons.length}`);
    }
    
    // Overall health status
    const isHealthy = healthReport.allResourcesLoaded && 
                     healthReport.functionsAvailable && 
                     healthReport.domElementsPresent &&
                     healthReport.errors.length === 0;
    
    if (!isHealthy) {
    }
    
    return healthReport;
}

// Expose health check globally for debugging
window.checkThemeHealth = performThemeHealthCheck;
window.debugThemeSystem = async () => {
    const health = await performThemeHealthCheck();
    
    return health;
};

// Initialize random theme on load
function initRandomTheme() {
    const appropriateThemes = getMobileAppropriateThemes();
    const randomTheme = appropriateThemes[Math.floor(Math.random() * appropriateThemes.length)];
    switchToTheme(randomTheme);
}

// Switch to a random theme excluding the current one (mobile-filtered)
function switchToRandomTheme(excludeTheme = null) {
    const appropriateThemes = getMobileAppropriateThemes();
    const availableOptions = appropriateThemes.filter(theme => theme !== (excludeTheme || currentTheme));
    
    if (availableOptions.length === 0) {
        return;
    }
    
    const randomTheme = availableOptions[Math.floor(Math.random() * availableOptions.length)];
    switchToTheme(randomTheme);
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

// Format time for popup/alert displays (plain text, no HTML)
function formatTimeForPopup(date) {
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
    
    return `${hours}:${minutesStr}:${secondsStr} ${ampm} ${timezoneInfo.name}`;
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
        let effectiveName = selectedTz.name;
        let dstIndicator = '';
        
        if (selectedTz.daylightSaving.observesDST && isDSTActiveForTimezone(now, selectedTz)) {
            effectiveOffset = selectedTz.daylightSaving.dstOffset;
            effectiveAbbrev = selectedTz.daylightSaving.dstAbbreviation;
            dstIndicator = ' ☀️ DST';
            
            // Update the name to show "Daylight" instead of "Standard" when DST is active
            if (effectiveName.includes('Standard')) {
                effectiveName = effectiveName.replace('Standard', 'Daylight');
            }
        }
        
        // Abbreviate DAYLIGHT and STANDARD in timezone names
        effectiveName = effectiveName.replace(/\bDaylight\b/g, 'DL').replace(/\bStandard\b/g, 'STD');
        
        // Check if this is the browser's detected timezone
        const browserOffset = detectBrowserTimezone();
        const isLocalTime = Math.abs(currentTimezoneOffset - browserOffset) < 0.1;
        const localIndicator = isLocalTime ? ' 🏠 LOCAL' : '';
        
        display.textContent = `${effectiveOffset} (${effectiveAbbrev}) - ${effectiveName}${dstIndicator}${localIndicator}`;
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
        
        return bestMatch;
        
    } catch (error) {
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

function showCustomConfirm(title, message) {
    return new Promise((resolve) => {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'custom-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'custom-modal';

        const modalTitle = document.createElement('div');
        modalTitle.className = 'custom-modal-title';
        modalTitle.textContent = title;

        const modalMessage = document.createElement('pre');
        modalMessage.className = 'custom-modal-message';
        modalMessage.textContent = message;

        const modalTimer = document.createElement('div');
        modalTimer.className = 'custom-modal-timer';
        
        let countdown = 10;
        modalTimer.textContent = `Switching in ${countdown}...`;

        modal.appendChild(modalTitle);
        modal.appendChild(modalMessage);
        modal.appendChild(modalTimer);
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);

        const interval = setInterval(() => {
            countdown--;
            modalTimer.textContent = `Switching in ${countdown}...`;
            if (countdown <= 0) {
                clearInterval(interval);
                document.body.removeChild(modalOverlay);
                resolve(true);
            }
        }, 1000);

        modalTimer.addEventListener('click', () => {
            countdown -= 3;
            if (countdown < 0) countdown = 0;
            modalTimer.textContent = `Switching in ${countdown}...`;
        });
    });
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', async function(event) {
        if (event.ctrlKey && event.key === 'c') {
            const now = getTimezoneDate();
            const formatted = formatDate(now);
            const timeStr = formatTimeForPopup(now);
            
            // Create theme-specific exit messages (shortened for clean popup)
            const exitMessages = {
                'matrix': {
                    title: '⚡ MATRIX TERMINATED ⚡',
                    message: `Connection severed, Neo.\n\n${timeStr}\n${formatted.day}, ${formatted.date}\n\n🔌 Wake up! 🔌`
                },
                'lcars': {
                    title: '🖖 LCARS SHUTDOWN 🖖',
                    message: `Starfleet protocol complete.\n\n${timeStr}\n${formatted.day}, ${formatted.date}\n\n🚀 Live long & prosper! 🚀`
                },
                'thor': {
                    title: '⚡ ASGARD DEACTIVATED ⚡',
                    message: `The All-Father calls you.\n\n${timeStr}\n${formatted.day}, ${formatted.date}\n\n🔨 For Asgard! 🔨`
                },
                'sbemail': {
                    title: 'DELETED! - SYSTEM SHUTDOWN',
                    message: `The system is down.\n\n${timeStr}\n${formatted.day}, ${formatted.date}\n\nYour computer is now a brick.`
                },
                'linux': {
                    title: '🐧 KERNEL PANIC! 🐧',
                    message: `Fatal error detected.\n\n${timeStr}\n${formatted.day}, ${formatted.date}\n\nSystem integrity compromised.`
                }
            };
            
            const currentMessage = exitMessages[currentTheme] || exitMessages['matrix'];
            
            const userConfirmed = await showCustomConfirm(currentMessage.title, currentMessage.message + '\n\nClick the timer to switch themes....');

            if (userConfirmed) {
                // Switch to a different random theme (mobile-filtered)
                const appropriateThemes = getMobileAppropriateThemes();
                const otherThemes = appropriateThemes.filter(theme => theme !== currentTheme);
                const nextTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];
                switchToTheme(nextTheme);
            }
        }
        
        // Easter eggs for extra sass (disabled for Linux theme)
        if (event.key === 'ArrowUp' && currentTheme !== 'linux') {
            document.body.style.transform = 'rotate(1deg)';
            setTimeout(() => document.body.style.transform = '', 500);
        }
        
        if (event.key === 'ArrowDown' && currentTheme !== 'linux') {
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
    isMobileDevice = isMobileUserAgent;
    
    if (isMobileDevice) {
        document.body.classList.add('mobile-device');
    }
    
    return isMobileDevice;
}

// Weather functionality
let weatherApiKey = '1e9db439b2d25a3ec0549dd6dd6d5854'; // OpenWeatherMap API key

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
    'fsbemail': '🌫️',
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
    if (desc.includes('fsbemail') || desc.includes('mist')) return weatherIcons.fsbemail;
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

// Convert Celsius to Fahrenheit  
function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
}

// Convert m/s to mph
function msToMph(ms) {
    return Math.round(ms * 2.237);
}

// Create weather ticker display
function createWeatherTicker(weatherData, locationName) {
    const weatherScroll = document.getElementById('weatherScroll');
    
    
    // Check if weatherScroll element exists
    if (!weatherScroll) {
        return;
    }
    
    // Clear existing content
    weatherScroll.innerHTML = '';
    
    // Extract location details
    const coords = `${weatherData.coord.latitude}°, ${weatherData.coord.longitude}°`;
    // Use the already formatted location name from coordinates, don't add country again
    const formattedLocation = weatherData.name;
    
    // Helper function to create 5-day forecast content block
    function createWeatherContent() {
        const contentBlock = document.createElement('div');
        contentBlock.style.display = 'inline-flex';
        contentBlock.style.alignItems = 'center';
        contentBlock.style.marginRight = '20px';
        contentBlock.style.whiteSpace = 'nowrap';
        
        // Current weather
        const currentIcon = getWeatherIcon(weatherData.current.description);
        const currentTempF = celsiusToFahrenheit(weatherData.current.temp);
        const currentWindSpeed = weatherData.wind?.speed ? `${msToMph(weatherData.wind.speed)} mph` : 'N/A';
        
        // Add location separator at the start
        const startSeparator = document.createElement('div');
        startSeparator.className = 'weather-separator';
        startSeparator.innerHTML = `<span class="city-separator">🌐 ${formattedLocation} 🌐</span>`;
        contentBlock.appendChild(startSeparator);
        
        // Current weather item
        const currentWeatherItem = document.createElement('div');
        currentWeatherItem.className = 'weather-item';
        currentWeatherItem.innerHTML = `
            <span class="weather-day">NOW:</span>
            <span class="weather-icon">${currentIcon}</span>
            <span class="weather-temp">${currentTempF}°F</span>
            <span class="weather-desc">${weatherData.current.description}</span>
            <span class="weather-humidity">💧${weatherData.current.humidity}%</span>
            <span class="weather-wind">💨${currentWindSpeed}</span>
        `;
        contentBlock.appendChild(currentWeatherItem);
        
        // Add forecast separator with Matrix theme styling
        const midSeparator = document.createElement('div');
        midSeparator.className = 'weather-separator';
        midSeparator.innerHTML = ' ⚡ FORECAST ⚡ ';
        contentBlock.appendChild(midSeparator);
        
        // 5-day forecast (take every 8th item to get daily forecasts)
        const dailyForecasts = [];
        for (let i = 8; i < weatherData.forecast.length && dailyForecasts.length < 5; i += 8) {
            dailyForecasts.push(weatherData.forecast[i]);
        }
        
        dailyForecasts.forEach((forecast, index) => {
            const forecastIcon = getWeatherIcon(forecast.description);
            const forecastTempF = celsiusToFahrenheit(forecast.temp);
            const forecastDate = new Date(forecast.dt * 1000);
            const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
            
            const forecastItem = document.createElement('div');
            forecastItem.className = 'weather-item forecast-weather';
            forecastItem.innerHTML = `
                <span class="weather-day">${dayName}:</span>
                <span class="weather-icon">${forecastIcon}</span>
                <span class="weather-temp">${forecastTempF}°F</span>
                <span class="weather-desc">${forecast.description}</span>
            `;
            contentBlock.appendChild(forecastItem);
            
            // Add separator between days
            if (index < dailyForecasts.length - 1) {
                const daySeparator = document.createElement('div');
                daySeparator.className = 'weather-separator';
                daySeparator.textContent = ' • ';
                contentBlock.appendChild(daySeparator);
            }
        });
        
        // Add coordinates at the end
        const coordsItem = document.createElement('div');
        coordsItem.className = 'weather-coords';
        coordsItem.innerHTML = ` 📍${coords}`;
        contentBlock.appendChild(coordsItem);
        
        return contentBlock;
    }
    
    // Create chain of weather content blocks for continuous scroll
    for (let i = 0; i < 4; i++) {
        const contentBlock = createWeatherContent();
        weatherScroll.appendChild(contentBlock);
    }
    
    
    // Debug: Check if elements were actually created
    
    // Check first few weather elements for visibility
    const firstWeatherDay = weatherScroll.querySelector('.weather-day');
    const firstWeatherTemp = weatherScroll.querySelector('.weather-temp');
    
    if (firstWeatherDay) {
        const dayStyles = window.getComputedStyle(firstWeatherDay);
    } else {
    }
    
    if (firstWeatherTemp) {
        const tempStyles = window.getComputedStyle(firstWeatherTemp);
    } else {
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
        // Allow letters, digits, spaces, commas, periods, hyphens for global locations, coordinates, and ZIP codes
        this.value = this.value.replace(/[^a-zA-Z0-9\s,.\-]/g, '');
    });
}

// Fetch real weather data from OpenWeatherMap API
// Check if input is coordinates (lat,lon format)
function isCoordinates(input) {
    const coordPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/;
    return coordPattern.test(input.trim());
}

// Parse coordinates from string
function parseCoordinates(input) {
    const [lat, lon] = input.trim().split(',').map(parseFloat);
    return { lat, lon, name: `${lat}, ${lon}` };
}

// Get coordinates from location name using OpenWeather Geocoding API
async function getCoordinatesFromLocation(locationInput, apiKey) {
    try {
        // Use geocoding API to get coordinates
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationInput)}&limit=5&appid=${apiKey}`;
        
        const geoResponse = await fetch(geoUrl);
        if (!geoResponse.ok) {
            throw new Error(`Geocoding API error: ${geoResponse.status}`);
        }
        
        const geoData = await geoResponse.json();
        
        if (geoData.length === 0) {
            // Try ZIP code geocoding if regular search fails
            const zipUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(locationInput)}&appid=${apiKey}`;
            const zipResponse = await fetch(zipUrl);
            
            if (zipResponse.ok) {
                const zipData = await zipResponse.json();
                return {
                    lat: zipData.lat,
                    lon: zipData.lon,
                    name: `${zipData.name}, ${zipData.country}`
                };
            }
            
            throw new Error(`Location "${locationInput}" not found`);
        }
        
        // Use the first result
        const location = geoData[0];
        return {
            lat: location.lat,
            lon: location.lon,
            name: `${location.name}${location.state ? ', ' + location.state : ''}, ${location.country}`
        };
        
    } catch (error) {
        throw error;
    }
}

// Enhanced weather data fetch with location search support
async function fetchWeatherData(locationInput) {
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';
    const API_KEY = weatherApiKey;
    
    try {
        
        // First, get coordinates for the location using Geocoding API
        let coordinates;
        
        // Check if input is coordinates, ZIP code, or city name
        if (isCoordinates(locationInput)) {
            coordinates = parseCoordinates(locationInput);
        } else {
            // Update loading message
            const weatherScroll = document.getElementById('weatherScroll');
            if (weatherScroll) {
                weatherScroll.innerHTML = '<div class="weather-loading">📍 Finding location...</div>';
            }
            coordinates = await getCoordinatesFromLocation(locationInput, API_KEY);
        }
        
        // Get 5-day forecast using coordinates
        // Update loading message
        const weatherScroll = document.getElementById('weatherScroll');
        if (weatherScroll) {
            weatherScroll.innerHTML = '<div class="weather-loading">⛅ Fetching weather forecast...</div>';
        }
        const forecastResponse = await fetch(
            `${BASE_URL}/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`
        );
        
        if (!forecastResponse.ok) {
            throw new Error(`OpenWeather API error: ${forecastResponse.status}`);
        }
        
        const forecastData = await forecastResponse.json();
        
        // Transform to consistent format with 5-day forecast
        const transformedData = {
            name: coordinates.name || forecastData.city.name,
            country: forecastData.city.country,
            coord: {
                latitude: coordinates.lat.toFixed(2),
                longitude: coordinates.lon.toFixed(2)
            },
            current: {
                temp: forecastData.list[0].main.temp, // Current temperature
                humidity: forecastData.list[0].main.humidity,
                pressure: forecastData.list[0].main.pressure,
                description: forecastData.list[0].weather[0].description,
                icon: forecastData.list[0].weather[0].icon
            },
            forecast: forecastData.list.slice(0, 40).map(item => ({ // 5 days * 8 per day = 40 entries
                dt: item.dt,
                temp: item.main.temp,
                description: item.weather[0].description,
                humidity: item.main.humidity,
                wind_speed: item.wind?.speed || 0,
                icon: item.weather[0].icon,
                date: new Date(item.dt * 1000).toLocaleDateString()
            })),
            wind: {
                speed: forecastData.list[0].wind?.speed || 0,
                deg: forecastData.list[0].wind?.deg || 0
            }
        };
        
        return transformedData;
        
    } catch (error) {
        throw new Error(`Weather data access denied: ${error.message}`);
    }
}

// Helper functions for weather panel state management
function showWeatherResult() {
}

// Handle weather request with real API integration
async function handleWeatherRequest() {
    const cityInput = document.getElementById('cityInput');
    const cityName = cityInput.value.trim();
    
    if (!cityName) {
        alert('Please enter a city name');
        return;
    }
    
    // Synchronize search term with SBEMAIL input if SBEMAIL theme is active
    if (currentTheme === 'sbemail') {
        const sbemailSearchInput = document.getElementById('sbemailSearchInput');
        if (sbemailSearchInput) {
            sbemailSearchInput.value = cityName;
        }
    }
    
    // Show loading indicator
    const weatherTicker = document.getElementById('weatherTicker');
    const weatherScroll = document.getElementById('weatherScroll');
    if (weatherScroll) {
        weatherScroll.innerHTML = '<div class="weather-loading">🌐 Fetching weather data...</div>';
    }
    // Show the ticker with loading message first
    showWeatherResult();
    
    try {
        // Fetch real weather data from OpenWeatherMap
        const weatherData = await fetchWeatherData(cityName);
        
        if (weatherData) {
            
            // Create ticker immediately - no delay
            createWeatherTicker(weatherData, cityName);
            
            // Weather ticker is already visible, just populated with data
            
            // Synchronize with SBEMAIL theme if it's active
            if (currentTheme === 'sbemail') {
                setTimeout(() => {
                    const sbemailWeatherTicker = document.getElementById('sbemailWeatherTicker');
                    if (sbemailWeatherTicker && typeof updateOgWeatherTicker === 'function') {
                        sbemailWeatherTicker.style.display = 'block';
                        updateOgWeatherTicker(); // Update SBEMAIL ticker with new data
                        
                        // Auto-scroll to show the weather widget
                        setTimeout(() => {
                            if (typeof scrollToWeatherWidget === 'function') {
                                scrollToWeatherWidget();
                            }
                        }, 500); // Small delay to let ticker render
                    }
                }, 1000);
            }
            
            cityInput.value = ''; // Clear main input only on success
            
            // Clear SBEMAIL input if it exists for consistency
            const sbemailSearchInput = document.getElementById('sbemailSearchInput');
            if (sbemailSearchInput) {
                sbemailSearchInput.value = '';
            }
        } else {
            if (weatherScroll) {
                weatherScroll.innerHTML = '<div class="weather-error">❌ City not found. Please try again.</div>';
                // Error message shown in already visible ticker
            }
        }
    } catch (error) {
        if (weatherScroll) {
            weatherScroll.innerHTML = '<div class="weather-error">❌ Weather service unavailable. Please try again later.</div>';
            // Error message shown in already visible ticker
        }
    }
}


// Global click handler for theme-specific effects
function handleGlobalClick(event) {
    
    // Don't trigger on theme selector clicks
    if (event.target.closest('.theme-selector')) {
        return;
    }
    
    // Don't trigger on timezone container clicks
    if (event.target.closest('.timezone-container')) {
        return;
    }
    
    // Don't trigger on weather interface clicks
    if (event.target.closest('.weather-container')) {
        return;
    }
    
    // Don't trigger on weather search panel clicks
    if (event.target.closest('.city-input-container')) {
        return;
    }
    
    // Don't trigger on interactive elements (inputs, buttons, sliders)
    if (event.target.matches('input, button, select, textarea, [contenteditable]') || 
        event.target.closest('input, button, select, textarea, [contenteditable]')) {
        return;
    }
    
    // Delegate to theme-specific click handlers
    const clickHandlers = {
        'matrix': () => typeof handleMatrixClick === 'function' && handleMatrixClick(event.clientX, event.clientY),
        'lcars': () => typeof handleLcarsClick === 'function' && handleLcarsClick(event.clientX, event.clientY),
        'thor': () => typeof handleThorClick === 'function' && handleThorClick(event.clientX, event.clientY),
        'linux': () => typeof handleLinuxClick === 'function' && handleLinuxClick(event.clientX, event.clientY)
    };
    
    if (currentTheme && clickHandlers[currentTheme]) {
        clickHandlers[currentTheme]();
    }
}

// Initialize everything
function init() {
    // Detect mobile device first
    detectMobileDevice();
    
    initTimezoneSlider();
    initKeyboardShortcuts();
    addScreenShake();
    initRandomTheme();
    initWeather();
    
    updateClock();
    adjustFontSizes();
    
    // Update every second (this interval should persist across themes, so no registration)
    setInterval(updateClock, 1000);
    
    // Adjust font sizes on window resize (global, not theme-specific)
    window.addEventListener('resize', adjustFontSizes);
    
    // Add global click handler (global, not theme-specific)
    document.addEventListener('click', handleGlobalClick);
    
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