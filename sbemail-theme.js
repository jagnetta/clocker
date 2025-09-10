// SBEMAIL Theme - Strong Bad's Compy 386 from HomestarRunner.com
// Authentic sbemail experience with clocker-improved functionality

let sbemailTerminalInterval = null;
let sbemailStartTime = null;
let sbemailStarsInterval = null;
let sbemailClickHandler = null;
let sbemailRestartHandler = null;
let sbemailTickerProtected = false; // Flag to protect the precious weather ticker

// Simple terminal scroll - just scroll to bottom like any terminal
function smoothScrollTerminal() {
    const terminalContent = document.getElementById('sbemailTerminalContent');
    
    if (terminalContent) {
        // Simple scroll to bottom - like pressing Enter in a terminal
        terminalContent.scrollTop = terminalContent.scrollHeight - terminalContent.clientHeight;
    }
}

// Auto-scroll to show weather widget in Compy 386 screen
function scrollToWeatherWidget() {
    smoothScrollTerminal();
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
    
    // Record theme start time
    sbemailStartTime = Date.now();
    
    // Create Compy 386 computer
    createCompy386();
    
    // Add sbemail-specific keyboard handlers
    addSbemailKeyboardHandlers();
    
    // Start pulsing stars
    startPulsingStars();
    
    // Add boxing gloves click handler
    addBoxingGlovesHandler();
    
}

