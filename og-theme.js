// OG Theme - Strong Bad's Compy 386 from HomestarRunner.com
// Authentic sbemail experience with clocker-improved functionality

let ogTerminalInterval = null;
let ogStartTime = null;
let ogStarsInterval = null;
let ogClickHandler = null;

// Auto-scroll to show weather widget in Compy 386 screen
function scrollToWeatherWidget() {
    const terminalContent = document.getElementById('ogTerminalContent');
    const weatherSearch = document.getElementById('ogWeatherSearch');
    
    if (terminalContent && weatherSearch) {
        // Smooth scroll to show the weather widget
        weatherSearch.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
        });
    }
}

// Initialize Strong Bad's Compy 386 Theme
function initOGTheme() {
    console.log('📧 Initializing Strong Bad\'s Compy 386 theme');
    
    // Record theme start time
    ogStartTime = Date.now();
    
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
function cleanupOGTheme() {
    console.log('📧 Powering down Strong Bad\'s Compy 386...');
    
    // Clear Compy update interval
    if (ogTerminalInterval) {
        clearInterval(ogTerminalInterval);
        ogTerminalInterval = null;
    }
    
    // Clear weather scrolling interval
    if (ogWeatherScrollInterval) {
        clearInterval(ogWeatherScrollInterval);
        ogWeatherScrollInterval = null;
    }
    
    // Stop pulsing stars
    stopPulsingStars();
    
    // Remove boxing gloves click handler
    removeBoxingGlovesHandler();
    
    // Remove Compy 386
    const compyWindow = document.getElementById('ogTerminalWindow');
    if (compyWindow) {
        compyWindow.remove();
    }
    
    // Remove any lingering OG elements
    const ogElements = document.querySelectorAll('.og-boxing-gloves, .og-boxing-gloves-pair, .og-trogdor, .og-trogdor-test, .og-pulsing-star');
    ogElements.forEach(el => el.remove());
    
    // Remove sbemail-specific event listeners
    removeSbemailKeyboardHandlers();
    
    // Remove OG-specific body classes
    document.body.classList.remove('og-theme');
    
    // Reset variables
    ogStartTime = null;
    ogTerminalInterval = null;
    ogStarsInterval = null;
    ogClickHandler = null;
    
    console.log('✅ Strong Bad\'s Compy 386 powered down completely');
}

// Create Strong Bad's Compy 386
function createCompy386() {
    const compyHTML = `
        <div id="ogTerminalWindow" class="og-terminal-window">
            <div class="og-terminal-header">
                <div class="og-header-text">
                    <span class="og-terminal-title">COMPY 386</span>
                    <span class="og-status-text">EMAIL TERMINAL</span>
                </div>
                <div class="og-terminal-buttons">
                    <span class="og-btn og-btn-close"></span>
                    <span class="og-btn og-btn-minimize"></span>
                    <span class="og-btn og-btn-maximize"></span>
                </div>
            </div>
            <div class="og-terminal-body">
                <div class="og-terminal-content" id="ogTerminalContent">
                    <div class="og-terminal-startup">
                        <div class="og-startup-line">C:\\COMPY386> sbemail_clock.exe</div>
                        <div class="og-startup-line og-startup-delay-1">Loading Strong Bad's Temporal Interface...</div>
                        <div class="og-startup-line og-startup-delay-2">Scanning for The Cheat viruses... NONE FOUND</div>
                        <div class="og-startup-line og-startup-delay-3">Checking email... 0 new messages</div>
                        <div class="og-startup-line og-startup-delay-4">Time display ready. Holy crap on a cracker!</div>
                    </div>
                    <div class="og-clock-display" id="ogClockDisplay">
                        <div class="og-clock-day" id="ogClockDay"></div>
                        <div class="og-clock-date" id="ogClockDate"></div>
                        <div class="og-clock-time" id="ogClockTime"></div>
                    </div>
                    <div class="og-weather-search" id="ogWeatherSearch" style="display: none;">
                        <div class="og-search-prompt">WEATHER SEARCH:</div>
                        <input type="text" class="og-search-input" id="ogSearchInput" placeholder="ENTER CITY NAME">
                        <button class="og-search-button" id="ogSearchButton">SEARCH</button>
                        <div class="og-weather-ticker" id="ogWeatherTicker" style="display: none;">
                            <div class="og-ticker-label">WEATHER DATA:</div>
                            <div class="og-ticker-content" id="ogTickerContent">NO DATA LOADED</div>
                        </div>
                    </div>
                    <div class="og-terminal-cursor" id="ogCursor">█</div>
                </div>
                <div class="og-terminal-scrollbar">
                    <div class="og-scrollbar-thumb"></div>
                </div>
            </div>
            <div class="og-terminal-footer">
                <!-- Status text moved to header -->
            </div>
        </div>
    `;
    
    // Add Compy 386 to document
    document.body.insertAdjacentHTML('beforeend', compyHTML);
    
    // Add sbemail startup sequence
    setTimeout(() => {
        const startup = document.querySelector('.og-terminal-startup');
        if (startup) startup.style.opacity = '0.4';
        
        const clockDisplay = document.getElementById('ogClockDisplay');
        if (clockDisplay) {
            clockDisplay.style.opacity = '1';
            // Auto-scroll to show the clock
            clockDisplay.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Wait additional time after clock panel is rendered to show weather tool
            setTimeout(() => {
                const weatherSearch = document.getElementById('ogWeatherSearch');
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
            }, 1500); // Show weather tool 1.5 seconds after clock panel
        }
    }, 4000);
}

// Start the Compy 386 clock updates (mimics clocker-improved behavior)
function startCompyClock() {
    // Update immediately
    updateCompyClock();
    
    // Then update every second (like checking emails)
    ogTerminalInterval = setInterval(() => {
        updateCompyClock();
    }, 1000);
}

// Update Compy 386 clock display (replicates clocker-improved formatting)
function updateCompyClock() {
    const now = new Date();
    
    // Format day (same as clocker-improved)
    const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Format date with ordinal suffix (same logic as clocker-improved)
    const month = now.toLocaleDateString('en-US', { month: 'short' }).replace('May', 'May');
    const day = now.getDate();
    const year = now.getFullYear();
    
    // Apply ordinal suffix logic from clocker-improved
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
    
    // Format time (same as clocker-improved)
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short'
    }).replace(/\s+/g, ' ');
    
    // Update Compy 386 display
    const dayElement = document.getElementById('ogClockDay');
    const dateElement = document.getElementById('ogClockDate');
    const timeElement = document.getElementById('ogClockTime');
    
    if (dayElement) dayElement.textContent = dayStr.toUpperCase();
    if (dateElement) dateElement.textContent = dateStr.toUpperCase();
    if (timeElement) timeElement.textContent = timeStr.toUpperCase();
}


