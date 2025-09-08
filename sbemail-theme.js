// SBEMAIL Theme - Strong Bad's Compy 386 from HomestarRunner.com
// Authentic sbemail experience with clocker-improved functionality

let sbemailTerminalInterval = null;
let sbemailStartTime = null;
let sbemailStarsInterval = null;
let sbemailClickHandler = null;

// Auto-scroll to show weather widget in Compy 386 screen
function scrollToWeatherWidget() {
    const terminalContent = document.getElementById('sbemailTerminalContent');
    const weatherSearch = document.getElementById('sbemailWeatherSearch');
    
    if (terminalContent && weatherSearch) {
        // Smooth scroll to show the weather widget
        weatherSearch.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
        });
    }
}

// Retro computer phrases for the fourth startup line
const retroStartupPhrases = [
    "Time display ready. Holy crap on a cracker!",
    "Time display ready. Oh, seriously!",
    "Time display ready. What the crap?",
    "Time display ready. That's not a good prize!",
    "Time display ready. The system is down!",
    "Time display ready. Computer over!",
    "Time display ready. Holy butter on a biscuit!",
    "Time display ready. Great jorb!",
    "Time display ready. Holy schnikes!",
    "Time display ready. Da email loaded!",
    "Time display ready. Flagrant system error... RESOLVED!",
    "Time display ready. Matt, get me a danish!",
    "Time display ready. Ow, my skin!",
    "Time display ready. Here comes the clock!",
    "Time display ready. Baleeted all errors!",
    "Time display ready. Come on fhqwhgads!",
    "Time display ready. The Cheat approved!",
    "Time display ready. Arrowed successfully!",
    "Time display ready. Buttdance complete!",
    "Time display ready. Virus equals very no!"
];

// Get random startup phrase
function getRandomStartupPhrase() {
    return retroStartupPhrases[Math.floor(Math.random() * retroStartupPhrases.length)];
}

// Initialize Strong Bad's Compy 386 Theme
function initSBEMAILTheme() {
    console.log('📧 Initializing Strong Bad\'s Compy 386 theme');
    
    // Record theme start time
    sbemailStartTime = Date.now();
    
    // Create Compy 386 computer
    createCompy386();
    
    // Start Compy clock updates
    startCompyClock();
    
    // Add sbemail-specific keyboard handlers
    addSbemailKeyboardHandlers();
    
    // Start pulsing stars
    startPulsingStars();
    
    // Add boxing gloves click handler
    addBoxingGlovesHandler();
    
    console.log('📧 Strong Bad\'s Compy 386 theme initialized');
}

// Cleanup Strong Bad's Compy 386 Theme - Complete cleanup
function cleanupSBEMAILTheme() {
    console.log('📧 Powering down Strong Bad\'s Compy 386...');
    
    // Clear Compy update interval
    if (sbemailTerminalInterval) {
        clearInterval(sbemailTerminalInterval);
        sbemailTerminalInterval = null;
    }
    
    // Clear weather scrolling interval (no longer needed with CSS animation)
    if (sbemailWeatherScrollInterval) {
        clearInterval(sbemailWeatherScrollInterval);
        sbemailWeatherScrollInterval = null;
    }
    
    // Stop pulsing stars
    stopPulsingStars();
    
    // Remove boxing gloves click handler
    removeBoxingGlovesHandler();
    
    // Remove Compy 386
    const compyWindow = document.getElementById('sbemailTerminalWindow');
    if (compyWindow) {
        compyWindow.remove();
    }
    
    // Remove any lingering SBEMAIL elements
    const sbemailElements = document.querySelectorAll('.sbemail-boxing-gloves, .sbemail-boxing-gloves-pair, .sbemail-trogdor, .sbemail-trogdor-test, .sbemail-pulsing-star');
    sbemailElements.forEach(el => el.remove());
    
    // Remove sbemail-specific event listeners
    removeSbemailKeyboardHandlers();
    
    // Remove SBEMAIL-specific body classes
    document.body.classList.remove('sbemail-theme');
    
    // Reset variables
    sbemailStartTime = null;
    sbemailTerminalInterval = null;
    sbemailStarsInterval = null;
    sbemailClickHandler = null;
    
    console.log('✅ Strong Bad\'s Compy 386 powered down completely');
}