// Cleanup Strong Bad's Compy 386 Theme - Complete cleanup
function cleanupSBEMAILTheme() {
    
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
    const sbemailElements = document.querySelectorAll('.sbemail-boxing-gloves, .sbemail-boxing-gloves-pair, .sbemail-trogdor, .sbemail-trogdor-test, .sbemail-pulsing-star, .sbemail-crt-shutdown');
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
                    <!-- Terminal starts completely empty - all content added line by line -->
                </div>
            </div>
            <div class="sbemail-terminal-footer">
                <div class="sbemail-theme-controls">
                    <button class="sbemail-control-button theme-btn" data-theme="matrix">
                        <span>MATRIX</span>
                    </button>
                    <button class="sbemail-control-button theme-btn" data-theme="lcars">
                        <span>LCARS</span>
                    </button>
                    <button class="sbemail-control-button theme-btn" data-theme="thor">
                        <span>THOR</span>
                    </button>
                    <button class="sbemail-control-button theme-btn active" data-theme="sbemail">
                        <span>SBEMAIL</span>
                    </button>
                    <button class="sbemail-control-button theme-btn" data-theme="linux">
                        <span>LINUX</span>
                    </button>
                </div>
                <div class="sbemail-footer-logo"></div>
            </div>
        </div>
    `;
    
    // Add Compy 386 to document
    document.body.insertAdjacentHTML('beforeend', compyHTML);
    
    // Add theme control button event listeners
    addThemeControlListeners();
    
    // Start the authentic terminal sequence
    setTimeout(() => {
        startTerminalSequence();
    }, 1000);
}

// Add theme control button event listeners
function addThemeControlListeners() {
    const themeButtons = document.querySelectorAll('.sbemail-control-button.theme-btn');
    
    themeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const themeName = button.dataset.theme;
            
            // Don't switch if clicking the already active SBEMAIL theme
            if (themeName === 'sbemail') {
                return;
            }
            
            // Start KVM-style system switching sequence
            initiateSystemSwitch(themeName, button, themeButtons);
        });
    });
}

// KVM-style system switching with shutdown messages
async function initiateSystemSwitch(targetTheme, clickedButton, allButtons) {
    const terminalContent = document.getElementById('sbemailTerminalContent');
    if (!terminalContent) return;
    
    // Step 1: Set clicked button to RED (stopping current system)
    allButtons.forEach(btn => {
        if (btn === clickedButton) {
            btn.classList.remove('active');
            btn.classList.add('stopping');
        } else if (btn.dataset.theme === 'sbemail') {
            btn.classList.remove('active');
            btn.classList.add('shutdown');
        }
    });
    
    // Step 2: Clear the terminal screen first (like a real terminal shutdown)
    setTimeout(() => {
        terminalContent.innerHTML = ''; // Clear all existing content
        terminalContent.style.background = '#000000'; // Ensure black background
        
        // Add a subtle clearing effect
        terminalContent.style.transition = 'opacity 0.3s ease-out';
        terminalContent.style.opacity = '0.3';
        
        setTimeout(() => {
            terminalContent.style.opacity = '1';
            
            // Step 3: Display system shutdown messages directly to cleared terminal
            const shutdownMessages = getSystemShutdownMessages(targetTheme);
            
            // Add shutdown messages line by line using sequential timeouts to prevent slipping
            let currentDelay = 0;
            
            shutdownMessages.forEach((message, i) => {
                setTimeout(() => {
                    // Create shutdown line directly in terminal content
                    const line = document.createElement('div');
                    line.className = 'sbemail-startup-line';
                    line.style.opacity = '1';
                    line.style.color = i === shutdownMessages.length - 1 ? '#ff0000' : '#00ff00';
                    line.style.fontSize = '18px';
                    line.style.marginBottom = '6px';
                    line.textContent = ''; // Start empty for character-by-character typing
                    
                    // Add directly to cleared terminal content (no bouncing since screen is cleared)
                    terminalContent.appendChild(line);
                    
                    // Use character-by-character typing for consistency with theme
                    typeCompyResponse(line, message, () => {
                        // Keep content at top - don't auto-scroll to prevent bouncing
                        terminalContent.scrollTop = 0;
                    });
                    
                }, currentDelay);
                
                // Increment delay for next message - longer delay to account for character-by-character typing
                const typingTime = message.length * 6; // Estimate typing time (6ms per character)
                currentDelay += typingTime + 500 + Math.random() * 300; // Typing time + 500-800ms pause
            });
            
            // Step 4: Add CRT shutdown effect after all messages are done
            setTimeout(() => {
                createCRTShutdownEffect();
            }, currentDelay + 3000); // Wait for all messages + 3 second pause
            
        }, 500); // Wait for clear effect to complete
    }, 300); // Brief delay before clearing screen
    
    // Step 5: All LEDs turn off (system stopped)
    setTimeout(() => {
        allButtons.forEach(btn => {
            btn.classList.remove('active', 'shutdown', 'stopping');
        });
    }, 8000); // Timing to account for clear screen + shutdown messages + CRT effect
    
    // Step 6: Wait for CRT shutdown effect, then start new system with boot animation
    setTimeout(() => {
        // Add boot animation to target theme button
        clickedButton.style.animation = 'kvmGreenBoot 2s ease-in-out forwards';
        
        // After boot animation, set to active and switch theme
        setTimeout(() => {
            clickedButton.style.animation = '';
            clickedButton.classList.add('active');
            
            // Remove any CRT shutdown effects before switching
            const crtShutdown = document.querySelector('.sbemail-crt-shutdown');
            if (crtShutdown) {
                crtShutdown.remove();
            }
            
            // Call the core theme switching function
            if (typeof switchToTheme === 'function') {
                switchToTheme(targetTheme);
            } else if (window.switchToTheme) {
                window.switchToTheme(targetTheme);
            }
        }, 2000); // Wait for boot animation to complete
    }, 12000); // Increased delay to account for complete shutdown sequence + CRT effect (3s + shutdown messages + 3s CRT effect)
}

// Create authentic CRT shutdown effect - collapsing raster and static discharge dot
function createCRTShutdownEffect() {
    const terminalBody = document.querySelector('.sbemail-terminal-body');
    if (!terminalBody) return;
    
    // Create the CRT shutdown overlay
    const crtShutdown = document.createElement('div');
    crtShutdown.className = 'sbemail-crt-shutdown';
    
    // Create the collapsing raster effect
    const rasterCollapse = document.createElement('div');
    rasterCollapse.className = 'sbemail-raster-collapse';
    
    crtShutdown.appendChild(rasterCollapse);
    terminalBody.appendChild(crtShutdown);
    
    // After raster collapse completes, create the static discharge dot
    setTimeout(() => {
        // Remove the raster, add the static dot
        rasterCollapse.remove();
        
        const staticDot = document.createElement('div');
        staticDot.className = 'sbemail-static-dot';
        crtShutdown.appendChild(staticDot);
        
        // Remove the entire CRT effect after dot fades - extended pause for authentic feel
        setTimeout(() => {
            crtShutdown.remove();
        }, 3000); // Wait for dot fade animation + 2 second pause like real CRT TVs
        
    }, 2000); // Wait for raster collapse animation
}

// Generate system shutdown messages based on target theme
function getSystemShutdownMessages(targetTheme) {
    const baseMessages = [
        'COMPY 386 SYSTEM SHUTDOWN INITIATED...',
        'Stopping Strong Bad\'s Temporal Interface...',
        'Closing The Cheat applications...',
        'Saving Homestar\'s incomplete tasks...',
        'Terminating Bubs\' Concession Stand processes...',
        'Disconnecting from Free Country USA network...'
    ];
    
    const themeSpecificMessages = {
        'matrix': [
            'Preparing to jack into the Matrix...',
            'Loading red pill protocols...',
            'Connecting to Zion mainframe...',
            'MATRIX SYSTEM ONLINE'
        ],
        'lcars': [
            'Engaging warp drive systems...',
            'Connecting to Starfleet Command...',
            'Initializing LCARS interface...',
            'STARFLEET SYSTEM OPERATIONAL'
        ],
        'thor': [
            'Summoning the power of Asgard...',
            'Calling forth Mjolnir\'s lightning...',
            'Opening the Rainbow Bridge...',
            'NORSE SYSTEM ACTIVATED'
        ],
        'linux': [
            'Initializing X Window System...',
            'Loading desktop environment...',
            'Starting terminal applications...',
            'LINUX DESKTOP READY'
        ]
    };
    
    const shutdownMessages = [
        ...baseMessages,
        'Clearing browser cache of The Cheat\'s viruses...',
        'Backing up Marzipan\'s annoying messages...',
        'COMPY 386 SYSTEM HALTED',
        '',
        'Switching to ' + targetTheme.toUpperCase() + ' system...',
        ...themeSpecificMessages[targetTheme] || ['TARGET SYSTEM INITIALIZING...']
    ];
    
    return shutdownMessages;
}

// Start authentic terminal sequence with A:\ prompt and DOS navigation
function startTerminalSequence() {
    const terminalContent = document.getElementById('sbemailTerminalContent');
    
    if (!terminalContent) {
        return;
    }
    
    // Add the A:\> prompt line
    const promptLine = document.createElement('div');
    promptLine.className = 'sbemail-startup-line';
    promptLine.id = 'initialPrompt';
    promptLine.style.opacity = '1';
    promptLine.style.color = '#00ff00';
    promptLine.style.fontSize = '18px';
    promptLine.style.lineHeight = '1.4';
    promptLine.style.marginBottom = '8px';
    promptLine.textContent = 'A:\\> ';
    promptLine.classList.add('ready-for-input');
    
    terminalContent.appendChild(promptLine);
    
    // Let cursor blink for a few seconds before typing command
    setTimeout(() => {
        // Remove cursor and start the DOS typing sequence
        promptLine.classList.remove('ready-for-input');
        // Start the DOS startup sequence
        showDOSStartup();
    }, 3000); // 3 seconds for cursor to blink
}

// Fast computer response typing (for Compy output)
function typeCompyResponse(element, text, callback, typingSpeed = 6) {
    if (!element) {
        if (callback) callback();
        return;
    }
    
    let i = 0;
    
    const typeNextChar = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            
            // Fast computer typing with slight variation
            const delay = typingSpeed + (Math.random() * 15 - 7);
            setTimeout(typeNextChar, delay);
        } else {
            if (callback) callback();
        }
    };
    
    typeNextChar();
}

// Boxing gloves typing (for Strong Bad commands) with typos and backspaces
function typeStrongBadCommand(element, text, callback, baseSpeed = 180) {
    if (!element) {
        if (callback) callback();
        return;
    }
    
    const basePrompt = element.textContent; // Keep existing prompt content
    let currentText = '';
    let targetIndex = 0;
    
    const typeNextAction = () => {
        if (targetIndex < text.length) {
            const char = text.charAt(targetIndex);
            
            // 15% chance of making a typo (but not on first character)
            const shouldMakeTypo = targetIndex > 0 && Math.random() < 0.15;
            
            if (shouldMakeTypo) {
                // Type a wrong character first
                const wrongChars = 'qwertyuiopasdfghjklzxcvbnm';
                const wrongChar = wrongChars.charAt(Math.floor(Math.random() * wrongChars.length));
                currentText += wrongChar;
                element.textContent = basePrompt + currentText;
                
                // Pause when Strong Bad realizes the mistake (300-800ms)
                const realizationPause = 300 + Math.random() * 500;
                setTimeout(() => {
                    // Backspace to remove the wrong character
                    currentText = currentText.slice(0, -1);
                    element.textContent = basePrompt + currentText;
                    
                    // Brief pause after backspace (100-200ms)
                    setTimeout(() => {
                        // Now type the correct character
                        currentText += char;
                        element.textContent = basePrompt + currentText;
                        targetIndex++;
                        
                        // Continue after correction
                        const nextDelay = baseSpeed + (Math.random() * 100 - 50);
                        setTimeout(typeNextAction, nextDelay);
                    }, 100 + Math.random() * 100);
                }, realizationPause);
            } else {
                // Type the correct character
                currentText += char;
                element.textContent = basePrompt + currentText;
                targetIndex++;
                
                // Variable typing speed with occasional long pauses (boxing gloves!)
                let delay = baseSpeed + (Math.random() * 120 - 60);
                
                // 10% chance of a longer pause (struggling with gloves)
                if (Math.random() < 0.1) {
                    delay += 200 + Math.random() * 300;
                }
                
                setTimeout(typeNextAction, delay);
            }
        } else {
            // Finished typing command
            setTimeout(() => {
                if (callback) callback();
            }, 200);
        }
    };
    
    typeNextAction();
}

// Regular human typing (for non-Strong Bad input)
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
    const terminalContent = document.getElementById('sbemailTerminalContent');
    const initialPrompt = document.getElementById('initialPrompt');
    
    if (!terminalContent || !initialPrompt) {
        return;
    }
    
    // Step 1: Strong Bad types "cd sbemail_clock" command with boxing gloves
    typeStrongBadCommand(initialPrompt, 'cd sbemail_clock', () => {
        // Step 2: Add new line and show new prompt A:\SBEMAIL_CLOCK>
        setTimeout(() => {
            const newPrompt = document.createElement('div');
            newPrompt.className = 'sbemail-startup-line';
            newPrompt.id = 'newPrompt';
            newPrompt.style.opacity = '1';
            newPrompt.style.color = '#00ff00';
            newPrompt.textContent = 'A:\\SBEMAIL_CLOCK> ';
            newPrompt.classList.add('ready-for-input');
            terminalContent.appendChild(newPrompt);
            
            // Step 3: After brief pause, type exe command on new prompt
            setTimeout(() => {
                newPrompt.classList.remove('ready-for-input');
                
                typeStrongBadCommand(newPrompt, 'sbemail_clock.exe', () => {
                    // Step 4: Start program output (clock will start after screen clear)
                    showProgramOutput();
                });
                
            }, 1000); // 1 second pause at new prompt
        }, 300); // Brief pause after cd command
    }); // Strong Bad typing with boxing gloves
}

// Show prsbemailram output lines one at a time
function showProgramOutput() {
    const terminalContent = document.getElementById('sbemailTerminalContent');
    if (!terminalContent) {
        return;
    }
    
    const outputLines = [
        'Loading Strong Bad\'s Temporal Interface...',
        'Scanning for The Cheat viruses... NONE FOUND',
        'Checking email... 0 new messages',
        getRandomStartupPhrase()
    ];
    
    let currentLineIndex = 0;
    
    const showNextLine = () => {
        
        if (currentLineIndex < outputLines.length) {
            const line = document.createElement('div');
            line.className = 'sbemail-startup-line';
            line.style.opacity = '1';
            line.style.color = '#00ff00';
            line.textContent = ''; // Start empty
            terminalContent.appendChild(line);
            
            
            // Type this line character by character (fast computer typing)
            typeCompyResponse(line, outputLines[currentLineIndex], () => {
                currentLineIndex++;
                
                // Short delay between output lines (200-400ms)
                const randomDelay = 200 + Math.random() * 200;
                setTimeout(showNextLine, randomDelay);
            });
        } else {
            // All output lines shown, clear screen and show fresh interface
            setTimeout(() => {
                clearScreenAndShowInterface();
            }, 1000); // Brief pause after last line
        }
    };
    
    // Start showing output lines after a brief pause
    setTimeout(showNextLine, 400);
}

// Clear screen and show fresh interface from the top
function clearScreenAndShowInterface() {
    const terminalContent = document.getElementById('sbemailTerminalContent');
    if (!terminalContent) return;
    
    
    // Clear all existing content
    terminalContent.innerHTML = '';
    
    // Show both clock and weather search panels at the same time
    showFreshClockDisplay();
    showFreshWeatherSearch();
}

// Show fresh clock display at top of cleared screen
function showFreshClockDisplay() {
    const terminalContent = document.getElementById('sbemailTerminalContent');
    if (!terminalContent) return;
    
    
    // Create clock display container
    const clockDisplay = document.createElement('div');
    clockDisplay.className = 'sbemail-clock-display';
    clockDisplay.id = 'sbemailClockDisplay';
    clockDisplay.style.opacity = '1';
    
    // Create timezone control
    const timezoneControl = document.createElement('div');
    timezoneControl.className = 'sbemail-timezone-control';
    timezoneControl.innerHTML = `
        <label class="sbemail-timezone-label">TIMEZONE: <span id="sbemailTimezoneDescription">UTC+0 (LOCAL TIME)</span></label>
        <input type="range" id="sbemailTimezoneSlider" class="sbemail-timezone-slider" min="0" max="38" value="0" step="1">
    `;
    
    // Create clock elements
    const clockDay = document.createElement('div');
    clockDay.className = 'sbemail-clock-day';
    clockDay.id = 'sbemailClockDay';
    
    const clockDate = document.createElement('div');
    clockDate.className = 'sbemail-clock-date';
    clockDate.id = 'sbemailClockDate';
    
    const clockTime = document.createElement('div');
    clockTime.className = 'sbemail-clock-time';
    clockTime.id = 'sbemailClockTime';
    
    // Assemble clock display
    clockDisplay.appendChild(timezoneControl);
    clockDisplay.appendChild(clockDay);
    clockDisplay.appendChild(clockDate);
    clockDisplay.appendChild(clockTime);
    
    // Add to top of terminal
    terminalContent.appendChild(clockDisplay);
    
    // Initialize timezone slider functionality
    initOgTimezoneSlider();
    
    // Start clock updates
    startCompyClock();
}

// Show fresh weather search panel
function showFreshWeatherSearch() {
    const terminalContent = document.getElementById('sbemailTerminalContent');
    if (!terminalContent) return;
    
    
    // Create weather search container
    const weatherSearch = document.createElement('div');
    weatherSearch.className = 'sbemail-weather-search';
    weatherSearch.id = 'sbemailWeatherSearch';
    weatherSearch.style.opacity = '1';
    weatherSearch.innerHTML = `
        <div class="sbemail-input-container">
            <span class="sbemail-search-prompt">WEATHER SEARCH:</span>
            <input type="text" class="sbemail-search-input" id="sbemailSearchInput" placeholder="ENTER CITY NAME">
            <button class="sbemail-search-button" id="sbemailSearchButton">SEARCH</button>
        </div>
        <div class="sbemail-weather-ticker" id="sbemailWeatherTicker">
            <div class="sbemail-ticker-container">
                <span class="sbemail-ticker-label">WEATHER DATA:</span>
                <div class="sbemail-ticker-content" id="sbemailTickerContent">READY FOR SEARCH...</div>
            </div>
        </div>
    `;
    
    // Add below clock
    terminalContent.appendChild(weatherSearch);
    
    // Initialize weather search functionality
    initOgWeatherSearch();
}

// Show the clock display after program output
function showClockDisplay() {
    const terminalContent = document.getElementById('sbemailTerminalContent');
    if (!terminalContent) return;
    
    // Create clock display container
    const clockDisplay = document.createElement('div');
    clockDisplay.className = 'sbemail-clock-display';
    clockDisplay.id = 'sbemailClockDisplay';
    clockDisplay.style.opacity = '1';
    
    // Create timezone control
    const timezoneControl = document.createElement('div');
    timezoneControl.className = 'sbemail-timezone-control';
    timezoneControl.innerHTML = `
        <label class="sbemail-timezone-label">TIMEZONE: <span id="sbemailTimezoneDescription">UTC+0 (LOCAL TIME)</span></label>
        <input type="range" id="sbemailTimezoneSlider" class="sbemail-timezone-slider" min="0" max="38" value="0" step="1">
    `;
    
    // Create clock elements
    const clockDay = document.createElement('div');
    clockDay.className = 'sbemail-clock-day';
    clockDay.id = 'sbemailClockDay';
    
    const clockDate = document.createElement('div');
    clockDate.className = 'sbemail-clock-date';
    clockDate.id = 'sbemailClockDate';
    
    const clockTime = document.createElement('div');
    clockTime.className = 'sbemail-clock-time';
    clockTime.id = 'sbemailClockTime';
    
    // Assemble clock display
    clockDisplay.appendChild(timezoneControl);
    clockDisplay.appendChild(clockDay);
    clockDisplay.appendChild(clockDate);
    clockDisplay.appendChild(clockTime);
    
    terminalContent.appendChild(clockDisplay);
    
    // Show weather search after clock - flows naturally like terminal text
    setTimeout(() => {
        showWeatherSearch();
    }, 1500);
}

// Add weather search as a terminal line (not separate container)
function addWeatherSearchLine() {
    const terminalContent = document.getElementById('sbemailTerminalContent');
    if (!terminalContent) return;
    
    // Add a small spacer line
    const spacerLine = document.createElement('div');
    spacerLine.className = 'sbemail-startup-line';
    spacerLine.style.height = '8px';
    spacerLine.innerHTML = '&nbsp;';
    terminalContent.appendChild(spacerLine);
    
    // Add weather search prompt as a terminal line
    const weatherPromptLine = document.createElement('div');
    weatherPromptLine.className = 'sbemail-startup-line';
    weatherPromptLine.style.color = '#00ff00';
    weatherPromptLine.style.fontSize = '18px';
    weatherPromptLine.style.opacity = '1';
    weatherPromptLine.innerHTML = 'WEATHER SEARCH: <input type="text" class="sbemail-inline-input" id="sbemailSearchInput" placeholder="ENTER CITY"> <button class="sbemail-inline-button" id="sbemailSearchButton">SEARCH</button>';
    
    terminalContent.appendChild(weatherPromptLine);
    
    // Add weather ticker line (hidden initially)
    const weatherTickerLine = document.createElement('div');
    weatherTickerLine.className = 'sbemail-startup-line';
    weatherTickerLine.id = 'sbemailWeatherTickerLine';
    weatherTickerLine.style.color = '#00ff00';
    weatherTickerLine.style.fontSize = '18px';
    weatherTickerLine.style.opacity = '1';
    weatherTickerLine.style.display = 'none';
    weatherTickerLine.innerHTML = '<span class="sbemail-ticker-label">WEATHER DATA:</span> <div class="sbemail-inline-ticker" id="sbemailTickerContent">NO DATA LOADED</div>';
    
    terminalContent.appendChild(weatherTickerLine);
    
    // Initialize weather search functionality for inline elements
    initInlineWeatherSearch();
    
    // Initialize timezone slider functionality
    initOgTimezoneSlider();
    
    // Scroll to show the new content
    setTimeout(() => {
        smoothScrollTerminal();
    }, 200);
}

// Show the weather search interface
function showWeatherSearch() {
    const terminalContent = document.getElementById('sbemailTerminalContent');
    if (!terminalContent) return;
    
    // Add a small spacer line to separate from clock
    const spacerLine = document.createElement('div');
    spacerLine.className = 'sbemail-startup-line';
    spacerLine.style.height = '8px';
    spacerLine.innerHTML = '&nbsp;';
    terminalContent.appendChild(spacerLine);
    
    // Create weather search container that flows like terminal content
    const weatherSearch = document.createElement('div');
    weatherSearch.className = 'sbemail-weather-search';
    weatherSearch.id = 'sbemailWeatherSearch';
    weatherSearch.style.opacity = '1';
    weatherSearch.innerHTML = `
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
    `;
    
    terminalContent.appendChild(weatherSearch);
    
    // Initialize weather search functionality
    initOgWeatherSearch();
    
    // Initialize timezone slider functionality
    initOgTimezoneSlider();
    
    // No scrolling - let browser handle it naturally
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

// Update inline weather ticker in terminal line
function updateInlineWeatherTicker() {
    const tickerContent = document.getElementById('sbemailTickerContent');
    if (!tickerContent) {
        return;
    }
    
    // Get weather data from main weather system
    const weatherScroll = document.getElementById('weatherScroll');
    let newWeatherText = '';
    
    if (weatherScroll && weatherScroll.children.length > 0) {
        
        const citySeparator = weatherScroll.querySelector('.city-separator');
        const city = citySeparator ? citySeparator.textContent.replace(/🌐/g, '').trim() : 'UNKNOWN';
        
        const firstBlock = weatherScroll.children[0];
        if (firstBlock) {
            const currentItems = firstBlock.querySelectorAll('.weather-item');
            let weatherParts = [city];
            
            currentItems.forEach((item, index) => {
                if (index < 3) { // Only show first 3 items to fit inline
                    const tempElement = item.querySelector('.weather-temp');
                    const iconElement = item.querySelector('.weather-icon');
                    const descElement = item.querySelector('.weather-desc');
                    
                    if (tempElement) {
                        const temp = tempElement.textContent.trim();
                        const icon = iconElement ? iconElement.textContent.trim() : '';
                        const desc = descElement ? descElement.textContent.trim() : '';
                        weatherParts.push(`${icon} ${temp} ${desc}`);
                    }
                }
            });
            
            newWeatherText = weatherParts.join(' • ');
        } else {
            newWeatherText = 'WEATHER: NO DATA AVAILABLE';
        }
    } else {
        newWeatherText = 'WEATHER: LOADING DATA...';
    }
    
    // Update ticker content directly (no scrolling for inline)
    tickerContent.textContent = newWeatherText;
}

// Update weather ticker in the search tool area - PROTECTED PRECIOUS RESOURCE
function updateOgWeatherTicker() {
    
    const tickerContent = document.getElementById('sbemailTickerContent');
    if (!tickerContent) {
        return;
    }
    
    
    // Check if we should block unnecessary updates to protect the precious display
    if (sbemailTickerProtected) {
        const currentContent = tickerContent.textContent || tickerContent.innerHTML || '';
        
        // If content is already good and contains weather data, don't mess with it
        // BUT allow updates if the protection was just temporarily disabled (new search)
        if (currentContent.includes('°F') && currentContent.length > 50) {
            return;
        }
    }
    
    // Try to get weather data from main weather system
    const weatherScroll = document.getElementById('weatherScroll');
    let newWeatherText = '';
    
    // Extract weather data more efficiently from the main weather system
    if (weatherScroll && weatherScroll.children.length > 0) {
        
        // Get basic info
        const citySeparator = weatherScroll.querySelector('.city-separator');
        const city = citySeparator ? citySeparator.textContent.replace(/🌐/g, '').trim() : 'UNKNOWN';
        
        // Get only the first content block to avoid massive duplication
        const firstBlock = weatherScroll.children[0];
        if (firstBlock) {
            
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
        } else {
            newWeatherText = 'WEATHER: NO DATA AVAILABLE • ';
        }
    } else {
        newWeatherText = 'WEATHER: LOADING DATA... • ';
    }
    
    // Update weather text with proper scrolling animation structure
    if (newWeatherText !== sbemailWeatherText) {
        sbemailWeatherText = newWeatherText;
        
        // Create proper scrolling structure for CSS animation with multiple copies for seamless loop
        const duplicatedContent = newWeatherText.repeat(4); // Create 4 copies like Matrix theme
        tickerContent.innerHTML = `<div class="sbemail-ticker-scroll">${duplicatedContent}</div>`;
        
        // Activate protection after first successful update
        if (!sbemailTickerProtected && newWeatherText.includes('°F')) {
            sbemailTickerProtected = true;
            
            // Add DOM mutation observer to detect any interference
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                });
            });
            
            // Also observe the entire clock container for changes
            const clockContainer = document.querySelector('.clock-container');
            if (clockContainer) {
                const clockObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                    });
                });
                
                clockObserver.observe(clockContainer, {
                    childList: true,
                    attributes: true,
                    characterData: true,
                    subtree: true
                });
                
            }
            
            // Observe the weather container too
            const weatherContainer = document.querySelector('.weather-container');
            if (weatherContainer) {
                const weatherObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                    });
                });
                
                weatherObserver.observe(weatherContainer, {
                    childList: true,
                    attributes: true,
                    characterData: true,
                    subtree: true
                });
                
            }
            
            // Observe the ticker for any unauthorized changes
            observer.observe(tickerContent, {
                childList: true,
                attributes: true,
                characterData: true,
                subtree: true
            });
            
            // Monitor all function calls that could interfere with the display
            const originalSetTimeout = window.setTimeout;
            window.setTimeout = function(...args) {
                if (sbemailTickerProtected) {
                }
                return originalSetTimeout.apply(this, args);
            };
            
            const originalSetInterval = window.setInterval;
            window.setInterval = function(...args) {
                if (sbemailTickerProtected) {
                }
                return originalSetInterval.apply(this, args);
            };
            
            // Monitor specific functions that could interfere
            const originalUpdateOgWeatherTicker = window.updateOgWeatherTicker;
            if (typeof window.updateOgWeatherTicker === 'function') {
                window.updateOgWeatherTicker = function(...args) {
                    if (sbemailTickerProtected) {
                    }
                    return originalUpdateOgWeatherTicker.apply(this, args);
                };
            }
            
            // Monitor main weather system calls
            const originalHandleWeatherRequest = window.handleWeatherRequest;
            if (typeof window.handleWeatherRequest === 'function') {
                window.handleWeatherRequest = function(...args) {
                    if (sbemailTickerProtected) {
                    }
                    return originalHandleWeatherRequest.apply(this, args);
                };
            }
            
            // Monitor display updates
            const originalUpdateClockDisplay = window.updateClockDisplay;
            if (typeof window.updateClockDisplay === 'function') {
                window.updateClockDisplay = function(...args) {
                    if (sbemailTickerProtected) {
                    }
                    return originalUpdateClockDisplay.apply(this, args);
                };
            }
            
            // ALLOW NORMAL CLOCK UPDATES - Only block interference with weather ticker
            
            // Only block the specific scrollToWeatherWidget function that was causing problems
            if (typeof scrollToWeatherWidget !== 'undefined') {
                const originalScrollToWeatherWidget = scrollToWeatherWidget;
                window.scrollToWeatherWidget = function(...args) {
                    return; // Don't execute - this was causing the "moving stuff around" problem
                };
            }
            
        }
    } else {
        if (sbemailTickerProtected) {
        } else {
        }
    }
}

// Legacy scrolling function - no longer used with fixed layout
function startOgWeatherTickerScrolling() {
    // No longer needed - weather ticker now uses simple text updates
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
        
        // Sync with main timezone system
        const mainSlider = document.getElementById('timezoneSlider');
        if (mainSlider) {
            timezoneSlider.value = mainSlider.value;
        }
        
        // Initial display update
        updateOgTimezoneDisplay();
        
        // Force clock update to show correct timezone
        updateCompyClock();
        
        timezoneSlider.addEventListener('input', () => {
            
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
        
        if (timezones[index]) {
            const tzInfo = timezones[index];
            
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
        }
    }
}

// Initialize inline weather search functionality  
function initInlineWeatherSearch() {
    const searchButton = document.getElementById('sbemailSearchButton');
    const searchInput = document.getElementById('sbemailSearchInput');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', handleInlineWeatherSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleInlineWeatherSearch();
            }
        });
    }
}

// Initialize SBEMAIL weather search functionality (legacy)
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

// Handle inline weather search from terminal line
async function handleInlineWeatherSearch() {
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
                
                // Show the weather ticker line after successful search
                setTimeout(() => {
                    const weatherTickerLine = document.getElementById('sbemailWeatherTickerLine');
                    if (weatherTickerLine) {
                        weatherTickerLine.style.display = 'block';
                        updateInlineWeatherTicker(); // Start the inline ticker
                        
                        // Smooth scroll to show the weather ticker
                        setTimeout(() => {
                            smoothScrollTerminal();
                        }, 300);
                    }
                }, 1000); // Wait for weather data to load
                
            } catch (error) {
            }
        }
    }
    
    // Clear both inputs
    searchInput.value = '';
    if (mainCityInput) {
        mainCityInput.value = '';
    }
}

// Handle weather search from SBEMAIL theme (legacy)
async function handleOgWeatherSearch() {
    
    const searchInput = document.getElementById('sbemailSearchInput');
    if (!searchInput || !searchInput.value.trim()) {
        return;
    }
    
    const city = searchInput.value.trim();
    
    // For subsequent searches, temporarily disable protection to allow updates
    const wasProtected = sbemailTickerProtected;
    if (wasProtected) {
        sbemailTickerProtected = false;
    }
    
    // Update the main city input and trigger weather search
    const mainCityInput = document.getElementById('cityInput');
    if (mainCityInput) {
        mainCityInput.value = city;
        
        // Trigger the main weather search function
        if (typeof handleWeatherRequest === 'function') {
            try {
                await handleWeatherRequest();
                
                // Check if protection was activated after weather request
                setTimeout(() => {
                }, 100);
                
                setTimeout(() => {
                }, 500);
                
                setTimeout(() => {
                    if (sbemailTickerProtected) {
                    }
                }, 1000);
                
            } catch (error) {
                // Re-enable protection if there was an error and it was previously protected
                if (wasProtected) {
                    sbemailTickerProtected = true;
                }
            }
        } else {
        }
    } else {
    }
    
    // Clear SBEMAIL input but keep main input for subsequent searches
    searchInput.value = '';
    
}

// Export functions for modular theme system
if (typeof window !== 'undefined') {
    window.initSBEMAILTheme = initSBEMAILTheme;
    window.cleanupSBEMAILTheme = cleanupSBEMAILTheme;
}