// OG Weather Ticker System (in weather search area)
let ogWeatherScrollInterval = null;
let ogWeatherText = '';
let ogWeatherScrollPosition = 0;

// Update weather ticker in the search tool area
function updateOgWeatherTicker() {
    const tickerContent = document.getElementById('ogTickerContent');
    if (!tickerContent) return;
    
    // Try to get weather data from main weather system
    const weatherScroll = document.getElementById('weatherScroll');
    let newWeatherText = '';
    
    if (weatherScroll && weatherScroll.children.length > 0) {
        // Extract all weather information for scrolling display
        const weatherItems = weatherScroll.querySelectorAll('.weather-item');
        const citySeparator = weatherScroll.querySelector('.city-separator');
        const city = citySeparator ? citySeparator.textContent.replace(/🌐/g, '').trim() : 'UNKNOWN';
        
        if (weatherItems.length > 0) {
            // Build comprehensive weather string
            let weatherParts = [`🌐 ${city.toUpperCase()}`];
            
            weatherItems.forEach(item => {
                const label = item.querySelector('.weather-label')?.textContent || '';
                const icon = item.querySelector('.weather-icon')?.textContent || '';
                const temp = item.querySelector('.weather-temp')?.textContent || '';
                const desc = item.querySelector('.weather-desc')?.textContent || '';
                const humidity = item.querySelector('.weather-humidity')?.textContent || '';
                const wind = item.querySelector('.weather-wind')?.textContent || '';
                
                if (label && temp) {
                    let itemText = `${label} ${icon} ${temp} ${desc.toUpperCase()}`;
                    if (humidity) itemText += ` ${humidity}`;
                    if (wind) itemText += ` ${wind}`;
                    weatherParts.push(itemText);
                }
            });
            
            // Get coordinates if available
            const coords = weatherScroll.querySelector('.weather-coords')?.textContent;
            if (coords) {
                weatherParts.push(coords.toUpperCase());
            }
            
            newWeatherText = weatherParts.join(' • ') + ' • ';
        } else {
            newWeatherText = 'WEATHER: NO DATA AVAILABLE • ';
        }
    } else {
        newWeatherText = 'WEATHER: CLICK SEARCH TO LOAD DATA • ';
    }
    
    // Update weather text if changed and start/restart scrolling
    if (newWeatherText !== ogWeatherText) {
        ogWeatherText = newWeatherText;
        ogWeatherScrollPosition = 0;
        startOgWeatherTickerScrolling();
    }
}