// Create Strong Bad's Compy 386
function createCompy386() {
    const compyHTML = `
        <div id="sbemailTerminalWindow" class="sbemail-terminal-window">
            <div class="sbemail-terminal-header">
                <div class="sbemail-header-text">
                    <span class="sbemail-terminal-title">COMPY 386</span>
                </div>
                <div class="sbemail-terminal-buttons">
                    <span class="sbemail-btn sbemail-btn-close"></span>
                    <span class="sbemail-btn sbemail-btn-minimize"></span>
                    <span class="sbemail-btn sbemail-btn-maximize"></span>
                </div>
            </div>
            <div class="sbemail-terminal-body">
                <div class="sbemail-terminal-content" id="sbemailTerminalContent">
                    <div class="sbemail-terminal-startup">
                        <div class="sbemail-startup-line" id="initialPrompt">A:\\> </div>
                        <div class="sbemail-startup-line" id="newPrompt" style="display: none;">A:\\SBEMAIL_CLOCK> </div>
                        <div class="sbemail-startup-line sbemail-startup-delay-1" id="loadingMsg" style="display: none;">Loading Strong Bad's Temporal Interface...</div>
                        <div class="sbemail-startup-line sbemail-startup-delay-2" id="virusMsg" style="display: none;">Scanning for The Cheat viruses... NONE FOUND</div>
                        <div class="sbemail-startup-line sbemail-startup-delay-3" id="emailMsg" style="display: none;">Checking email... 0 new messages</div>
                        <div class="sbemail-startup-line sbemail-startup-delay-4" id="readyMsg" style="display: none;">${getRandomStartupPhrase()}</div>
                    </div>
                    <div class="sbemail-clock-display" id="sbemailClockDisplay">
                        <div class="sbemail-timezone-control">
                            <label class="sbemail-timezone-label">TIMEZONE: <span id="sbemailTimezoneDescription">UTC+0 (LOCAL TIME)</span></label>
                            <input type="range" id="sbemailTimezoneSlider" class="sbemail-timezone-slider" min="0" max="38" value="0" step="1">
                        </div>
                        <div class="sbemail-clock-day" id="sbemailClockDay"></div>
                        <div class="sbemail-clock-date" id="sbemailClockDate"></div>
                        <div class="sbemail-clock-time" id="sbemailClockTime"></div>
                    </div>
                    <div class="sbemail-weather-search" id="sbemailWeatherSearch" style="display: none;">
                        <div class="sbemail-input-container">
                            <span class="sbemail-search-prompt">WEATHER SEARCH:</span>
                            <input type="text" class="sbemail-search-input" id="sbemailSearchInput" placeholder="ENTER CITY NAME">
                            <button class="sbemail-search-button" id="sbemailSearchButton">SEARCH</button>
                        </div>
                        <div class="sbemail-weather-ticker" id="sbemailWeatherTicker" style="display: none;">
                            <div class="sbemail-ticker-container">
                                <span class="sbemail-ticker-label">WEATHER DATA:</span>
                                <div class="sbemail-ticker-content" id="sbemailTickerContent">NO DATA LOADED</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sbemail-terminal-scrollbar">
                    <div class="sbemail-scrollbar-thumb"></div>
                </div>
            </div>
            <div class="sbemail-terminal-footer">
                <!-- Footer area -->
            </div>
        </div>
        <div class="sbemail-keyboard" id="sbemailKeyboard">
            <div class="sbemail-keyboard-body">
                <div class="sbemail-keyboard-main">
                    <div class="sbemail-keyboard-row sbemail-row-1">
                        <div class="sbemail-key">ESC</div>
                        <div class="sbemail-key-gap"></div>
                        <div class="sbemail-key">F1</div>
                        <div class="sbemail-key">F2</div>
                        <div class="sbemail-key">F3</div>
                        <div class="sbemail-key">F4</div>
                        <div class="sbemail-key-gap"></div>
                        <div class="sbemail-key">F5</div>
                        <div class="sbemail-key">F6</div>
                        <div class="sbemail-key">F7</div>
                        <div class="sbemail-key">F8</div>
                        <div class="sbemail-key-gap"></div>
                        <div class="sbemail-key">F9</div>
                        <div class="sbemail-key">F10</div>
                        <div class="sbemail-key">F11</div>
                        <div class="sbemail-key">F12</div>
                    </div>
                    <div class="sbemail-keyboard-row sbemail-row-2">
                        <div class="sbemail-key">\`</div>
                        <div class="sbemail-key">1</div>
                        <div class="sbemail-key">2</div>
                        <div class="sbemail-key">3</div>
                        <div class="sbemail-key">4</div>
                        <div class="sbemail-key">5</div>
                        <div class="sbemail-key">6</div>
                        <div class="sbemail-key">7</div>
                        <div class="sbemail-key">8</div>
                        <div class="sbemail-key">9</div>
                        <div class="sbemail-key">0</div>
                        <div class="sbemail-key">-</div>
                        <div class="sbemail-key">=</div>
                        <div class="sbemail-key sbemail-key-backspace">BACKSPACE</div>
                    </div>
                    <div class="sbemail-keyboard-row sbemail-row-3">
                        <div class="sbemail-key sbemail-key-tab">TAB</div>
                        <div class="sbemail-key">Q</div>
                        <div class="sbemail-key">W</div>
                        <div class="sbemail-key">E</div>
                        <div class="sbemail-key">R</div>
                        <div class="sbemail-key">T</div>
                        <div class="sbemail-key">Y</div>
                        <div class="sbemail-key">U</div>
                        <div class="sbemail-key">I</div>
                        <div class="sbemail-key">O</div>
                        <div class="sbemail-key">P</div>
                        <div class="sbemail-key">[</div>
                        <div class="sbemail-key">]</div>
                        <div class="sbemail-key sbemail-key-backslash">\\</div>
                    </div>
                    <div class="sbemail-keyboard-row sbemail-row-4">
                        <div class="sbemail-key sbemail-key-caps">CAPS</div>
                        <div class="sbemail-key">A</div>
                        <div class="sbemail-key">S</div>
                        <div class="sbemail-key">D</div>
                        <div class="sbemail-key">F</div>
                        <div class="sbemail-key">G</div>
                        <div class="sbemail-key">H</div>
                        <div class="sbemail-key">J</div>
                        <div class="sbemail-key">K</div>
                        <div class="sbemail-key">L</div>
                        <div class="sbemail-key">;</div>
                        <div class="sbemail-key">'</div>
                        <div class="sbemail-key sbemail-key-enter">ENTER</div>
                    </div>
                    <div class="sbemail-keyboard-row sbemail-row-5">
                        <div class="sbemail-key sbemail-key-shift-left">SHIFT</div>
                        <div class="sbemail-key">Z</div>
                        <div class="sbemail-key">X</div>
                        <div class="sbemail-key">C</div>
                        <div class="sbemail-key">V</div>
                        <div class="sbemail-key">B</div>
                        <div class="sbemail-key">N</div>
                        <div class="sbemail-key">M</div>
                        <div class="sbemail-key">,</div>
                        <div class="sbemail-key">.</div>
                        <div class="sbemail-key">/</div>
                        <div class="sbemail-key sbemail-key-shift-right">SHIFT</div>
                    </div>
                    <div class="sbemail-keyboard-row sbemail-row-6">
                        <div class="sbemail-key sbemail-key-ctrl">CTRL</div>
                        <div class="sbemail-key sbemail-key-alt">ALT</div>
                        <div class="sbemail-key sbemail-key-space">SPACE</div>
                        <div class="sbemail-key sbemail-key-alt">ALT</div>
                        <div class="sbemail-key sbemail-key-ctrl">CTRL</div>
                    </div>
                </div>
                <div class="sbemail-keyboard-numpad">
                    <div class="sbemail-keyboard-row sbemail-numpad-row-1">
                        <div class="sbemail-key">NUM</div>
                        <div class="sbemail-key">/</div>
                        <div class="sbemail-key">*</div>
                        <div class="sbemail-key">-</div>
                    </div>
                    <div class="sbemail-keyboard-row sbemail-numpad-row-2">
                        <div class="sbemail-key">7</div>
                        <div class="sbemail-key">8</div>
                        <div class="sbemail-key">9</div>
                        <div class="sbemail-key sbemail-key-plus">+</div>
                    </div>
                    <div class="sbemail-keyboard-row sbemail-numpad-row-3">
                        <div class="sbemail-key">4</div>
                        <div class="sbemail-key">5</div>
                        <div class="sbemail-key">6</div>
                    </div>
                    <div class="sbemail-keyboard-row sbemail-numpad-row-4">
                        <div class="sbemail-key">1</div>
                        <div class="sbemail-key">2</div>
                        <div class="sbemail-key">3</div>
                        <div class="sbemail-key sbemail-key-enter-num">ENT</div>
                    </div>
                    <div class="sbemail-keyboard-row sbemail-numpad-row-5">
                        <div class="sbemail-key sbemail-key-zero">0</div>
                        <div class="sbemail-key">.</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add Compy 386 to document
    document.body.insertAdjacentHTML('beforeend', compyHTML);
    
    // Start the authentic terminal sequence
    setTimeout(() => {
        startTerminalSequence();
    }, 1000);
}

// Start authentic terminal sequence with A:\ prompt and DOS navigation
function startTerminalSequence() {
    // Show A:\> prompt immediately with blinking cursor
    const initialPrompt = document.getElementById('initialPrompt');
    if (initialPrompt) {
        initialPrompt.style.opacity = '1';
        initialPrompt.classList.add('ready-for-input');
    }
    
    // Let scanlines run for about 8-10 seconds (1-2 cycles at 4.2s each) while cursor blinks
    setTimeout(() => {
        // Remove cursor and start the DOS typing sequence
        if (initialPrompt) {
            initialPrompt.classList.remove('ready-for-input');
        }
        // Start the DOS startup sequence
        showDOSStartup();
    }, 8400); // About 2 scanner cycles
}

// Simulate typing with realistic delays - append to existing prompt
function typeText(element, text, callback, typingSpeed = 80) {
    if (!element) {
        if (callback) callback();
        return;
    }
    
    element.style.opacity = '1';
    let i = 0;
    const basePrompt = element.textContent; // Keep existing prompt content
    
    const typeNextChar = () => {
        if (i < text.length) {
            element.textContent = basePrompt + text.substring(0, i + 1);
            i++;
            // Vary typing speed slightly for human feel
            const delay = typingSpeed + (Math.random() * 40 - 20);
            setTimeout(typeNextChar, delay);
        } else {
            // Add brief pause at end, then call callback
            setTimeout(() => {
                if (callback) callback();
            }, 200);
        }
    };
    
    typeNextChar();
}

// Simulate DOS startup sequence with typing
function showDOSStartup() {
    // Step 1: Type "cd sbemail_clock" command on the existing A:\> prompt
    const initialPrompt = document.getElementById('initialPrompt');
    
    typeText(initialPrompt, 'cd sbemail_clock', () => {
        // Step 2: Add new line and show new prompt A:\SBEMAIL_CLOCK>
        setTimeout(() => {
            const newPrompt = document.getElementById('newPrompt');
            newPrompt.style.display = 'block';
            newPrompt.style.opacity = '1';
            newPrompt.classList.add('ready-for-input');
            
            // Step 3: After brief pause, type exe command on new prompt
            setTimeout(() => {
                newPrompt.classList.remove('ready-for-input');
                
                typeText(newPrompt, 'sbemail_clock.exe', () => {
                    // Step 4: Start prsbemailram output
                    showProgramOutput();
                }, 70);
                
            }, 1000); // 1 second pause at new prompt
        }, 300); // Brief pause after cd command
    }, 90); // Slightly slower typing for cd command
}

// Show prsbemailram output lines one at a time
function showProgramOutput() {
    const outputElements = [
        { id: 'loadingMsg', text: 'Loading Strong Bad\'s Temporal Interface...' },
        { id: 'virusMsg', text: 'Scanning for The Cheat viruses... NONE FOUND' },
        { id: 'emailMsg', text: 'Checking email... 0 new messages' },
        { id: 'readyMsg', text: getRandomStartupPhrase() }
    ];
    
    let currentLineIndex = 0;
    
    const showNextLine = () => {
        if (currentLineIndex < outputElements.length) {
            const line = outputElements[currentLineIndex];
            const element = document.getElementById(line.id);
            if (element) {
                element.style.display = 'block';
                element.textContent = line.text;
                element.style.opacity = '1';
            }
            
            currentLineIndex++;
            
            // Short delay between output lines (400-700ms)
            const randomDelay = 400 + Math.random() * 300;
            setTimeout(showNextLine, randomDelay);
        } else {
            // All output lines shown, show clock display
            setTimeout(() => {
                const startup = document.querySelector('.sbemail-terminal-startup');
                if (startup) startup.style.opacity = '0.4';
                
                const clockDisplay = document.getElementById('sbemailClockDisplay');
                if (clockDisplay) {
                    clockDisplay.style.opacity = '1';
                    // Auto-scroll to show the clock
                    clockDisplay.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    
                    // Wait additional time after clock panel is rendered to show weather tool
                    setTimeout(() => {
                        const weatherSearch = document.getElementById('sbemailWeatherSearch');
                        if (weatherSearch) {
                            weatherSearch.style.display = 'block';
                            weatherSearch.style.opacity = '0';
                            setTimeout(() => {
                                weatherSearch.style.opacity = '1';
                                weatherSearch.style.transition = 'opacity 0.5s ease-in';
                                
                                // Auto-scroll to show the weather widget
                                scrollToWeatherWidget();
                            }, 100);
                        }
                        
                        // Initialize weather search functionality after displaying
                        initOgWeatherSearch();
                        
                        // Initialize timezone slider functionality
                        initOgTimezoneSlider();
                    }, 1500); // Show weather tool 1.5 seconds after clock panel
                }
            }, 800); // Brief pause after final output line
        }
    };
    
    // Start showing output lines after a brief pause
    setTimeout(showNextLine, 400);
}

// Type text character by character into an element
function typeTextIntoElement(selector, text, onComplete) {
    const element = document.querySelector(selector);
    if (!element) {
        if (onComplete) onComplete();
        return;
    }
    
    element.textContent = ''; // Clear any existing text
    element.classList.add('typing');
    
    let currentIndex = 0;
    
    const typeNextCharacter = () => {
        if (currentIndex < text.length) {
            element.textContent += text[currentIndex];
            currentIndex++;
            
            // Variable typing speed (50-150ms) to simulate human typing
            const typingSpeed = 50 + Math.random() * 100;
            setTimeout(typeNextCharacter, typingSpeed);
        } else {
            // Remove cursor when done typing this line
            setTimeout(() => {
                element.classList.remove('typing');
                if (onComplete) onComplete();
            }, 200);
        }
    };
    
    // Start typing after a brief pause
    setTimeout(typeNextCharacter, 100);
}

// Start the Compy 386 clock updates (mimics clocker-improved behavior)
function startCompyClock() {
    // Update immediately
    updateCompyClock();
    
    // Then update every second (like checking emails)
    sbemailTerminalInterval = setInterval(() => {
        updateCompyClock();
    }, 1000);
}

// Update Compy 386 clock display (replicates clocker-improved formatting)
function updateCompyClock() {
    // Get timezone offset from window or main system
    let timezoneOffset = 0;
    if (typeof window.currentTimezoneOffset !== 'undefined') {
        timezoneOffset = window.currentTimezoneOffset;
    } else if (typeof currentTimezoneOffset !== 'undefined') {
        timezoneOffset = currentTimezoneOffset;
    }
    
    // Create date with timezone offset
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const targetTime = new Date(utc + (timezoneOffset * 3600000));
    
    
    // Format day (same as clocker-improved)
    const dayStr = targetTime.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Format date with ordinal suffix (same lsbemailic as clocker-improved)
    const month = targetTime.toLocaleDateString('en-US', { month: 'short' }).replace('May', 'May');
    const day = targetTime.getDate();
    const year = targetTime.getFullYear();
    
    // Apply ordinal suffix lsbemailic from clocker-improved
    let ordinalSuffix;
    if (day >= 11 && day <= 13) {
        ordinalSuffix = 'th';
    } else {
        const lastDigit = day % 10;
        switch (lastDigit) {
            case 1: ordinalSuffix = 'st'; break;
            case 2: ordinalSuffix = 'nd'; break;
            case 3: ordinalSuffix = 'rd'; break;
            default: ordinalSuffix = 'th'; break;
        }
    }
    
    const dateStr = `${month}. ${day}${ordinalSuffix}, ${year}`;
    
    // Format time without timezone (we'll add it manually)
    const timeStr = targetTime.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true
    }).replace(/\s+/g, ' ');
    
    // Get the current timezone info for display with DST consideration
    let timezoneAbbr = '';
    const timezoneSlider = document.getElementById('sbemailTimezoneSlider');
    if (timezoneSlider && typeof timezones !== 'undefined') {
        const index = parseInt(timezoneSlider.value);
        if (timezones[index]) {
            const tzInfo = timezones[index];
            
            // Check if DST is currently active using the main system's lsbemailic
            const now = new Date();
            let isDstActive = false;
            
            if (tzInfo.daylightSaving && tzInfo.daylightSaving.observesDST) {
                // Use the main system's DST detection function if available
                if (typeof isDSTActiveForTimezone === 'function') {
                    isDstActive = isDSTActiveForTimezone(now, tzInfo);
                } else {
                    // Fallback to simpler DST check for US/Canada timezones
                    const month = now.getMonth();
                    const day = now.getDate();
                    
                    if (month > 2 && month < 10) { // April through September
                        isDstActive = true;
                    } else if (month === 2) { // March - check for second Sunday
                        const firstDay = new Date(now.getFullYear(), 2, 1);
                        const firstSunday = 1 + (7 - firstDay.getDay()) % 7;
                        const secondSunday = firstSunday + 7;
                        isDstActive = day >= secondSunday;
                    } else if (month === 10) { // November - check for first Sunday
                        const firstDay = new Date(now.getFullYear(), 10, 1);
                        const firstSunday = 1 + (7 - firstDay.getDay()) % 7;
                        isDstActive = day < firstSunday;
                    }
                }
            }
            
            // Use DST abbreviation if active, otherwise use standard
            if (isDstActive && tzInfo.daylightSaving && tzInfo.daylightSaving.dstAbbreviation) {
                timezoneAbbr = tzInfo.daylightSaving.dstAbbreviation;
            } else {
                timezoneAbbr = tzInfo.abbreviation || tzInfo.offset;
            }
        }
    }
    
    // Combine time with timezone abbreviation
    const fullTimeStr = timezoneAbbr ? `${timeStr} ${timezoneAbbr}` : timeStr;
    
    // Update Compy 386 display
    const dayElement = document.getElementById('sbemailClockDay');
    const dateElement = document.getElementById('sbemailClockDate');
    const timeElement = document.getElementById('sbemailClockTime');
    
    if (dayElement) dayElement.textContent = dayStr.toUpperCase();
    if (dateElement) dateElement.textContent = dateStr.toUpperCase();
    if (timeElement) timeElement.textContent = fullTimeStr.toUpperCase();
}


// SBEMAIL Weather Ticker System (in weather search area)
let sbemailWeatherScrollInterval = null;
let sbemailWeatherText = '';
let sbemailWeatherScrollPosition = 0;

// Update weather ticker in the search tool area
function updateOgWeatherTicker() {
    console.log('🔧 SBEMAIL: updateOgWeatherTicker called');
    const tickerContent = document.getElementById('sbemailTickerContent');
    if (!tickerContent) {
        console.log('❌ SBEMAIL: tickerContent element not found');
        return;
    }
    
    // Try to get weather data from main weather system
    const weatherScroll = document.getElementById('weatherScroll');
    console.log('🔧 SBEMAIL: weatherScroll element:', weatherScroll);
    console.log('🔧 SBEMAIL: weatherScroll children:', weatherScroll ? weatherScroll.children.length : 'null');
    let newWeatherText = '';
    
    // Extract weather data more efficiently from the main weather system
    if (weatherScroll && weatherScroll.children.length > 0) {
        console.log('🔧 SBEMAIL: Found weather data in hidden scroll element');
        
        // Get basic info
        const citySeparator = weatherScroll.querySelector('.city-separator');
        const city = citySeparator ? citySeparator.textContent.replace(/🌐/g, '').trim() : 'UNKNOWN';
        
        // Get only the first content block to avoid massive duplication
        const firstBlock = weatherScroll.children[0];
        if (firstBlock) {
            console.log('🔧 SBEMAIL: Processing first weather block only');
            
            // Extract current weather
            const currentItems = firstBlock.querySelectorAll('.weather-item');
            const coords = firstBlock.querySelector('.weather-coords')?.textContent || '';
            
            let weatherParts = [`🌐 ${city}`];
            
            // Process only unique weather items (avoid duplicates)
            const processedDays = new Set();
            
            currentItems.forEach(item => {
                const dayElement = item.querySelector('.weather-day');
                const tempElement = item.querySelector('.weather-temp');
                const iconElement = item.querySelector('.weather-icon');
                const descElement = item.querySelector('.weather-desc');
                const humidityElement = item.querySelector('.weather-humidity');
                const windElement = item.querySelector('.weather-wind');
                
                if (dayElement && tempElement) {
                    const day = dayElement.textContent.trim();
                    const temp = tempElement.textContent.trim();
                    const icon = iconElement ? iconElement.textContent.trim() : '';
                    const desc = descElement ? descElement.textContent.trim() : '';
                    const humidity = humidityElement ? humidityElement.textContent.trim() : '';
                    const wind = windElement ? windElement.textContent.trim() : '';
                    
                    // Only add if we haven't seen this day yet
                    if (!processedDays.has(day)) {
                        processedDays.add(day);
                        let itemText = `${day} ${icon} ${temp} ${desc}`;
                        if (humidity) itemText += ` ${humidity}`;
                        if (wind) itemText += ` ${wind}`;
                        weatherParts.push(itemText);
                    }
                }
            });
            
            if (coords) {
                weatherParts.push(coords);
            }
            
            newWeatherText = weatherParts.join(' • ') + ' • ';
            console.log('🔧 SBEMAIL: Built optimized weather text:', newWeatherText);
        } else {
            newWeatherText = 'WEATHER: NO DATA AVAILABLE • ';
        }
    } else {
        newWeatherText = 'WEATHER: LOADING DATA... • ';
        console.log('🔧 SBEMAIL: No weatherScroll or no children');
    }
    
    // Update weather text if changed and start/restart scrolling
    if (newWeatherText !== sbemailWeatherText) {
        sbemailWeatherText = newWeatherText;
        sbemailWeatherScrollPosition = 0;
        startOgWeatherTickerScrolling();
    }
}

// Start smooth CSS-based scrolling animation for weather ticker
function startOgWeatherTickerScrolling() {
    const tickerContent = document.getElementById('sbemailTickerContent');
    if (!tickerContent || !sbemailWeatherText) return;
    
    // Clear existing interval if any
    if (sbemailWeatherScrollInterval) {
        clearInterval(sbemailWeatherScrollInterval);
        sbemailWeatherScrollInterval = null;
    }
    
    console.log('🔧 SBEMAIL: Starting smooth CSS scrolling');
    
    // Create scrolling container with CSS animation
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'sbemail-ticker-scroll';
    scrollContainer.textContent = sbemailWeatherText;
    
    // Clear and add the scrolling element
    tickerContent.innerHTML = '';
    tickerContent.appendChild(scrollContainer);
    
    console.log('🔧 SBEMAIL: Smooth scrolling started with text:', sbemailWeatherText);
}

// Strong Bad's sbemail-specific keyboard handlers
function addSbemailKeyboardHandlers() {
    document.addEventListener('keydown', handleSbemailKeydown);
}

function removeSbemailKeyboardHandlers() {
    document.removeEventListener('keydown', handleSbemailKeydown);
}

function handleSbemailKeydown(event) {
    // Ctrl+C behavior for Strong Bad's Compy 386
    if (event.ctrlKey && event.key === 'c') {
        event.preventDefault();
        
        // Show Strong Bad-style exit message
        const exitTime = new Date().toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true,
            timeZoneName: 'short'
        });
        
        const exitDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const exitDate = formatDateWithOrdinal(new Date());
        
        alert(`Strong Bad's Compy 386 - SYSTEM SHUTDOWN\n\n"Oh, The Cheat! You deleted my emails again!"\n\nLsbemailged off at ${exitTime} on ${exitDay}, ${exitDate}.\n\nSwitching to next theme... Email me at strongbad@homestarrunner.com`);
        
        // Switch to random theme
        if (typeof switchToRandomTheme === 'function') {
            switchToRandomTheme('sbemail');
        }
    }
}