// Start scrolling animation for weather ticker
function startOgWeatherTickerScrolling() {
    const tickerContent = document.getElementById('ogTickerContent');
    if (!tickerContent || !ogWeatherText) return;
    
    // Clear existing interval
    if (ogWeatherScrollInterval) {
        clearInterval(ogWeatherScrollInterval);
    }
    
    // Start scrolling animation
    ogWeatherScrollInterval = setInterval(() => {
        const displayWidth = 50; // Character width for ticker area
        
        if (ogWeatherText.length <= displayWidth) {
            // Text fits, no scrolling needed
            tickerContent.textContent = ogWeatherText;
        } else {
            // Create scrolling effect
            let displayText = ogWeatherText.substring(ogWeatherScrollPosition, ogWeatherScrollPosition + displayWidth);
            
            // If we're near the end, wrap around
            if (displayText.length < displayWidth) {
                displayText += ogWeatherText.substring(0, displayWidth - displayText.length);
            }
            
            tickerContent.textContent = displayText;
            
            // Advance scroll position
            ogWeatherScrollPosition++;
            if (ogWeatherScrollPosition >= ogWeatherText.length) {
                ogWeatherScrollPosition = 0;
            }
        }
    }, 150); // Scroll speed: update every 150ms
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
        
        alert(`Strong Bad's Compy 386 - SYSTEM SHUTDOWN\n\n"Oh, The Cheat! You deleted my emails again!"\n\nLogged off at ${exitTime} on ${exitDay}, ${exitDate}.\n\nSwitching to next theme... Email me at strongbad@homestarrunner.com`);
        
        // Switch to random theme
        if (typeof switchToRandomTheme === 'function') {
            switchToRandomTheme('og');
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
    
    ogStarsInterval = setInterval(() => {
        createPulsingStar();
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds
}

function stopPulsingStars() {
    if (ogStarsInterval) {
        clearInterval(ogStarsInterval);
        ogStarsInterval = null;
    }
    
    // Remove any existing stars
    const existingStars = document.querySelectorAll('.og-pulsing-star');
    existingStars.forEach(star => star.remove());
}

function createPulsingStar() {
    // Only create if there are fewer than 3 stars visible (increased frequency in blue field)
    const existingStars = document.querySelectorAll('.og-pulsing-star');
    if (existingStars.length >= 3) return;
    
    const star = document.createElement('div');
    star.className = 'og-pulsing-star';
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
    ogClickHandler = handleBoxingGlovesClick;
    document.addEventListener('click', ogClickHandler);
}

function removeBoxingGlovesHandler() {
    if (ogClickHandler) {
        document.removeEventListener('click', ogClickHandler);
        ogClickHandler = null;
    }
    
    // Remove any existing gloves and Trogdors
    const existingGloves = document.querySelectorAll('.og-boxing-gloves');
    const existingGlovesPairs = document.querySelectorAll('.og-boxing-gloves-pair');
    const existingTrogdors = document.querySelectorAll('.og-trogdor, .og-trogdor-test');
    existingGloves.forEach(gloves => gloves.remove());
    existingGlovesPairs.forEach(glovesPair => glovesPair.remove());
    existingTrogdors.forEach(trogdor => trogdor.remove());
}

function handleBoxingGlovesClick(event) {
    // Don't trigger if clicking on the Compy 386 window
    if (event.target.closest('.og-terminal-window')) return;
    
    // 10% chance for Trogdor, 90% chance for boxing gloves
    const isTrogdor = Math.random() < 0.1;
    
    if (isTrogdor) {
        createTrogdor(event.clientX, event.clientY);
    } else {
        createBoxingGloves(event.clientX, event.clientY);
    }
}

function createBoxingGloves(x, y) {
    const glovesContainer = document.createElement('div');
    glovesContainer.className = 'og-boxing-gloves-pair';
    
    // Create left glove
    const leftGlove = document.createElement('div');
    leftGlove.className = 'og-boxing-gloves-left';
    leftGlove.innerHTML = '🥊'; // Boxing glove emoji
    
    // Create right glove
    const rightGlove = document.createElement('div');
    rightGlove.className = 'og-boxing-gloves-right';
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
    
    // Apply random movement during animation - gloves move together
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
    trogdor.className = 'og-trogdor-test';
    trogdor.innerHTML = '🐉'; // Oriental dragon emoji representing Trogdor the Burninator
    
    // Start at click position
    trogdor.style.left = x + 'px';
    trogdor.style.top = y + 'px';
    
    document.body.appendChild(trogdor);
    
    // Trogdor burninates across the screen more dramatically
    const endX = Math.random() * (window.innerWidth - 300);
    const endY = Math.random() * (window.innerHeight - 250);
    
    // Apply random movement during animation - Trogdor moves more wildly
    setTimeout(() => {
        trogdor.style.left = endX + 'px';
        trogdor.style.top = endY + 'px';
        trogdor.style.transition = 'left 6s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 100);
    
    // Remove Trogdor after burninating completes
    setTimeout(() => {
        if (trogdor.parentNode) {
            trogdor.remove();
        }
    }, 6000);
}

// Initialize OG weather search functionality
function initOgWeatherSearch() {
    const searchButton = document.getElementById('ogSearchButton');
    const searchInput = document.getElementById('ogSearchInput');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', handleOgWeatherSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleOgWeatherSearch();
            }
        });
    }
}

// Handle weather search from OG theme
async function handleOgWeatherSearch() {
    const searchInput = document.getElementById('ogSearchInput');
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
                    const weatherTicker = document.getElementById('ogWeatherTicker');
                    if (weatherTicker) {
                        weatherTicker.style.display = 'block';
                        updateOgWeatherTicker(); // Start the ticker
                        
                        // Auto-scroll to show the weather ticker
                        setTimeout(() => {
                            scrollToWeatherWidget();
                        }, 500); // Small delay to let ticker render
                    }
                }, 1000); // Wait a second for weather data to load
                
            } catch (error) {
                console.error('Weather search failed:', error);
            }
        }
    }
    
    // Clear both OG and main inputs for consistency
    searchInput.value = '';
    if (mainCityInput) {
        mainCityInput.value = '';
    }
}

// Export functions for modular theme system
if (typeof window !== 'undefined') {
    window.initOGTheme = initOGTheme;
    window.cleanupOGTheme = cleanupOGTheme;
}