// Format date with ordinal suffix (helper function)
function formatDateWithOrdinal(date) {
    const month = date.toLocaleDateString('en-US', { month: 'short' }).replace('May', 'May');
    const day = date.getDate();
    const year = date.getFullYear();
    
    let ordinalSuffix;
    if (day >= 11 && day <= 13) {
        ordinalSuffix = 'th';
    } else {
        const lastDigit = day % 10;
        switch (lastDigit) {
            case 1: ordinalSuffix = 'st'; break;
            case 2: ordinalSuffix = 'nd'; break;
            case 3: ordinalSuffix = 'rd'; break;
            default: ordinalSuffix = 'th'; break;
        }
    }
    
    return `${month}. ${day}${ordinalSuffix}, ${year}`;
}

// Pulsing Stars System
function startPulsingStars() {
    // Create stars immediately and then at random intervals
    createPulsingStar();
    
    sbemailStarsInterval = setInterval(() => {
        createPulsingStar();
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds
}

function stopPulsingStars() {
    if (sbemailStarsInterval) {
        clearInterval(sbemailStarsInterval);
        sbemailStarsInterval = null;
    }
    
    // Remove any existing stars
    const existingStars = document.querySelectorAll('.sbemail-pulsing-star');
    existingStars.forEach(star => star.remove());
}

function createPulsingStar() {
    // Only create if there are fewer than 3 stars visible (increased frequency in blue field)
    const existingStars = document.querySelectorAll('.sbemail-pulsing-star');
    if (existingStars.length >= 3) return;
    
    const star = document.createElement('div');
    star.className = 'sbemail-pulsing-star';
    star.innerHTML = '★'; // White 5-pointed star
    
    // Avoid the Compy 386 center area (800x600) and prefer edges/corners
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const terminalWidth = 800;
    const terminalHeight = 600;
    
    let x, y;
    let attempts = 0;
    
    do {
        x = Math.random() * (window.innerWidth - 100);
        y = Math.random() * (window.innerHeight - 100);
        attempts++;
        
        // Check if position overlaps with terminal area
        const overlapsTerminal = (
            x >= centerX - terminalWidth/2 - 50 && 
            x <= centerX + terminalWidth/2 + 50 &&
            y >= centerY - terminalHeight/2 - 50 && 
            y <= centerY + terminalHeight/2 + 50
        );
        
        // Break after 10 attempts to avoid infinite loop
        if (attempts > 10 || !overlapsTerminal) break;
        
    } while (attempts <= 10);
    
    star.style.left = x + 'px';
    star.style.top = y + 'px';
    
    document.body.appendChild(star);
    
    // Remove star after animation completes
    setTimeout(() => {
        if (star.parentNode) {
            star.remove();
        }
    }, 3000);
}

// Boxing Gloves Click System
function addBoxingGlovesHandler() {
    sbemailClickHandler = handleBoxingGlovesClick;
    document.addEventListener('click', sbemailClickHandler);
}

function removeBoxingGlovesHandler() {
    if (sbemailClickHandler) {
        document.removeEventListener('click', sbemailClickHandler);
        sbemailClickHandler = null;
    }
    
    // Remove any existing gloves and Trsbemaildors
    const existingGloves = document.querySelectorAll('.sbemail-boxing-gloves');
    const existingGlovesPairs = document.querySelectorAll('.sbemail-boxing-gloves-pair');
    const existingTrsbemaildors = document.querySelectorAll('.sbemail-trogdor, .sbemail-trogdor-test');
    existingGloves.forEach(gloves => gloves.remove());
    existingGlovesPairs.forEach(glovesPair => glovesPair.remove());
    existingTrsbemaildors.forEach(trogdor => trogdor.remove());
}

function handleBoxingGlovesClick(event) {
    // Don't trigger if clicking on the Compy 386 window
    if (event.target.closest('.sbemail-terminal-window')) return;
    
    // 10% chance for Trsbemaildor, 90% chance for boxing gloves
    const isTrsbemaildor = Math.random() < 0.1;
    
    if (isTrsbemaildor) {
        createTrogdor(event.clientX, event.clientY);
    } else {
        createBoxingGloves(event.clientX, event.clientY);
    }
}

function createBoxingGloves(x, y) {
    const glovesContainer = document.createElement('div');
    glovesContainer.className = 'sbemail-boxing-gloves-pair';
    
    // Create left glove
    const leftGlove = document.createElement('div');
    leftGlove.className = 'sbemail-boxing-gloves-left';
    leftGlove.innerHTML = '🥊'; // Boxing glove emoji
    
    // Create right glove
    const rightGlove = document.createElement('div');
    rightGlove.className = 'sbemail-boxing-gloves-right';
    rightGlove.innerHTML = '🥊'; // Boxing glove emoji
    
    glovesContainer.appendChild(leftGlove);
    glovesContainer.appendChild(rightGlove);
    
    // Start at click position (centered between the gloves)
    glovesContainer.style.left = (x - 60) + 'px'; // Center the pair with larger spacing
    glovesContainer.style.top = y + 'px';
    
    document.body.appendChild(glovesContainer);
    
    // Animate to random end position - move as a pair
    const endX = Math.random() * (window.innerWidth - 240);
    const endY = Math.random() * (window.innerHeight - 120);
    
    // Apply random movement during animation - gloves move tsbemailether
    setTimeout(() => {
        glovesContainer.style.left = endX + 'px';
        glovesContainer.style.top = endY + 'px';
        glovesContainer.style.transition = 'left 4s ease-out, top 4s ease-out';
    }, 100);
    
    // Remove gloves after animation completes
    setTimeout(() => {
        if (glovesContainer.parentNode) {
            glovesContainer.remove();
        }
    }, 4000);
}

function createTrogdor(x, y) {
    const trogdor = document.createElement('div');
    trogdor.className = 'sbemail-trogdor-test';
    trogdor.innerHTML = '🐉'; // Oriental dragon emoji representing Trogdor the Burninator
    
    // Start at click position
    trogdor.style.left = x + 'px';
    trogdor.style.top = y + 'px';
    
    document.body.appendChild(trogdor);
    
    // Trsbemaildor burninates across the screen more dramatically
    const endX = Math.random() * (window.innerWidth - 300);
    const endY = Math.random() * (window.innerHeight - 250);
    
    // Apply random movement during animation - Trsbemaildor moves more wildly
    setTimeout(() => {
        trogdor.style.left = endX + 'px';
        trogdor.style.top = endY + 'px';
        trogdor.style.transition = 'left 6s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 100);
    
    // Remove Trsbemaildor after burninating completes
    setTimeout(() => {
        if (trogdor.parentNode) {
            trogdor.remove();
        }
    }, 6000);
}

// Initialize SBEMAIL timezone slider functionality
function initOgTimezoneSlider() {
    const timezoneSlider = document.getElementById('sbemailTimezoneSlider');
    
    if (timezoneSlider) {
        console.log('🕰️ SBEMAIL: Initializing timezone slider');
        
        // Sync with main timezone system
        const mainSlider = document.getElementById('timezoneSlider');
        if (mainSlider) {
            timezoneSlider.value = mainSlider.value;
            console.log('🕰️ SBEMAIL: Synced slider value from main system:', mainSlider.value);
        }
        
        // Initial display update
        updateOgTimezoneDisplay();
        
        // Force clock update to show correct timezone
        updateCompyClock();
        
        timezoneSlider.addEventListener('input', () => {
            console.log('🕰️ SBEMAIL: Timezone slider changed to:', timezoneSlider.value);
            
            // Update main timezone system
            if (mainSlider) {
                mainSlider.value = timezoneSlider.value;
                // Trigger main timezone change event
                const event = new Event('input', { bubbles: true });
                mainSlider.dispatchEvent(event);
            }
            
            // Update the display and clock immediately
            updateOgTimezoneDisplay();
            updateCompyClock();
            
            // Force a small delay to ensure DOM updates
            setTimeout(() => {
                updateOgTimezoneDisplay();
                updateCompyClock();
            }, 50);
        });
    }
}

// Update SBEMAIL timezone display
function updateOgTimezoneDisplay() {
    const timezoneSlider = document.getElementById('sbemailTimezoneSlider');
    const timezoneDescription = document.getElementById('sbemailTimezoneDescription');
    
    if (timezoneSlider && timezoneDescription && typeof timezones !== 'undefined') {
        const index = parseInt(timezoneSlider.value);
        console.log('🕰️ SBEMAIL: Updating timezone display for index:', index);
        
        if (timezones[index]) {
            const tzInfo = timezones[index];
            console.log('🕰️ SBEMAIL: Timezone info:', tzInfo);
            
            // Check if DST is currently active using the main system's lsbemailic
            const now = new Date();
            let isDstActive = false;
            let displayOffset = tzInfo.offset;
            let displayAbbr = tzInfo.abbreviation;
            
            if (tzInfo.daylightSaving && tzInfo.daylightSaving.observesDST) {
                // Use the main system's DST detection function if available
                if (typeof isDSTActiveForTimezone === 'function') {
                    isDstActive = isDSTActiveForTimezone(now, tzInfo);
                } else {
                    // Fallback to more accurate DST check for US/Canada timezones
                    const month = now.getMonth();
                    const day = now.getDate();
                    
                    if (month > 2 && month < 10) { // April through September
                        isDstActive = true;
                    } else if (month === 2) { // March - check for second Sunday
                        const firstDay = new Date(now.getFullYear(), 2, 1);
                        const firstSunday = 1 + (7 - firstDay.getDay()) % 7;
                        const secondSunday = firstSunday + 7;
                        isDstActive = day >= secondSunday;
                    } else if (month === 10) { // November - check for first Sunday
                        const firstDay = new Date(now.getFullYear(), 10, 1);
                        const firstSunday = 1 + (7 - firstDay.getDay()) % 7;
                        isDstActive = day < firstSunday;
                    }
                }
                
                if (isDstActive && tzInfo.daylightSaving.dstOffset) {
                    displayOffset = tzInfo.daylightSaving.dstOffset;
                    displayAbbr = tzInfo.daylightSaving.dstAbbreviation || tzInfo.daylightSaving.abbreviation;
                }
            }
            
            // Create the timezone description text with DST indication
            let timezoneName = tzInfo.name || 'LOCAL TIME';
            
            // If DST is active and we have DST info, modify the name
            if (isDstActive && tzInfo.daylightSaving && tzInfo.daylightSaving.dstAbbreviation) {
                // Replace "Standard" with "Daylight" in the name if it exists
                if (timezoneName.includes('Standard')) {
                    timezoneName = timezoneName.replace('Standard', 'Daylight');
                }
            }
            
            // Abbreviate DAYLIGHT and STANDARD in timezone names
            timezoneName = timezoneName.replace(/\bDaylight\b/g, 'DL').replace(/\bStandard\b/g, 'STD');
            
            const timezoneText = `${displayOffset} (${timezoneName})`.toUpperCase();
            timezoneDescription.textContent = timezoneText;
            
            console.log('🕰️ SBEMAIL: Updated timezone description to:', timezoneText);
            
            // Update global timezone offset for the clock
            // Parse the offset (e.g., "UTC-05:00" -> -5)
            const offsetStr = displayOffset.replace('UTC', '');
            let offset;
            
            if (offsetStr.includes(':')) {
                const [hours, minutes] = offsetStr.split(':');
                offset = parseFloat(hours) + (parseFloat(minutes) / 60) * Math.sign(parseFloat(hours));
            } else {
                offset = parseFloat(offsetStr);
            }
            
            window.currentTimezoneOffset = offset;
            console.log('🕰️ SBEMAIL: Set timezone offset to:', offset, '(DST active:', isDstActive + ')');
        }
    }
}

// Initialize SBEMAIL weather search functionality
function initOgWeatherSearch() {
    const searchButton = document.getElementById('sbemailSearchButton');
    const searchInput = document.getElementById('sbemailSearchInput');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', handleOgWeatherSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleOgWeatherSearch();
            }
        });
    }
}

// Handle weather search from SBEMAIL theme
async function handleOgWeatherSearch() {
    const searchInput = document.getElementById('sbemailSearchInput');
    if (!searchInput || !searchInput.value.trim()) return;
    
    const city = searchInput.value.trim();
    
    // Update the main city input and trigger weather search
    const mainCityInput = document.getElementById('cityInput');
    if (mainCityInput) {
        mainCityInput.value = city;
        
        // Trigger the main weather search function
        if (typeof handleWeatherRequest === 'function') {
            try {
                await handleWeatherRequest();
                
                // Show the weather ticker after successful search
                setTimeout(() => {
                    console.log('🔧 SBEMAIL: Attempting to show weather ticker');
                    const weatherTicker = document.getElementById('sbemailWeatherTicker');
                    if (weatherTicker) {
                        console.log('🔧 SBEMAIL: Weather ticker found, showing it');
                        weatherTicker.style.display = 'block';
                        updateOgWeatherTicker(); // Start the ticker
                        
                        // Auto-scroll to show the weather ticker
                        setTimeout(() => {
                            scrollToWeatherWidget();
                        }, 500); // Small delay to let ticker render
                    } else {
                        console.log('❌ SBEMAIL: Weather ticker element not found');
                    }
                }, 1000); // Wait a second for weather data to load
                
            } catch (error) {
                console.error('Weather search failed:', error);
            }
        }
    }
    
    // Clear both SBEMAIL and main inputs for consistency
    searchInput.value = '';
    if (mainCityInput) {
        mainCityInput.value = '';
    }
}

// Export functions for modular theme system
if (typeof window !== 'undefined') {
    window.initSBEMAILTheme = initSBEMAILTheme;
    window.cleanupSBEMAILTheme = cleanupSBEMAILTheme;
}