/**
 * Linux Theme Module
 * Simulates a Linux X-Windows desktop environment with terminal windows
 * Features desktop icons that launch terminal applications
 */

// Linux theme variables
let linuxIntervals = [];
let linuxTerminals = [];
let linuxUsername = 'root';
let linuxHostname = 'vulcan';
let nextTerminalId = 1;
let openWindows = new Map(); // Track open windows by app type

/**
 * Initialize and activate the Linux theme
 */
function initLinuxTheme() {
    
    currentTheme = 'linux';
    
    // Try to detect username and hostname from browser
    detectUserInfo();
    
    // Create desktop icons instead of terminal windows
    createDesktopIcons();
    
}

/**
 * Attempt to detect username and hostname from browser environment
 */
function detectUserInfo() {
    try {
        // Try to get some info from navigator
        const platform = navigator.platform || 'Linux';
        const userAgent = navigator.userAgent || '';
        
        // Try to extract hostname-like info from user agent or use defaults
        if (userAgent.includes('X11')) {
            linuxHostname = 'linuxbox';
        } else if (userAgent.includes('Macintosh')) {
            linuxHostname = 'macbox';
            linuxUsername = 'user';
        } else if (userAgent.includes('Windows')) {
            linuxHostname = 'winbox';
            linuxUsername = 'user';
        }
        
        // Check if we can get more specific info (this is limited in browsers)
        const language = navigator.language || 'en-US';
        if (language.includes('en-GB')) {
            linuxHostname = 'britbox';
        } else if (language.includes('de')) {
            linuxHostname = 'germbox';
        } else if (language.includes('fr')) {
            linuxHostname = 'frenchbox';
        } else if (language.includes('ja')) {
            linuxHostname = 'japanbox';
        }
        
        
    } catch (error) {
        // Keep defaults
    }
}

/**
 * Create desktop icons for launching applications
 */
function createDesktopIcons() {
    const body = document.body;
    
    const iconsContainer = document.createElement('div');
    iconsContainer.className = 'linux-desktop-icons';
    iconsContainer.innerHTML = `
        <div class="xterm-desktop-icon" data-app="weather" title="Weather Application">
            <div class="xterm-icon-image">
                <span class="xterm-icon-weather" style="font-size: 30px;">🌦️</span>
            </div>
            <div class="xterm-icon-label">Weather</div>
        </div>
        <div class="xterm-desktop-icon" data-app="clocker" title="Clock Application">
            <div class="xterm-icon-image">
                <span class="xterm-icon-script" style="font-size: 34px;">🕐</span>
            </div>
            <div class="xterm-icon-label">clocker.sh</div>
        </div>
        <div class="xterm-desktop-icon" data-app="xterm" title="Terminal">
            <div class="xterm-icon-image">
                <span class="xterm-icon-script" style="font-size: 32px;">📋</span>
            </div>
            <div class="xterm-icon-label">less clocker-improved</div>
        </div>
        <div class="xterm-desktop-icon" data-app="clocker-orig" title="Original Clocker Script">
            <div class="xterm-icon-image">
                <span class="xterm-icon-script" style="font-size: 32px;">📋</span>
            </div>
            <div class="xterm-icon-label">less clocker</div>
        </div>
        <div class="xterm-desktop-icon" data-app="readme" title="Linux Theme Documentation">
            <div class="xterm-icon-image">
                <span class="xterm-icon-help" style="font-size: 32px;">📖</span>
            </div>
            <div class="xterm-icon-label">README.1st</div>
        </div>
    `;
    
    body.appendChild(iconsContainer);
    
    // Set up icon click handlers
    setupDesktopIconHandlers();
}

/**
 * Setup desktop icon double-click handlers
 */
function setupDesktopIconHandlers() {
    const icons = document.querySelectorAll('.xterm-desktop-icon');
    
    icons.forEach(icon => {
        let clickTimeout;
        
        const handleIconClick = (e) => {
            e.preventDefault();
            
            // Clear any existing timeout
            if (clickTimeout) {
                clearTimeout(clickTimeout);
                clickTimeout = null;
            }
            
            // Single click - select icon
            document.querySelectorAll('.xterm-desktop-icon').forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
            
            // Set timeout for potential double-click
            clickTimeout = setTimeout(() => {
                // Single click timeout - just keep selected
                clickTimeout = null;
            }, 300);
        };
        
        const handleIconDoubleClick = (e) => {
            e.preventDefault();
            
            // Clear single-click timeout
            if (clickTimeout) {
                clearTimeout(clickTimeout);
                clickTimeout = null;
            }
            
            // Launch application
            const appType = icon.dataset.app;
            icon.classList.add('launching');
            
            setTimeout(() => {
                icon.classList.remove('launching', 'selected');
                launchApplication(appType);
            }, 300);
        };
        
        // Register event listeners for cleanup
        registerEventListener(icon, 'click', handleIconClick);
        registerEventListener(icon, 'dblclick', handleIconDoubleClick);
    });
}

/**
 * Launch an application in a new xTerm window
 */
function launchApplication(appType) {
    // Check if application is already running
    if (openWindows.has(appType)) {
        // Bring existing window to front
        const existingTerminal = openWindows.get(appType);
        if (existingTerminal && existingTerminal.parentNode) {
            bringToFront(existingTerminal);
            return;
        } else {
            // Window was closed, remove from tracking
            openWindows.delete(appType);
        }
    }
    
    const terminalId = nextTerminalId++;
    
    // Calculate starting position to avoid task switcher (15% from top)
    const startY = Math.floor(window.innerHeight * 0.15);
    
    // Cascading positioning with better spacing (20% from left to avoid icons)
    const startX = Math.floor(window.innerWidth * 0.20); // Start 20% from left edge
    let x = startX + (openWindows.size) * 40; // Slightly more horizontal offset
    let y = startY + (openWindows.size) * 35; // Start 15% down, cascade with vertical offset
    
    // Ensure windows don't go off screen - if so, start new cascade
    if (x + 640 > window.innerWidth || y + 400 > window.innerHeight) {
        // Reset to new cascade position
        const cascadeLevel = Math.floor(openWindows.size / 8); // New cascade every 8 windows
        x = startX + (cascadeLevel * 60);
        y = startY + ((openWindows.size % 8) * 35);
    }
    
    if (appType === 'weather') {
        launchWeatherApplication(terminalId, x, y);
    } else if (appType === 'clocker') {
        launchClockerApplication(terminalId, x, y);
    } else if (appType === 'xterm') {
        launchXTermApplication(terminalId, x, y);
    } else if (appType === 'clocker-orig') {
        launchClockerOrigApplication(terminalId, x, y);
    } else if (appType === 'readme') {
        launchReadmeApplication(terminalId, x, y);
    }
}

/**
 * Launch the Weather application
 */
function launchWeatherApplication(terminalId, x, y) {
    const terminal = createDraggableTerminal(terminalId, 'weather', x, y, 600, 400);
    document.body.appendChild(terminal);
    linuxTerminals.push(terminal);
    openWindows.set('weather', terminal); // Track this window
    
    // Focus the new terminal
    setTimeout(() => {
        bringToFront(terminal);
        
        // Simulate typing the weather command
        const content = terminal.querySelector('.xterm-content');
        const initialPrompt = content.querySelector('.xterm-line');
        
        // Show the command being typed
        setTimeout(() => {
            initialPrompt.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ ./weather`;
            
            // Add new line and show the weather prompt
            setTimeout(() => {
                const promptLine = document.createElement('div');
                promptLine.className = 'xterm-line';
                promptLine.innerHTML = `Enter Location for Weather Forecast (Enter to Continue): `;
                content.appendChild(promptLine);
                
                // Create input for weather location
                const inputLine = document.createElement('div');
                inputLine.className = 'xterm-line';
                inputLine.innerHTML = `<input type="text" id="weatherInput${terminalId}" class="xterm-weather-input" style="background: transparent; border: none; color: #00ff00; outline: none; font-family: 'Courier New', monospace; font-size: 14px; width: 300px;" placeholder="Enter city name or 'q' to quit..." maxlength="50">`;
                content.appendChild(inputLine);
                
                // Set up weather input handling
                setupWeatherInput(terminal, terminalId);
                
                // Show cursor after input
                showCursorInTerminal(terminal);
                
                // Focus the input
                setTimeout(() => {
                    const weatherInput = document.getElementById(`weatherInput${terminalId}`);
                    if (weatherInput) {
                        weatherInput.focus();
                    }
                }, 100);
                
            }, 1000);
        }, 500);
        
    }, 100);
}

/**
 * Launch the Clocker application (original clocker script)
 */
function launchClockerApplication(terminalId, x, y) {
    const terminal = createDraggableTerminal(terminalId, 'clocker', x, y, 600, 400);
    document.body.appendChild(terminal);
    linuxTerminals.push(terminal);
    openWindows.set('clocker', terminal); // Track this window
    
    // Focus the new terminal
    setTimeout(() => {
        bringToFront(terminal);
        
        // Simulate typing the clocker command
        const content = terminal.querySelector('.xterm-content');
        const initialPrompt = content.querySelector('.xterm-line');
        
        // Show the command being typed
        setTimeout(() => {
            initialPrompt.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ ./clocker`;
            
            // Start the original clocker display
            setTimeout(() => {
                // Clear content first (original clocker clears screen)
                content.innerHTML = '';
                
                // Create main clocker display area
                const clockerDiv = document.createElement('div');
                clockerDiv.id = `xtermClocker${terminalId}`;
                clockerDiv.className = 'xterm-clocker';
                clockerDiv.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: calc(100% - 60px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-family: 'Courier New', 'DejaVu Sans Mono', monospace;
                    pointer-events: none;
                `;
                content.appendChild(clockerDiv);
                
                // Create timezone controls area at the bottom
                const timezoneDiv = document.createElement('div');
                timezoneDiv.id = `xtermTimezone${terminalId}`;
                timezoneDiv.className = 'xterm-clocker-timezone';
                timezoneDiv.style.cssText = `
                    position: absolute;
                    bottom: 25px;
                    left: 0;
                    width: 100%;
                    height: 60px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-family: 'Courier New', 'DejaVu Sans Mono', monospace;
                    background: rgba(0, 0, 0, 0.1);
                    border-top: 1px solid #00ff00;
                    pointer-events: none;
                `;
                content.appendChild(timezoneDiv);
                
                // Create status bar at the very bottom
                const statusDiv = document.createElement('div');
                statusDiv.id = `xtermStatus${terminalId}`;
                statusDiv.className = 'xterm-clocker-status';
                statusDiv.style.cssText = `
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 25px;
                    background: #00ff00;
                    color: #000000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-family: 'Courier New', 'DejaVu Sans Mono', monospace;
                    font-size: 12px;
                    font-weight: bold;
                    border-top: 1px solid #008800;
                    pointer-events: none;
                `;
                statusDiv.innerHTML = 'Left/Right Arrow Key to change timezone, Q to Quit';
                content.appendChild(statusDiv);
                
                // Initialize timezone index (start with local time)
                terminal.timezoneIndex = findLocalTimezoneIndex();
                
                // Start updating the original clocker with centering and timezone controls
                startOriginalClockerUpdate(terminalId, terminal);
                
            }, 1000);
        }, 500);
        
    }, 100);
}

/**
 * Launch the xTerm less viewer application
 */
function launchXTermApplication(terminalId, x, y) {
    const terminal = createDraggableTerminal(terminalId, 'less clocker-improved', x, y, 600, 400);
    document.body.appendChild(terminal);
    linuxTerminals.push(terminal);
    openWindows.set('xterm', terminal); // Track this window
    
    // Focus the new terminal
    setTimeout(() => {
        bringToFront(terminal);
        
        // Simulate typing the less command
        const content = terminal.querySelector('.xterm-content');
        const initialPrompt = content.querySelector('.xterm-line');
        
        // Show the command being typed
        setTimeout(() => {
            initialPrompt.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ less clocker-improved.sh`;
            
            // Start the less viewer
            setTimeout(() => {
                // Get the content of the clocker-improved script
                const scriptContent = getClockerImprovedScript();
                createLessViewer(terminal, scriptContent, 'clocker-improved.sh');
            }, 1000);
        }, 500);
        
    }, 100);
}

/**
 * Launch the original Clocker less viewer application
 */
function launchClockerOrigApplication(terminalId, x, y) {
    const terminal = createDraggableTerminal(terminalId, 'less clocker', x, y, 600, 400);
    document.body.appendChild(terminal);
    linuxTerminals.push(terminal);
    openWindows.set('clocker-orig', terminal); // Track this window
    
    // Focus the new terminal
    setTimeout(() => {
        bringToFront(terminal);
        
        // Simulate typing the less command
        const content = terminal.querySelector('.xterm-content');
        const initialPrompt = content.querySelector('.xterm-line');
        
        // Show the command being typed
        setTimeout(() => {
            initialPrompt.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ less clocker`;
            
            // Start the less viewer
            setTimeout(() => {
                // Get the content of the original clocker script
                const scriptContent = getOriginalClockerScript();
                createLessViewer(terminal, scriptContent, 'clocker');
            }, 1000);
        }, 500);
        
    }, 100);
}

/**
 * Launch the README.1st documentation viewer
 */
function launchReadmeApplication(terminalId, x, y) {
    const terminal = createDraggableTerminal(terminalId, 'README.1st', x, y, 700, 500);
    document.body.appendChild(terminal);
    linuxTerminals.push(terminal);
    openWindows.set('readme', terminal); // Track this window
    
    // Focus the new terminal
    setTimeout(() => {
        bringToFront(terminal);
        
        // Simulate typing the command
        const content = terminal.querySelector('.xterm-content');
        const initialPrompt = content.querySelector('.xterm-line');
        
        // Show the command being typed
        setTimeout(() => {
            initialPrompt.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ less README.1st`;
            
            // Start the less viewer
            setTimeout(() => {
                // Get the README documentation content
                const readmeContent = getReadmeHelpContent();
                createLessViewer(terminal, readmeContent, 'README.1st');
            }, 1000);
        }, 500);
        
    }, 100);
}

/**
 * Get the content of the original clocker script
 */
function getOriginalClockerScript() {
    return `#!/bin/bash

# clear the screen and hide the cursor
clear
tput civis # Cursor to invisible

# function to restore the cursor
cleanup() {
    tput cnorm # Cursor to normal (i.e., "Normal)
    tput cvvis # Cursor to blinking (i.e., "Very Visible")
    echo
    echo "Quit at $timestr on $daystr, $datestr."
}

# Trap the EXIT (Ctrl+C) and call the cleanup function to restore the curosr
trap cleanup EXIT

# function to draw the date and time
redraw() {
    local daystr daylen datestr datelen timestr timestr2 timelen timelen2 width height heightPlusTwo heightLessTwo
    while sleep 1 
        do
        width=$(tput cols) # the number of columns wide in the terminal
        height=$(tput lines) # the number of lines high in the terminal
        heightPlusFour=$((height + 4)) # a value to use to place the cursor that's 2 lines after the center line.
        heightLessFour=$((height - 4)) # places the cursor 2 lines before the center line.
        daystr=$(date +'%A') # Full name of the day, locally
        daylen=\${#daystr} # Number of columns used by the name of the day (e.g., "Monday" = "6")
        # MM DD, YYYY formated date (e.g., May 14, 2025), the sed adds the "ordinal suffix" to the value of DD (e.g., "May 14, 2025" becomes "May 14th, 2025")
        datestr=$(date +'%b. %eXX, %Y' | sed -e 's/May./May/' -e 's/11XX/11th/' -e 's/12XX/12th/' -e 's/13XX/13th/' -e 's/1XX/1st/' -e 's/2XX/2nd/' -e 's/3XX/3rd/' -e 's/XX/th/')
        datelen=\${#datestr} # Number of columns used by the formatted date.
        timestr=$(date +'%l:%M:%S %p %Z') # Time of day in 12 hr format with AM/PM and the local timezone displayed (e.g., 6:22:33 AM EDT)
        timelen=\${#timestr} # Number of columns used by the formatted time.
        tput cup $((heightLessFour / 2)) $(((width / 2) - (daylen / 2))) # set the cursor location to be 2 lines above the middle line on the column which will center the "Day"
        echo "$daystr"
        tput cup $((height / 2)) $(((width / 2) - (datelen /2))) # set the cursor location to the middle line and the column to center the date string
        echo "$datestr"
        tput cup $((heightPlusFour / 2)) $(((width / 2) - (timelen / 2))) # set the cursor location two lines below the middle line and the column to center the time string
        echo "$timestr"
    done
}

# trap to reset the position if the screen is resized
trap clear WINCH 

redraw # call the redraw subroutine which will re-calculate the rows and columns of the term window and recenter the output
`;
}

/**
 * Get the content of the clocker-improved script
 */
function getClockerImprovedScript() {
    return `#!/usr/bin/env bash

# Clocker - Enhanced Terminal Clock Display
# Fixed version addressing all critical issues found in original

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Global configuration
readonly MIN_WIDTH=25
readonly MIN_HEIGHT=7
readonly REFRESH_RATE=1

# Global display variables
declare DISPLAY_DAY DISPLAY_DATE DISPLAY_TIME
declare TERMINAL_WIDTH TERMINAL_HEIGHT

# Check dependencies and terminal capabilities
check_requirements() {
    local missing_commands=()
    
    for cmd in tput date sleep; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            missing_commands+=("$cmd")
        fi
    done
    
    if [[ \${#missing_commands[@]} -gt 0 ]]; then
        printf "Error: Missing required commands: %s\\n" "\${missing_commands[*]}" >&2
        exit 1
    fi
    
    # Validate terminal capabilities
    if ! tput cols >/dev/null 2>&1 || ! tput lines >/dev/null 2>&1; then
        echo "Error: Terminal does not support cursor positioning" >&2
        exit 1
    fi
    
    # Check minimum terminal size
    update_terminal_size
    if [[ $TERMINAL_WIDTH -lt $MIN_WIDTH || $TERMINAL_HEIGHT -lt $MIN_HEIGHT ]]; then
        echo "Error: Terminal too small (minimum \${MIN_WIDTH}x\${MIN_HEIGHT}, current \${TERMINAL_WIDTH}x\${TERMINAL_HEIGHT})" >&2
        exit 1
    fi
}

# Update terminal dimensions
update_terminal_size() {
    TERMINAL_WIDTH=$(tput cols)
    TERMINAL_HEIGHT=$(tput lines)
}

# Enhanced ordinal suffix function with proper logic
get_ordinal_suffix() {
    local day=$1
    local last_digit=$((day % 10))
    local last_two_digits=$((day % 100))
    
    # Special cases: 11th, 12th, 13th
    if [[ $last_two_digits -ge 11 && $last_two_digits -le 13 ]]; then
        echo "th"
        return
    fi
    
    # Regular cases based on last digit
    case $last_digit in
        1) echo "st" ;;
        2) echo "nd" ;;
        3) echo "rd" ;;
        *) echo "th" ;;
    esac
}

# Format date with proper ordinal suffix
format_date() {
    local day_name
    local month_name  
    local day_num
    local year
    local ordinal_suffix
    
    day_name=$(date '+%A')
    month_name=$(date '+%b.')
    day_num=$(date '+%-d')  # Remove leading zero
    year=$(date '+%Y')
    ordinal_suffix=$(get_ordinal_suffix "$day_num")
    
    DISPLAY_DAY="$day_name"
    DISPLAY_DATE="$month_name $day_num$ordinal_suffix, $year"
}

# Format time with timezone
format_time() {
    local hour minute second ampm timezone
    
    hour=$(date '+%-I')     # 12-hour format, no leading zero
    minute=$(date '+%M')
    second=$(date '+%S')
    ampm=$(date '+%p')
    timezone=$(date '+%Z')
    
    DISPLAY_TIME="$hour:$minute:$second $ampm $timezone"
}

# Calculate positioning for centered display
calculate_positions() {
    local day_length=\${#DISPLAY_DAY}
    local date_length=\${#DISPLAY_DATE}
    local time_length=\${#DISPLAY_TIME}
    
    # Calculate center positions
    DAY_COL=$(( (TERMINAL_WIDTH - day_length) / 2 ))
    DATE_COL=$(( (TERMINAL_WIDTH - date_length) / 2 ))
    TIME_COL=$(( (TERMINAL_WIDTH - time_length) / 2 ))
    
    # Vertical positioning (center of screen)
    DAY_ROW=$(( TERMINAL_HEIGHT / 2 - 1 ))
    DATE_ROW=$(( TERMINAL_HEIGHT / 2 ))
    TIME_ROW=$(( TERMINAL_HEIGHT / 2 + 1 ))
    
    # Boundary checks to prevent positioning errors
    [[ $DAY_COL -lt 1 ]] && DAY_COL=1
    [[ $DATE_COL -lt 1 ]] && DATE_COL=1
    [[ $TIME_COL -lt 1 ]] && TIME_COL=1
    
    [[ $DAY_ROW -lt 1 ]] && DAY_ROW=1
    [[ $DATE_ROW -lt 1 ]] && DATE_ROW=2
    [[ $TIME_ROW -lt 1 ]] && TIME_ROW=3
}

# Display the formatted time
display_time() {
    # Only clear and reposition if content actually changed
    local new_content="\$DISPLAY_DAY\$DISPLAY_DATE\$DISPLAY_TIME"
    if [[ "\$new_content" != "\$last_content" ]]; then
        tput clear
        
        # Position and display day
        tput cup "$((DAY_ROW - 1))" "$((DAY_COL - 1))" 2>/dev/null || true
        echo -n "$DISPLAY_DAY"
        
        # Position and display date
        tput cup "$((DATE_ROW - 1))" "$((DATE_COL - 1))" 2>/dev/null || true
        echo -n "$DISPLAY_DATE"
        
        # Position and display time
        tput cup "$((TIME_ROW - 1))" "$((TIME_COL - 1))" 2>/dev/null || true
        echo -n "$DISPLAY_TIME"
        
        last_content="\$new_content"
    fi
}

# Signal handlers for clean exit
cleanup_and_exit() {
    tput clear 2>/dev/null || true
    tput cup 0 0 2>/dev/null || true
    tput cnorm 2>/dev/null || true  # Show cursor
    echo "Clocker stopped."
    exit 0
}

# Handle window resize
handle_resize() {
    update_terminal_size
    # Force redraw on next iteration
    last_content=""
}

# Set up signal handlers
trap cleanup_and_exit INT TERM QUIT
trap handle_resize WINCH

# Main execution function
main() {
    local last_content=""
    
    # Initial setup
    check_requirements
    tput civis 2>/dev/null || true  # Hide cursor
    
    echo "Starting Enhanced Clocker... Press Ctrl+C to exit."
    sleep 1
    
    # Main display loop with single date call per iteration
    while true; do
        # Get all time data in single call for efficiency
        local datetime_output
        datetime_output=$(date '+%A|%b.|%-d|%Y|%-I|%M|%S|%p|%Z' 2>/dev/null) || {
            echo "Error: Failed to get current date/time" >&2
            exit 1
        }
        
        # Parse the output efficiently
        IFS='|' read -r day_name month_name day_num year hour minute second ampm timezone <<< "$datetime_output"
        
        # Calculate ordinal suffix
        local ordinal_suffix
        ordinal_suffix=$(get_ordinal_suffix "$day_num")
        
        # Build display strings
        DISPLAY_DAY="$day_name"
        DISPLAY_DATE="$month_name $day_num$ordinal_suffix, $year"  
        DISPLAY_TIME="$hour:$minute:$second $ampm $timezone"
        
        # Update terminal size and calculate positions
        update_terminal_size
        calculate_positions
        
        # Display the formatted time
        display_time
        
        # Sleep for specified refresh rate
        sleep "$REFRESH_RATE"
    done
}

# Execute main function
main "$@"`;
}

/**
 * Get the README.1st documentation content
 */
function getReadmeHelpContent() {
    return `README.1st(1)                    CLOCKER LINUX THEME                    README.1st(1)

NAME
       Clocker Linux Theme - X-Windows desktop simulation with terminal applications

SYNOPSIS
       The Linux theme provides a full desktop environment simulation featuring:
       • Draggable and resizable xterm windows
       • Desktop icons for launching applications  
       • Terminal applications with authentic Unix behavior
       • Window management system with focus control
       • Interactive command-line interfaces

DESCRIPTION
       The Clocker Linux Theme simulates a classic X-Windows desktop environment, 
       complete with terminal applications, window management, and desktop icons.
       This theme recreates the authentic Unix/Linux desktop experience within
       the web browser.

DESKTOP ENVIRONMENT
   Desktop Icons
       The desktop contains clickable icons that launch terminal applications:

       🌦️  Weather      - Interactive weather forecast application
       🕐  clocker.sh   - Enhanced clocker script with timezone controls  
       📋  less clocker-improved - View the improved clocker source code
       📋  less clocker - View the original clocker script source
       📖  README.1st   - This documentation (you are here!)

   Window Management
       All terminal windows feature:
       • Draggable titlebar for repositioning
       • Resize handles on all edges and corners
       • Close button (×) in upper right corner
       • Focus management - click to bring window to front
       • Cascading placement to prevent overlap

TERMINAL APPLICATIONS
   Weather Application (weather)
       Interactive weather forecasting terminal with ncurses-style interface:
       
       Commands:
       • Enter city name, ZIP code, or coordinates for forecast
       • 'q' or 'quit' - Exit weather application immediately
       • Up/Down arrows - Access command history
       • './weather' or Enter - Restart weather application
       
       Features:
       • Real-time weather data from OpenWeatherMap API
       • Current conditions with temperature, humidity, wind
       • 5-day forecast with detailed weather information  
       • Location search supporting cities, ZIP codes, coordinates
       • Graceful error handling for invalid locations
       • Command history for repeated searches

   Clocker Application (clocker.sh)
       Enhanced clocker script with timezone management:
       
       Controls:
       • Left/Right Arrow Keys - Navigate through world timezones
       • 'q' - Quit clocker application
       • './clocker' or Enter - Restart clocker
       
       Features:
       • Real-time clock display with seconds precision
       • Full day, date with ordinal suffixes, time with AM/PM
       • 39 worldwide timezones with DST calculation
       • Automatic DST detection for applicable regions
       • Timezone abbreviations (EST/EDT, PST/PDT, etc.)
       • GMT offset display with current local time indicator
       • Centered display with automatic terminal resize handling

   Script Viewers (less clocker, less clocker-improved)
       Interactive file viewers using less-style interface:
       
       Navigation:
       • Arrow Keys, Page Up/Down - Scroll through content
       • Home/End - Jump to beginning/end of file
       • 'q' - Quit viewer and return to command prompt
       • 's' - Save script to local computer
       
       Features:
       • Syntax highlighting for shell scripts
       • Line-by-line scrolling with smooth animation
       • Status bar showing current position and filename
       • Full source code of both clocker implementations
       • Download functionality for script files

   General Terminal Features
       All terminal windows support:
       • Command history with Up/Down arrow navigation
       • './appname' command to restart applications
       • 'q' or 'quit' for immediate application exit
       • Ctrl+C handling for graceful process termination
       • Automatic focus management and cursor display
       • Resizable content areas with scroll support

KEYBOARD SHORTCUTS
   Global Shortcuts
       These work when Linux theme is active:
       • Ctrl+C - Show themed exit dialog and switch to random theme
       
   Window Management
       • Click titlebar and drag - Move window
       • Click any content area - Focus window (bring to front)
       • Click × button - Close window
       • Drag resize handles - Resize window in any direction
       
   Terminal Navigation
       • Up/Down Arrows - Command history in application prompts
       • Left/Right Arrows - Timezone navigation (clocker only)
       • Enter - Execute command or restart application
       • 'q' - Universal quit command for all applications
       • Page Up/Down - Scroll in less viewers

TECHNICAL IMPLEMENTATION
   Window System
       • Z-index management for proper window stacking
       • Event listener cleanup to prevent memory leaks
       • ResizeObserver for responsive content layouts
       • Mouse event handling for drag and resize operations
       • Touch device compatibility for mobile browsers
       
   Applications
       • Modular architecture with separate launch functions
       • Process simulation with authentic Unix command behavior  
       • Real API integration for live weather data
       • Accurate timezone calculations with DST support
       • Command history persistence per terminal instance
       
   Performance
       • Efficient DOM manipulation with minimal reflows
       • Event delegation for optimal browser performance
       • Memory cleanup on window close and theme switch
       • Responsive design adapting to various screen sizes

THEME INTEGRATION
       The Linux theme integrates with the main Clocker application:
       • Timezone synchronization with main interface
       • Weather data sharing with other themes
       • Consistent visual styling across all components
       • Mobile device detection and optimization
       • Seamless theme switching capabilities

COMPATIBILITY
   Supported Browsers
       • Chrome/Chromium 70+
       • Firefox 65+  
       • Safari 12+
       • Edge 79+
       
   Screen Resolutions
       • Minimum: 1024×768 (desktop icons may overlay)
       • Recommended: 1280×720 or higher
       • Responsive design scales to available space
       • Mobile browsers supported with touch interactions

TROUBLESHOOTING
   Common Issues
       • Terminal not responding - Click content area to focus
       • Weather data not loading - Check internet connection
       • Window dragging issues - Ensure clicking on titlebar
       • Keyboard shortcuts not working - Click terminal to focus
       • Resize handles not visible - Hover over window edges
       
   Performance Tips
       • Close unused terminal windows to improve performance
       • Avoid opening too many applications simultaneously
       • Use 'q' command for clean application shutdown
       • Refresh browser if memory usage becomes excessive

FILES
       linux-theme.js         Main theme implementation
       linux-theme.css        Window styling and animations
       timezones.js          Timezone data with DST rules
       core-script.js        Theme switching and integration

AUTHORS
       Created as part of the Clocker Web application suite.
       Weather data provided by OpenWeatherMap API.
       Timezone calculations based on IANA timezone database.

SEE ALSO
       clocker(1), weather(1), less(1), xterm(1)

VERSION
       Linux Theme v2.0 - Enhanced desktop environment simulation
       
       For more information about Clocker themes, press Ctrl+C to switch themes
       or visit the project documentation.

                                  $(date '+%B %Y')                           README.1st(1)`;
}

/**
 * Create a less viewer interface
 */
function createLessViewer(terminal, content, filename = 'file') {
    const terminalContent = terminal.querySelector('.xterm-content');
    
    // Clear existing content except the command line
    const commandLine = terminalContent.querySelector('.xterm-line');
    terminalContent.innerHTML = '';
    terminalContent.appendChild(commandLine);
    
    // Create less viewer container
    const lessContainer = document.createElement('div');
    lessContainer.style.cssText = `
        position: relative;
        height: calc(100% - 20px);
        margin-top: 2px;
    `;
    
    // Create the scrollable text area
    const lessViewer = document.createElement('div');
    lessViewer.className = 'xterm-less-viewer';
    lessViewer.textContent = content;
    
    // Create status bar
    const statusBar = document.createElement('div');
    statusBar.className = 'xterm-less-status';
    statusBar.textContent = `${filename} - Use arrow keys or mouse wheel to scroll, s to save, q to quit`;
    
    lessContainer.appendChild(lessViewer);
    lessContainer.appendChild(statusBar);
    terminalContent.appendChild(lessContainer);
    
    // Set up keyboard and mouse wheel handlers
    setupLessViewer(terminal, lessViewer, statusBar);
    
    // Set up resize handler
    setupResizeHandler(terminal, lessViewer);
}

/**
 * Download file content to the user's browser with confirmation
 */
function downloadFile(content, filename) {
    // Show confirmation dialog
    const confirmed = confirm(`Do you want to download ${filename}?\n\nThis will save the script file to your computer's Downloads folder.`);
    
    if (!confirmed) {
        return; // User cancelled, return to previous state
    }
    
    try {
        // Create a blob with the file content
        const blob = new Blob([content], { type: 'text/plain' });
        
        // Create a temporary download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = filename;
        
        // Trigger the download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Clean up
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
        
    } catch (error) {
        alert(`Error downloading file: ${error.message}`);
    }
}

/**
 * Extract filename from status bar text
 */
function getFilenameFromStatusBar(statusBar) {
    const statusText = statusBar.textContent;
    
    // Extract filename from status bar (format: "filename - Use arrow keys...")
    // Look for the pattern "filename - Use arrow keys" and extract everything before " - Use"
    const match = statusText.match(/^(.+?)\s*-\s*Use arrow keys/);
    let filename = match ? match[1].trim() : 'script';
    
    // Ensure proper file extension based on filename
    if (filename === 'clocker' && !filename.includes('.')) {
        filename = 'clocker.sh';
    } else if (filename === 'clocker-improved.sh') {
        // Already has extension
        filename = 'clocker-improved.sh';
    } else if (filename.includes('clocker-improved')) {
        // Handle any variation of clocker-improved
        filename = 'clocker-improved.sh';
    } else if (!filename.includes('.')) {
        // Add .sh extension if no extension present
        filename += '.sh';
    }
    
    return filename;
}

/**
 * Setup less viewer keyboard and mouse handlers
 */
function setupLessViewer(terminal, lessViewer, statusBar) {
    // Focus the terminal so it can receive keyboard events
    terminal.tabIndex = -1;
    terminal.focus();
    
    // Keyboard handlers
    const handleKeyPress = (e) => {
        switch(e.key) {
            case 's':
            case 'S':
                // Save file - download the content
                downloadFile(lessViewer.textContent, getFilenameFromStatusBar(statusBar));
                break;
            case 'q':
            case 'Q':
                // Quit less viewer - close the terminal
                closeTerminal(terminal);
                break;
            case 'ArrowUp':
                e.preventDefault();
                lessViewer.scrollTop -= 20;
                break;
            case 'ArrowDown':
                e.preventDefault();
                lessViewer.scrollTop += 20;
                break;
            case 'PageUp':
                e.preventDefault();
                lessViewer.scrollTop -= lessViewer.clientHeight * 0.8;
                break;
            case 'PageDown':
                e.preventDefault();
                lessViewer.scrollTop += lessViewer.clientHeight * 0.8;
                break;
            case 'Home':
                e.preventDefault();
                lessViewer.scrollTop = 0;
                break;
            case 'End':
                e.preventDefault();
                lessViewer.scrollTop = lessViewer.scrollHeight;
                break;
        }
    };
    
    // Mouse wheel handler
    const handleWheel = (e) => {
        e.preventDefault();
        lessViewer.scrollTop += e.deltaY;
    };
    
    // Register event listeners for cleanup
    registerEventListener(terminal, 'keydown', handleKeyPress);
    registerEventListener(lessViewer, 'wheel', handleWheel);
}

/**
 * Setup resize handler for less viewer
 */
function setupResizeHandler(terminal, lessViewer) {
    const handleResize = () => {
        // The CSS height calc() will automatically adjust
        // Force a reflow to ensure scrollbar updates
        lessViewer.style.height = lessViewer.style.height;
    };
    
    // Use ResizeObserver if available, otherwise fall back to window resize
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(terminal);
    } else {
        registerEventListener(window, 'resize', handleResize);
    }
}

/**
 * Close a terminal window
 */
function closeTerminal(terminal) {
    const appType = getAppTypeFromTerminal(terminal);
    
    // Clean up ResizeObserver if it exists
    if (terminal.clockerResizeObserver) {
        terminal.clockerResizeObserver.disconnect();
        terminal.clockerResizeObserver = null;
    }
    
    // Remove from tracking
    if (appType) {
        openWindows.delete(appType);
    }
    
    // Remove from terminals array
    const index = linuxTerminals.indexOf(terminal);
    if (index > -1) {
        linuxTerminals.splice(index, 1);
    }
    
    // Remove from DOM
    if (terminal.parentNode) {
        terminal.parentNode.removeChild(terminal);
    }
}

/**
 * Get app type from terminal element
 */
function getAppTypeFromTerminal(terminal) {
    for (const [appType, trackedTerminal] of openWindows.entries()) {
        if (trackedTerminal === terminal) {
            return appType;
        }
    }
    return null;
}

/**
 * Setup weather input handling for a terminal
 */
function setupWeatherInput(terminal, terminalId) {
    const weatherInput = document.getElementById(`weatherInput${terminalId}`);
    const content = terminal.querySelector('.xterm-content');
    
    if (weatherInput) {
        // Handle 'q' key for immediate quit
        registerEventListener(weatherInput, 'keydown', (event) => {
            if (event.key === 'q' || event.key === 'Q') {
                event.preventDefault();
                closeTerminal(terminal);
                return;
            }
        });
        
        registerEventListener(weatherInput, 'keypress', async (event) => {
            if (event.key === 'Enter') {
                const location = weatherInput.value.trim();
                
                if (location) {
                    // Hide the input and show what was typed
                    const inputLine = weatherInput.parentElement;
                    inputLine.innerHTML = `${location}`;
                    
                    // Show loading
                    const loadingLine = document.createElement('div');
                    loadingLine.className = 'xterm-line';
                    loadingLine.innerHTML = 'Connecting to weather service...';
                    content.appendChild(loadingLine);
                    
                    try {
                        // Use the existing weather API function
                        const weatherData = await fetchWeatherData(location);
                        
                        if (weatherData) {
                            // Remove loading line
                            loadingLine.remove();
                            
                            // Create weather ticker display
                            createWeatherNcursesDisplay(terminal, weatherData);
                        } else {
                            loadingLine.innerHTML = 'ERROR: Location not found';
                        }
                    } catch (error) {
                        loadingLine.innerHTML = `ERROR: ${error.message}`;
                    }
                }
            }
        });
    }
}

/**
 * Create weather ncurses display in terminal
 */
function createWeatherNcursesDisplay(terminal, weatherData) {
    const content = terminal.querySelector('.xterm-content');
    
    // Create weather display container
    const weatherDisplay = document.createElement('div');
    weatherDisplay.className = 'xterm-weather-ncurses';
    weatherDisplay.style.cssText = `
        border: 1px solid #00ff00;
        padding: 8px;
        margin: 8px 0;
        background: rgba(0, 0, 0, 0.8);
    `;
    
    // Current weather
    const currentTemp = Math.round((weatherData.current.temp * 9/5) + 32);
    const coords = `${weatherData.coord.latitude}, ${weatherData.coord.longitude}`;
    const windSpeed = weatherData.wind ? Math.round(weatherData.wind.speed * 2.237) : 0;
    
    // Create weather ticker content - similar to other themes but in ncurses style
    const weatherContent = document.createElement('div');
    
    // Calculate box width dynamically based on the header line
    const headerLine = "┌─ WEATHER FORECAST ───────────────────────────────┐";
    const totalWidth = headerLine.length;
    const innerWidth = totalWidth - 4; // Width for content (excluding "│ " and " │")
    
    weatherContent.innerHTML = `
        <div class="xterm-line">${headerLine}</div>
        <div class="xterm-line">│ LOCATION: ${weatherData.name.padEnd(innerWidth - 10)} ##########│</div>
        <div class="xterm-line">│ COORDS:   ${coords.padEnd(innerWidth - 9)} ##########│</div>
        <div class="xterm-line">│ ${'─'.repeat(innerWidth)} │</div>
        <div class="xterm-line">│ CURRENT CONDITIONS:${' '.repeat(innerWidth - 19)} │</div>
        <div class="xterm-line">│   Temperature: ${(currentTemp + '°F').padEnd(innerWidth - 14)} ##########│</div>
        <div class="xterm-line">│   Humidity:    ${(weatherData.current.humidity + '%').padEnd(innerWidth - 14)} ##########│</div>
        <div class="xterm-line">│   Description: ${weatherData.current.description.padEnd(innerWidth - 14)} ##########│</div>
        <div class="xterm-line">│   Wind Speed:  ${(windSpeed + ' mph').padEnd(innerWidth - 14)} ##########│</div>
        <div class="xterm-line">│ ${'─'.repeat(innerWidth)} │</div>
        <div class="xterm-line">│ FORECAST:${' '.repeat(innerWidth - 9)} │</div>
    `;
    
    // Add 5-day forecast
    const dailyForecasts = [];
    for (let i = 8; i < weatherData.forecast.length && dailyForecasts.length < 5; i += 8) {
        dailyForecasts.push(weatherData.forecast[i]);
    }
    
    dailyForecasts.forEach(forecast => {
        const forecastTemp = Math.round((forecast.temp * 9/5) + 32);
        const forecastDate = new Date(forecast.dt * 1000);
        const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastLine = document.createElement('div');
        forecastLine.className = 'xterm-line';
        const forecastText = `${dayName}: ${forecastTemp}°F ${forecast.description}`;
        forecastLine.innerHTML = `│   ${forecastText.padEnd(innerWidth - 4)} ##########│`;
        weatherContent.appendChild(forecastLine);
    });
    
    const closingLine = document.createElement('div');
    closingLine.className = 'xterm-line';
    closingLine.innerHTML = `└${'─'.repeat(totalWidth - 2)}┘`;
    weatherContent.appendChild(closingLine);
    
    weatherDisplay.appendChild(weatherContent);
    content.appendChild(weatherDisplay);
    
    // Add restart prompt after weather display
    setTimeout(() => {
        const restartPromptLine = document.createElement('div');
        restartPromptLine.className = 'xterm-line';
        restartPromptLine.innerHTML = 'Enter Location for Weather Forecast (Enter to Continue or Q to Quit): ';
        content.appendChild(restartPromptLine);
        
        // Create new input for restart
        const restartInputLine = document.createElement('div');
        restartInputLine.className = 'xterm-line';
        const newInputId = `weatherRestartInput${terminal.dataset.terminalId}_${Date.now()}`;
        restartInputLine.innerHTML = `<input type="text" id="${newInputId}" class="xterm-weather-input" style="background: transparent; border: none; color: #00ff00; outline: none; font-family: 'Courier New', monospace; font-size: 14px; width: 300px;" placeholder="Enter city name or 'q' to quit..." maxlength="50">`;
        content.appendChild(restartInputLine);
        
        // Set up new weather input handling
        setupWeatherRestartInput(terminal, newInputId);
        
        // Focus the new input
        setTimeout(() => {
            const newWeatherInput = document.getElementById(newInputId);
            if (newWeatherInput) {
                newWeatherInput.focus();
            }
        }, 100);
        
        // Scroll to bottom
        content.scrollTop = content.scrollHeight;
    }, 1000);
}

/**
 * Setup weather restart input handling
 */
function setupWeatherRestartInput(terminal, inputId) {
    const weatherInput = document.getElementById(inputId);
    const content = terminal.querySelector('.xterm-content');
    
    if (weatherInput) {
        // Handle 'q' key for immediate quit
        registerEventListener(weatherInput, 'keydown', (event) => {
            if (event.key === 'q' || event.key === 'Q') {
                event.preventDefault();
                closeTerminal(terminal);
                return;
            }
        });
        
        registerEventListener(weatherInput, 'keypress', async (event) => {
            if (event.key === 'Enter') {
                const location = weatherInput.value.trim();
                
                if (location.toLowerCase() === 'q') {
                    // Quit the weather app - close the terminal window
                    closeTerminal(terminal);
                    return;
                    
                } else if (location === '') {
                    // Empty enter - restart weather app
                    const inputLine = weatherInput.parentElement;
                    inputLine.innerHTML = '';
                    
                    // Start weather app again from this point
                    setTimeout(() => {
                        const promptLine = document.createElement('div');
                        promptLine.className = 'xterm-line';
                        promptLine.innerHTML = 'Enter Location for Weather Forecast (Enter to Continue): ';
                        content.appendChild(promptLine);
                        
                        // Create input for weather location
                        const restartInputLine = document.createElement('div');
                        restartInputLine.className = 'xterm-line';
                        const newInputId = `weatherInput${terminal.dataset.terminalId}_${Date.now()}`;
                        restartInputLine.innerHTML = `<input type="text" id="${newInputId}" class="xterm-weather-input" style="background: transparent; border: none; color: #00ff00; outline: none; font-family: 'Courier New', monospace; font-size: 14px; width: 300px;" placeholder="Enter city name or 'q' to quit..." maxlength="50">`;
                        content.appendChild(restartInputLine);
                        
                        // Set up weather input handling with the new input id
                        setupWeatherRestartInput(terminal, newInputId);
                        
                        // Show cursor after input
                        showCursorInTerminal(terminal);
                        
                        // Focus the input
                        setTimeout(() => {
                            const weatherInput = document.getElementById(newInputId);
                            if (weatherInput) {
                                weatherInput.focus();
                            }
                        }, 100);
                        
                        // Scroll to bottom
                        content.scrollTop = content.scrollHeight;
                        
                    }, 500);
                    
                } else if (location) {
                    // New weather search
                    const inputLine = weatherInput.parentElement;
                    inputLine.innerHTML = location;
                    
                    // Show loading
                    const loadingLine = document.createElement('div');
                    loadingLine.className = 'xterm-line';
                    loadingLine.innerHTML = 'Connecting to weather service...';
                    content.appendChild(loadingLine);
                    
                    try {
                        // Use the existing weather API function
                        const weatherData = await fetchWeatherData(location);
                        
                        if (weatherData) {
                            // Remove loading line
                            loadingLine.remove();
                            
                            // Create weather ticker display
                            createWeatherNcursesDisplay(terminal, weatherData);
                        } else {
                            loadingLine.innerHTML = 'ERROR: Location not found';
                            
                            // Add restart prompt after error
                            setTimeout(() => {
                                setupWeatherRestartPrompt(terminal, content);
                            }, 2000);
                        }
                    } catch (error) {
                        loadingLine.innerHTML = `ERROR: ${error.message}`;
                        
                        // Add restart prompt after error
                        setTimeout(() => {
                            setupWeatherRestartPrompt(terminal, content);
                        }, 2000);
                    }
                }
            }
        });
    }
}

/**
 * Setup weather restart prompt (helper function)
 */
function setupWeatherRestartPrompt(terminal, content) {
    const restartPromptLine = document.createElement('div');
    restartPromptLine.className = 'xterm-line';
    restartPromptLine.innerHTML = 'Enter Location for Weather Forecast (Enter to Continue or Q to Quit): ';
    content.appendChild(restartPromptLine);
    
    // Create new input for restart
    const restartInputLine = document.createElement('div');
    restartInputLine.className = 'xterm-line';
    const newInputId = `weatherRestartInput${terminal.dataset.terminalId}_${Date.now()}`;
    restartInputLine.innerHTML = `<input type="text" id="${newInputId}" class="xterm-weather-input" style="background: transparent; border: none; color: #00ff00; outline: none; font-family: 'Courier New', monospace; font-size: 14px; width: 300px;" placeholder="Enter city name or 'q' to quit..." maxlength="50">`;
    content.appendChild(restartInputLine);
    
    // Set up new weather input handling
    setupWeatherRestartInput(terminal, newInputId);
    
    // Focus the new input
    setTimeout(() => {
        const newWeatherInput = document.getElementById(newInputId);
        if (newWeatherInput) {
            newWeatherInput.focus();
        }
    }, 100);
    
    // Scroll to bottom
    content.scrollTop = content.scrollHeight;
}

/**
 * Start original clocker updates for a terminal with centering and timezone controls
 */
function startOriginalClockerUpdate(terminalId, terminal) {
    // Initialize timezone index to local time (find it in the timezones array)
    if (terminal.timezoneIndex === undefined) {
        terminal.timezoneIndex = findLocalTimezoneIndex();
    }
    
    const updateOriginalClocker = () => {
        const clockerDisplay = document.getElementById(`xtermClocker${terminalId}`);
        const timezoneDisplay = document.getElementById(`xtermTimezone${terminalId}`);
        if (!clockerDisplay || !timezoneDisplay) return;
        
        // Get current timezone
        const currentTimezone = timezones[terminal.timezoneIndex] || timezones[0];
        
        // Calculate time in the selected timezone
        const now = getTimezoneDateTime(currentTimezone);
        
        // Format day name (original: daystr=$(date +'%A'))
        const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });
        
        // Format date with ordinal suffix (original uses sed regex)
        const monthName = now.toLocaleDateString('en-US', { month: 'short' });
        const dayNum = now.getDate();
        const year = now.getFullYear();
        
        // Original clocker ordinal suffix logic (with bugs reproduced)
        let ordinalSuffix;
        if (dayNum === 11 || dayNum === 12 || dayNum === 13) {
            ordinalSuffix = 'th';
        } else if (dayNum.toString().endsWith('1')) {
            ordinalSuffix = 'st';
        } else if (dayNum.toString().endsWith('2')) {
            ordinalSuffix = 'nd';
        } else if (dayNum.toString().endsWith('3')) {
            ordinalSuffix = 'rd';
        } else {
            ordinalSuffix = 'th';
        }
        
        const dateStr = `${monthName}. ${dayNum}${ordinalSuffix}, ${year}`;
        
        // Format time with timezone abbreviation
        const timeStr = formatTimeForTimezone(now, currentTimezone);
        
        // Update clocker display
        clockerDisplay.innerHTML = `
            <div class="xterm-clocker-day" style="margin-bottom: 4px; color: #ffff00; font-size: 22px; font-weight: bold;">${dayStr}</div>
            <div class="xterm-clocker-date" style="margin-bottom: 4px; color: #00ffff; font-size: 16px;">${dateStr}</div>
            <div class="xterm-clocker-time" style="margin-bottom: 8px; color: #00ff00; font-size: 18px;">${timeStr}</div>
        `;
        
        // Update timezone controls display
        const gmtOffset = getCurrentTimezoneOffset(currentTimezone);
        timezoneDisplay.innerHTML = `
            <div style="color: #ffff00; font-size: 16px; font-weight: bold; background: rgba(0, 0, 0, 0.5); padding: 2px 8px; border-radius: 3px;">◀◀ ${currentTimezone.abbreviation} ${gmtOffset} ▶▶</div>
            <div style="color: #00ffff; font-size: 12px; margin-top: 2px; background: rgba(0, 0, 0, 0.3); padding: 1px 4px; border-radius: 2px;">${getTimezoneDisplayName(currentTimezone)}</div>
        `;
    };
    
    // Set up resize handler to recenter on window resize
    const handleResize = () => {
        const clockerDisplay = document.getElementById(`xtermClocker${terminalId}`);
        if (clockerDisplay) {
            // Force recenter by triggering a redraw
            updateOriginalClocker();
        }
    };
    
    // Use ResizeObserver to detect terminal resize
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(terminal);
        // Store for cleanup
        terminal.clockerResizeObserver = resizeObserver;
    }
    
    // Set up keyboard event handling for timezone navigation and quit
    const handleTimezoneKeydown = (event) => {
        // Only handle keys when this clocker terminal is focused
        if (!terminal.classList.contains('focused')) return;
        
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            // Move west (earlier timezone, lower index)
            terminal.timezoneIndex = (terminal.timezoneIndex - 1 + timezones.length) % timezones.length;
            updateOriginalClocker(); // Immediate update
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            // Move east (later timezone, higher index)
            terminal.timezoneIndex = (terminal.timezoneIndex + 1) % timezones.length;
            updateOriginalClocker(); // Immediate update
        } else if (event.key === 'q' || event.key === 'Q') {
            event.preventDefault();
            // Quit clocker - close the terminal window
            closeTerminal(terminal);
        }
    };
    
    // Register keyboard event listener for cleanup
    registerEventListener(document, 'keydown', handleTimezoneKeydown);
    
    // Make terminal focusable to capture keyboard events
    terminal.tabIndex = -1;
    
    updateOriginalClocker(); // Initial update
    const intervalId = setInterval(updateOriginalClocker, 1000);
    linuxIntervals.push(intervalId);
    registerInterval(intervalId);
    
    // Store interval on terminal for quit functionality
    terminal.clockerUpdateInterval = intervalId;
}

/**
 * Handle clocker quit functionality - match original clocker script behavior
 */
function handleClockerQuit(terminal) {
    const content = terminal.querySelector('.xterm-content');
    if (!content) return;
    
    // Stop the clocker update interval
    const terminalId = terminal.dataset.terminalId;
    if (terminal.clockerUpdateInterval) {
        clearInterval(terminal.clockerUpdateInterval);
        terminal.clockerUpdateInterval = null;
    }
    
    // Get current timezone for exit message
    const currentTimezone = timezones[terminal.timezoneIndex] || timezones[0];
    const now = getTimezoneDateTime(currentTimezone);
    
    // Format the exit message exactly like the original clocker script
    const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = now.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = now.getDate();
    const year = now.getFullYear();
    
    // Add ordinal suffix (matching original clocker logic)
    let ordinalSuffix;
    if (dayNum >= 11 && dayNum <= 13) {
        ordinalSuffix = 'th';
    } else {
        switch (dayNum % 10) {
            case 1: ordinalSuffix = 'st'; break;
            case 2: ordinalSuffix = 'nd'; break;
            case 3: ordinalSuffix = 'rd'; break;
            default: ordinalSuffix = 'th'; break;
        }
    }
    
    const dateStr = `${monthName}. ${dayNum}${ordinalSuffix}, ${year}`;
    const timeStr = formatTimeForTimezone(now, currentTimezone);
    
    // Clear all clocker interface elements
    const clockerDisplay = document.getElementById(`xtermClocker${terminalId}`);
    const timezoneDisplay = document.getElementById(`xtermTimezone${terminalId}`);
    const statusDisplay = document.getElementById(`xtermStatus${terminalId}`);
    
    if (clockerDisplay) clockerDisplay.remove();
    if (timezoneDisplay) timezoneDisplay.remove();
    if (statusDisplay) statusDisplay.remove();
    
    // Show "q" being typed
    const quitCommandLine = document.createElement('div');
    quitCommandLine.className = 'xterm-line';
    quitCommandLine.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ ./clocker<br>q`;
    content.appendChild(quitCommandLine);
    
    // Show the exit message exactly like the original clocker script
    const exitLine = document.createElement('div');
    exitLine.className = 'xterm-line';
    exitLine.style.cssText = `
        color: #00ff00;
        margin-top: 5px;
    `;
    exitLine.innerHTML = `<br>Quit at ${timeStr} on ${dayStr}, ${dateStr}.`;
    content.appendChild(exitLine);
    
    // Add command prompt with blinking cursor
    const promptLine = document.createElement('div');
    promptLine.className = 'xterm-line';
    promptLine.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ `;
    content.appendChild(promptLine);
    
    // Add blinking cursor to the prompt
    const cursor = document.createElement('span');
    cursor.className = 'xterm-cursor-vertical';
    cursor.style.cssText = 'background: transparent !important; color: #00ff00 !important; border-right: 2px solid #00ff00; animation: xterm-cursor-blink 1s infinite; font-weight: normal; width: 0; display: inline-block;';
    promptLine.appendChild(cursor);
    
    // Set up keyboard handler for new commands
    setupTerminalCommandInput(terminal, promptLine);
}

/**
 * Set up terminal command input handling for the prompt after app quit
 */
function setupTerminalCommandInput(terminal, promptLine, appType = 'clocker') {
    // Initialize command history for this terminal
    if (!terminal.commandHistory) {
        terminal.commandHistory = [];
        terminal.historyIndex = -1;
    }
    
    // Determine the last command based on app type
    const lastCommand = appType === 'weather' ? './weather' : './clocker';
    
    const handleCommandInput = (event) => {
        // Only handle keys when this terminal is focused
        if (!terminal.classList.contains('focused')) return;
        
        // Handle all key types including arrow keys
        if (event.key.length === 1 || event.key === 'Enter' || event.key === 'Backspace' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault();
            
            const currentText = promptLine.textContent.replace(/.*\$ /, '');
            
            if (event.key === 'Enter') {
                const command = currentText.trim();
                
                // Remove cursor
                const cursor = promptLine.querySelector('.xterm-cursor-vertical');
                if (cursor) cursor.remove();
                
                // Handle command execution
                if (command === './clocker' || (command === '' && appType === 'clocker')) {
                    // Add command to history
                    if (command && !terminal.commandHistory.includes(command)) {
                        terminal.commandHistory.push(command);
                    }
                    // Restart clocker application
                    setTimeout(() => {
                        const content = terminal.querySelector('.xterm-content');
                        content.innerHTML = '';
                        recreateClockerInterface(terminal);
                    }, 100);
                    return;
                } else if (command === './weather' || (command === '' && appType === 'weather')) {
                    // Add command to history
                    if (command && !terminal.commandHistory.includes(command)) {
                        terminal.commandHistory.push(command);
                    }
                    // Restart weather application
                    setTimeout(() => {
                        const content = terminal.querySelector('.xterm-content');
                        content.innerHTML = '';
                        recreateWeatherInterface(terminal);
                    }, 100);
                    return;
                } else if (command === '!!') {
                    // Repeat last command (!! behavior)
                    if (terminal.commandHistory.length > 0) {
                        const lastCmd = terminal.commandHistory[terminal.commandHistory.length - 1];
                        // Show the expanded command
                        promptLine.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ ${lastCmd}`;
                        
                        // Execute the last command
                        if (lastCmd === './clocker') {
                            setTimeout(() => {
                                const content = terminal.querySelector('.xterm-content');
                                content.innerHTML = '';
                                recreateClockerInterface(terminal);
                            }, 100);
                            return;
                        } else if (lastCmd === './weather') {
                            setTimeout(() => {
                                const content = terminal.querySelector('.xterm-content');
                                content.innerHTML = '';
                                recreateWeatherInterface(terminal);
                            }, 100);
                            return;
                        }
                    } else {
                        // No command history
                        const errorLine = document.createElement('div');
                        errorLine.className = 'xterm-line';
                        errorLine.style.color = '#ff4444';
                        errorLine.textContent = 'bash: !!: event not found';
                        terminal.querySelector('.xterm-content').appendChild(errorLine);
                    }
                } else if (command) {
                    // Show command not found
                    const errorLine = document.createElement('div');
                    errorLine.className = 'xterm-line';
                    errorLine.style.color = '#ff4444';
                    errorLine.textContent = `bash: ${command}: command not found`;
                    terminal.querySelector('.xterm-content').appendChild(errorLine);
                }
                
                // Add new prompt line
                const newPromptLine = document.createElement('div');
                newPromptLine.className = 'xterm-line';
                newPromptLine.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ `;
                terminal.querySelector('.xterm-content').appendChild(newPromptLine);
                
                // Add cursor to new prompt
                const newCursor = document.createElement('span');
                newCursor.className = 'xterm-cursor-vertical';
                newCursor.style.cssText = 'background: transparent !important; color: #00ff00 !important; border-right: 2px solid #00ff00; animation: xterm-cursor-blink 1s infinite; font-weight: normal; width: 0; display: inline-block;';
                newPromptLine.appendChild(newCursor);
                
                // Set up handler for new prompt
                setupTerminalCommandInput(terminal, newPromptLine, appType);
                
            } else if (event.key === 'ArrowUp') {
                // Navigate up in command history
                if (terminal.commandHistory.length > 0) {
                    if (terminal.historyIndex === -1) {
                        terminal.historyIndex = terminal.commandHistory.length - 1;
                    } else if (terminal.historyIndex > 0) {
                        terminal.historyIndex--;
                    }
                    const historicalCommand = terminal.commandHistory[terminal.historyIndex] || lastCommand;
                    promptLine.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ ${historicalCommand}`;
                    
                    // Re-add cursor
                    const cursor = document.createElement('span');
                    cursor.className = 'xterm-cursor-vertical';
                    cursor.style.cssText = 'background: transparent !important; color: #00ff00 !important; border-right: 2px solid #00ff00; animation: xterm-cursor-blink 1s infinite; font-weight: normal; width: 0; display: inline-block;';
                    promptLine.appendChild(cursor);
                } else {
                    // No history, show the last command for this app type
                    promptLine.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ ${lastCommand}`;
                    
                    // Re-add cursor
                    const cursor = document.createElement('span');
                    cursor.className = 'xterm-cursor-vertical';
                    cursor.style.cssText = 'background: transparent !important; color: #00ff00 !important; border-right: 2px solid #00ff00; animation: xterm-cursor-blink 1s infinite; font-weight: normal; width: 0; display: inline-block;';
                    promptLine.appendChild(cursor);
                }
            } else if (event.key === 'ArrowDown') {
                // Navigate down in command history
                if (terminal.historyIndex !== -1) {
                    terminal.historyIndex++;
                    if (terminal.historyIndex >= terminal.commandHistory.length) {
                        terminal.historyIndex = -1;
                        // Clear command line
                        promptLine.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ `;
                    } else {
                        const historicalCommand = terminal.commandHistory[terminal.historyIndex];
                        promptLine.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ ${historicalCommand}`;
                    }
                    
                    // Re-add cursor
                    const cursor = document.createElement('span');
                    cursor.className = 'xterm-cursor-vertical';
                    cursor.style.cssText = 'background: transparent !important; color: #00ff00 !important; border-right: 2px solid #00ff00; animation: xterm-cursor-blink 1s infinite; font-weight: normal; width: 0; display: inline-block;';
                    promptLine.appendChild(cursor);
                }
            } else if (event.key === 'Backspace') {
                // Reset history navigation
                terminal.historyIndex = -1;
                
                // Remove last character
                if (currentText.length > 0) {
                    const newText = currentText.slice(0, -1);
                    promptLine.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ ${newText}`;
                    
                    // Re-add cursor
                    const cursor = document.createElement('span');
                    cursor.className = 'xterm-cursor-vertical';
                    cursor.style.cssText = 'background: transparent !important; color: #00ff00 !important; border-right: 2px solid #00ff00; animation: xterm-cursor-blink 1s infinite; font-weight: normal; width: 0; display: inline-block;';
                    promptLine.appendChild(cursor);
                }
            } else if (event.key.length === 1) {
                // Reset history navigation when typing
                terminal.historyIndex = -1;
                
                // Add character
                const newText = currentText + event.key;
                promptLine.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ ${newText}`;
                
                // Re-add cursor
                const cursor = document.createElement('span');
                cursor.className = 'xterm-cursor-vertical';
                cursor.style.cssText = 'background: transparent !important; color: #00ff00 !important; border-right: 2px solid #00ff00; animation: xterm-cursor-blink 1s infinite; font-weight: normal; width: 0; display: inline-block;';
                promptLine.appendChild(cursor);
            }
        }
    };
    
    // Register the event listener
    registerEventListener(document, 'keydown', handleCommandInput);
}

/**
 * Recreate the weather interface after restart
 */
function recreateWeatherInterface(terminal) {
    const terminalId = terminal.dataset.terminalId;
    const content = terminal.querySelector('.xterm-content');
    
    // Create initial weather prompt
    const initialPrompt = document.createElement('div');
    initialPrompt.className = 'xterm-line';
    initialPrompt.innerHTML = `<span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ ./weather`;
    content.appendChild(initialPrompt);
    
    // Start the weather application simulation
    setTimeout(() => {
        // Create weather interface
        const weatherInterface = document.createElement('div');
        weatherInterface.className = 'xterm-line';
        weatherInterface.style.cssText = `
            border: 1px solid #00ff00;
            padding: 4px;
            margin: 4px 0;
        `;
        
        const weatherTitle = document.createElement('div');
        weatherTitle.style.cssText = `
            background: #00ff00;
            color: #000000;
            padding: 2px;
            text-align: center;
            font-weight: bold;
        `;
        weatherTitle.textContent = 'Weather Data Interface';
        weatherInterface.appendChild(weatherTitle);
        
        // Create weather input
        const inputLine = document.createElement('div');
        inputLine.className = 'xterm-line';
        const inputId = `weatherInput${terminalId}_${Date.now()}`;
        inputLine.innerHTML = `<input type="text" id="${inputId}" class="xterm-weather-input" style="background: transparent; border: none; color: #00ff00; outline: none; font-family: 'Courier New', monospace; font-size: 14px; width: 300px;" placeholder="Enter city name or 'q' to quit..." maxlength="50">`;
        weatherInterface.appendChild(inputLine);
        
        content.appendChild(weatherInterface);
        
        // Set up weather input handling
        setupWeatherInput(terminal, inputId);
        
        // Focus the input
        setTimeout(() => {
            const weatherInput = document.getElementById(inputId);
            if (weatherInput) {
                weatherInput.focus();
            }
        }, 100);
    }, 500);
}

/**
 * Recreate the clocker interface after restart
 */
function recreateClockerInterface(terminal) {
    const terminalId = terminal.dataset.terminalId;
    const content = terminal.querySelector('.xterm-content');
    
    // Reset to user's local timezone when restarting
    terminal.timezoneIndex = findLocalTimezoneIndex();
    
    // Create the centered clocker display area
    const clockerDiv = document.createElement('div');
    clockerDiv.id = `xtermClocker${terminalId}`;
    clockerDiv.className = 'xterm-clocker';
    clockerDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        font-family: 'Courier New', 'DejaVu Sans Mono', monospace;
        pointer-events: none;
    `;
    content.appendChild(clockerDiv);
    
    // Recreate timezone controls
    const timezoneDiv = document.createElement('div');
    timezoneDiv.id = `xtermTimezone${terminalId}`;
    timezoneDiv.className = 'xterm-clocker-timezone';
    timezoneDiv.style.cssText = `
        position: absolute;
        bottom: 25px;
        left: 0;
        width: 100%;
        height: 60px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-family: 'Courier New', 'DejaVu Sans Mono', monospace;
        background: rgba(0, 0, 0, 0.1);
        border-top: 1px solid #00ff00;
        pointer-events: none;
    `;
    content.appendChild(timezoneDiv);
    
    // Recreate status bar
    const statusDiv = document.createElement('div');
    statusDiv.id = `xtermStatus${terminalId}`;
    statusDiv.className = 'xterm-clocker-status';
    statusDiv.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 25px;
        background: #00ff00;
        color: #000000;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-family: 'Courier New', 'DejaVu Sans Mono', monospace;
        font-size: 12px;
        font-weight: bold;
        border-top: 1px solid #008800;
        pointer-events: none;
    `;
    statusDiv.innerHTML = 'Left/Right Arrow Key to change timezone, Q to Quit';
    content.appendChild(statusDiv);
    
    // Restart the clocker functionality
    startOriginalClockerUpdate(terminalId, terminal);
}

/**
 * Set up clocker restart input handling
 */
function setupClockerRestartInput(terminal, inputId) {
    const restartInput = document.getElementById(inputId);
    if (!restartInput) return;
    
    registerEventListener(restartInput, 'keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            
            // Clear the content area completely
            const content = terminal.querySelector('.xterm-content');
            if (content) {
                content.innerHTML = '';
                
                // Recreate the original clocker structure
                const terminalId = terminal.dataset.terminalId;
                
                // Create the centered clocker display area
                const clockerDiv = document.createElement('div');
                clockerDiv.id = `xtermClocker${terminalId}`;
                clockerDiv.className = 'xterm-clocker';
                clockerDiv.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    font-family: 'Courier New', 'DejaVu Sans Mono', monospace;
                    pointer-events: none;
                `;
                content.appendChild(clockerDiv);
                
                // Recreate timezone controls
                const timezoneDiv = document.createElement('div');
                timezoneDiv.id = `xtermTimezone${terminalId}`;
                timezoneDiv.className = 'xterm-clocker-timezone';
                timezoneDiv.style.cssText = `
                    position: absolute;
                    bottom: 25px;
                    left: 0;
                    width: 100%;
                    height: 60px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-family: 'Courier New', 'DejaVu Sans Mono', monospace;
                    background: rgba(0, 0, 0, 0.1);
                    border-top: 1px solid #00ff00;
                    pointer-events: none;
                `;
                content.appendChild(timezoneDiv);
                
                // Recreate status bar
                const statusDiv = document.createElement('div');
                statusDiv.id = `xtermStatus${terminalId}`;
                statusDiv.className = 'xterm-clocker-status';
                statusDiv.style.cssText = `
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 25px;
                    background: #00ff00;
                    color: #000000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    font-family: 'Courier New', 'DejaVu Sans Mono', monospace;
                    font-size: 12px;
                    font-weight: bold;
                    border-top: 1px solid #008800;
                    pointer-events: none;
                `;
                statusDiv.innerHTML = 'Left/Right Arrow Key to change timezone, Q to Quit';
                content.appendChild(statusDiv);
                
                // Restart the clocker functionality
                startOriginalClockerUpdate(terminalId, terminal);
            }
        }
    });
}

/**
 * Find the local timezone index in the timezones array
 */
function findLocalTimezoneIndex() {
    const now = new Date();
    const localOffset = -(now.getTimezoneOffset() / 60);
    const localOffsetStr = `UTC${localOffset >= 0 ? '+' : ''}${localOffset}:00`;
    
    // Get browser's timezone identifier if available
    let browserTimezone = null;
    try {
        browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
    }
    
    // First try to match by browser timezone name
    if (browserTimezone) {
        const browserMatch = findTimezoneByBrowserName(browserTimezone);
        if (browserMatch !== -1) {
            return browserMatch;
        }
    }
    
    // Try to match by current offset, considering DST
    let bestMatch = -1;
    
    for (let i = 0; i < timezones.length; i++) {
        const tz = timezones[i];
        
        // Check standard time offset
        if (tz.offset === localOffsetStr) {
            bestMatch = i;
            
            // If this timezone doesn't observe DST, it's a perfect match
            if (!tz.daylightSaving || !tz.daylightSaving.observesDST) {
                break;
            }
            
            // If it observes DST, check if we're currently in standard time
            const isCurrentlyDST = isDaylightSavingTime(now, tz);
            if (!isCurrentlyDST) {
                // We're in standard time and offsets match - perfect!
                break;
            }
        }
        
        // Check DST offset if timezone observes DST
        if (tz.daylightSaving && tz.daylightSaving.observesDST && tz.daylightSaving.dstOffset === localOffsetStr) {
            const isCurrentlyDST = isDaylightSavingTime(now, tz);
            if (isCurrentlyDST) {
                // We're in DST and offsets match - perfect!
                bestMatch = i;
                break;
            }
        }
    }
    
    if (bestMatch !== -1) {
        return bestMatch;
    }
    
    // Fallback: try common US timezones based on offset
    const fallbackMatch = getFallbackTimezoneByOffset(localOffset);
    if (fallbackMatch !== -1) {
        return fallbackMatch;
    }
    
    // Last resort: default to first timezone
    return 0;
}

/**
 * Try to find timezone by browser timezone identifier
 */
function findTimezoneByBrowserName(browserTimezone) {
    // Common browser timezone to timezone array mappings
    const timezoneMap = {
        'America/New_York': ['Eastern Standard Time', 'Eastern Daylight Time'],
        'America/Chicago': ['Central Standard Time', 'Central Daylight Time'],
        'America/Denver': ['Mountain Standard Time', 'Mountain Daylight Time'],
        'America/Los_Angeles': ['Pacific Standard Time', 'Pacific Daylight Time'],
        'America/Phoenix': ['Mountain Standard Time'], // Arizona doesn't observe DST
        'Pacific/Honolulu': ['Hawaii-Aleutian Standard Time'],
        'America/Anchorage': ['Alaska Standard Time', 'Alaska Daylight Time'],
        'Atlantic/Puerto_Rico': ['Atlantic Standard Time'],
        'America/Halifax': ['Atlantic Standard Time', 'Atlantic Daylight Time'],
        'America/St_Johns': ['Newfoundland Standard Time', 'Newfoundland Daylight Time']
    };
    
    const possibleNames = timezoneMap[browserTimezone];
    if (possibleNames) {
        for (const name of possibleNames) {
            const index = timezones.findIndex(tz => tz.name === name);
            if (index !== -1) {
                return index;
            }
        }
    }
    
    return -1;
}

/**
 * Get fallback timezone by offset for common US timezones
 */
function getFallbackTimezoneByOffset(offsetHours) {
    const fallbackMap = {
        '-12': 'Baker Island Time',
        '-11': 'Samoa Standard Time', 
        '-10': 'Hawaii-Aleutian Standard Time',
        '-9': 'Alaska Standard Time',
        '-8': 'Pacific Standard Time',
        '-7': 'Mountain Standard Time',
        '-6': 'Central Standard Time',
        '-5': 'Eastern Standard Time',
        '-4': 'Atlantic Standard Time',
        '-3.5': 'Newfoundland Standard Time'
    };
    
    const timezoneName = fallbackMap[offsetHours.toString()];
    if (timezoneName) {
        const index = timezones.findIndex(tz => tz.name === timezoneName);
        return index !== -1 ? index : -1;
    }
    
    return -1;
}

/**
 * Get current timezone offset with DST awareness
 */
function getCurrentTimezoneOffset(timezone) {
    const now = new Date();
    let offset = timezone.offset;
    
    // Check if timezone observes DST and if we're currently in DST period
    if (timezone.daylightSaving && timezone.daylightSaving.observesDST) {
        const isDST = isDaylightSavingTime(now, timezone);
        if (isDST && timezone.daylightSaving.dstOffset) {
            offset = timezone.daylightSaving.dstOffset;
        }
    }
    
    return offset;
}

/**
 * Get timezone display name with DST awareness
 */
function getTimezoneDisplayName(timezone) {
    const now = new Date();
    let displayName = timezone.name;
    
    // Check if timezone observes DST and if we're currently in DST period
    if (timezone.daylightSaving && timezone.daylightSaving.observesDST) {
        const isDST = isDaylightSavingTime(now, timezone);
        if (isDST) {
            // Simple replacement to convert Standard to Daylight (matches Matrix theme approach)
            if (displayName.includes('Standard')) {
                displayName = displayName.replace('Standard', 'Daylight');
            }
        }
    }
    
    return displayName;
}

/**
 * Get current date/time adjusted for a specific timezone
 */
function getTimezoneDateTime(timezone) {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    
    // Parse timezone offset (e.g., "UTC-05:00" -> -5)
    let offsetHours = 0;
    const offsetMatch = timezone.offset.match(/UTC([+-])(\d+):(\d+)/);
    if (offsetMatch) {
        const sign = offsetMatch[1] === '+' ? 1 : -1;
        offsetHours = sign * (parseInt(offsetMatch[2]) + parseInt(offsetMatch[3]) / 60);
    }
    
    // Check if DST is active and adjust offset
    const standardDate = new Date(utc + (offsetHours * 3600000));
    if (timezone.daylightSaving && timezone.daylightSaving.observesDST) {
        const isDST = isDaylightSavingTime(standardDate, timezone);
        if (isDST && timezone.daylightSaving.dstOffset) {
            // Parse DST offset
            const dstOffsetMatch = timezone.daylightSaving.dstOffset.match(/UTC([+-])(\d+):(\d+)/);
            if (dstOffsetMatch) {
                const dstSign = dstOffsetMatch[1] === '+' ? 1 : -1;
                offsetHours = dstSign * (parseInt(dstOffsetMatch[2]) + parseInt(dstOffsetMatch[3]) / 60);
            }
        }
    }
    
    return new Date(utc + (offsetHours * 3600000));
}

/**
 * Format time for a specific timezone with DST support
 */
function formatTimeForTimezone(date, timezone) {
    // Get current abbreviation (DST-aware)
    const now = new Date();
    let currentAbbreviation = timezone.abbreviation;
    
    // Check if timezone observes DST and if we're currently in DST period
    if (timezone.daylightSaving && timezone.daylightSaving.observesDST) {
        const isDST = isDaylightSavingTime(now, timezone);
        if (isDST && timezone.daylightSaving.dstAbbreviation) {
            currentAbbreviation = timezone.daylightSaving.dstAbbreviation;
        }
    }
    
    // Format time in 12-hour format with seconds and timezone abbreviation
    const timeStr = date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true
    });
    
    return `${timeStr} ${currentAbbreviation}`;
}

/**
 * Check if a date falls within daylight saving time for a given timezone
 */
function isDaylightSavingTime(date, timezone) {
    if (!timezone.daylightSaving || !timezone.daylightSaving.observesDST) {
        return false;
    }
    
    // Use a more accurate DST detection by comparing standard time vs DST offsets
    // Create two dates to test: one that should be in standard time (January)
    // and one that should be in DST (July) using the browser's local timezone
    const year = date.getFullYear();
    const winterDate = new Date(year, 0, 1); // January 1st
    const summerDate = new Date(year, 6, 1); // July 1st
    
    const winterOffset = winterDate.getTimezoneOffset();
    const summerOffset = summerDate.getTimezoneOffset();
    const currentOffset = date.getTimezoneOffset();
    
    // If winter and summer offsets are different, DST is observed
    if (winterOffset !== summerOffset) {
        // DST is active when offset is smaller (because getTimezoneOffset returns negative values for positive UTC offsets)
        const dstOffset = Math.min(winterOffset, summerOffset);
        return currentOffset === dstOffset;
    }
    
    // Fallback to simplified US DST rules for US timezones
    if (timezone.name.includes('Standard Time') || timezone.abbreviation.match(/^[EPCMHA]ST$/)) {
        const month = date.getMonth(); // 0-based
        const dayOfMonth = date.getDate();
        
        // DST runs from second Sunday in March to first Sunday in November
        if (month > 2 && month < 10) { // April through September
            return true;
        } else if (month === 2) { // March
            // Second Sunday in March (simplified: assume after 8th)
            return dayOfMonth >= 8;
        } else if (month === 10) { // November  
            // First Sunday in November (simplified: assume before 8th)
            return dayOfMonth <= 7;
        }
    }
    
    return false;
}

/**
 * Start clocker updates for a terminal (deprecated - keeping for compatibility)
 */
function startClockerUpdate(terminalId) {
    const updateClocker = () => {
        const clockerDisplay = document.getElementById(`xtermClocker${terminalId}`);
        if (!clockerDisplay) return;
        
        const now = getTimezoneDate();
        const formatted = formatDate(now);
        const timeStr = formatTimeForPopup(now); // Use plain text version
        
        clockerDisplay.innerHTML = `
            <div class="xterm-clocker-day">${formatted.day}</div>
            <div class="xterm-clocker-date">${formatted.date}</div>
            <div class="xterm-clocker-time">${timeStr}</div>
        `;
    };
    
    updateClocker(); // Initial update
    const intervalId = setInterval(updateClocker, 1000);
    linuxIntervals.push(intervalId);
    registerInterval(intervalId);
}

/**
 * Create a draggable and resizable terminal window
 */
function createDraggableTerminal(id, type, x, y, width, height) {
    const terminal = document.createElement('div');
    terminal.className = `linux-terminal linux-terminal-${id}`;
    terminal.style.left = `${x}px`;
    terminal.style.top = `${y}px`;
    terminal.style.width = `${width}px`;
    terminal.style.height = `${height}px`;
    terminal.dataset.terminalId = id;
    
    terminal.innerHTML = `
        <div class="xterm-titlebar">
            <span>Terminal - ${linuxUsername}@${linuxHostname}: ${type}</span>
            <div class="xterm-titlebar-buttons">
                <div class="xterm-titlebar-button">-</div>
                <div class="xterm-titlebar-button">□</div>
                <div class="xterm-titlebar-button close-button">×</div>
            </div>
        </div>
        <div class="xterm-content" id="xtermContent${id}">
            <div class="xterm-line"><span class="xterm-prompt">${linuxUsername}@${linuxHostname}</span>:<span class="xterm-path">~</span>$ </div>
        </div>
        ${createResizeHandles()}
    `;
    
    // Add drag and resize event listeners
    setupWindowDragging(terminal);
    setupWindowResizing(terminal);
    setupWindowFocus(terminal);
    setupCloseButton(terminal);
    
    return terminal;
}

/**
 * Create resize handles HTML
 */
function createResizeHandles() {
    return `
        <div class="xterm-resize-handle corner nw"></div>
        <div class="xterm-resize-handle corner ne"></div>
        <div class="xterm-resize-handle corner sw"></div>
        <div class="xterm-resize-handle corner se"></div>
        <div class="xterm-resize-handle edge-horizontal n"></div>
        <div class="xterm-resize-handle edge-horizontal s"></div>
        <div class="xterm-resize-handle edge-vertical w"></div>
        <div class="xterm-resize-handle edge-vertical e"></div>
    `;
}

/**
 * Setup window dragging functionality
 */
function setupWindowDragging(terminal) {
    const titlebar = terminal.querySelector('.xterm-titlebar');
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    const startDrag = (e) => {
        // Don't drag if clicking on buttons
        if (e.target.classList.contains('xterm-titlebar-button')) return;
        
        isDragging = true;
        terminal.classList.add('dragging');
        bringToFront(terminal);
        
        const rect = terminal.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        e.preventDefault();
    };
    
    const doDrag = (e) => {
        if (!isDragging) return;
        
        const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - dragOffset.y));
        
        terminal.style.left = `${newX}px`;
        terminal.style.top = `${newY}px`;
        
        e.preventDefault();
    };
    
    const stopDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        terminal.classList.remove('dragging');
    };
    
    // Register event listeners for cleanup
    registerEventListener(titlebar, 'mousedown', startDrag);
    registerEventListener(document, 'mousemove', doDrag);
    registerEventListener(document, 'mouseup', stopDrag);
}

/**
 * Setup window resizing functionality
 */
function setupWindowResizing(terminal) {
    const handles = terminal.querySelectorAll('.xterm-resize-handle');
    let isResizing = false;
    let resizeData = null;
    
    handles.forEach(handle => {
        const startResize = (e) => {
            isResizing = true;
            terminal.classList.add('resizing');
            bringToFront(terminal);
            
            const rect = terminal.getBoundingClientRect();
            const handleType = handle.className.split(' ').find(c => ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'].includes(c));
            
            resizeData = {
                startX: e.clientX,
                startY: e.clientY,
                startWidth: rect.width,
                startHeight: rect.height,
                startLeft: rect.left,
                startTop: rect.top,
                handleType: handleType
            };
            
            e.preventDefault();
            e.stopPropagation();
        };
        
        const doResize = (e) => {
            if (!isResizing || !resizeData) return;
            
            const deltaX = e.clientX - resizeData.startX;
            const deltaY = e.clientY - resizeData.startY;
            const minWidth = 300;
            const minHeight = 150;
            
            let newWidth = resizeData.startWidth;
            let newHeight = resizeData.startHeight;
            let newLeft = resizeData.startLeft;
            let newTop = resizeData.startTop;
            
            // Handle different resize directions
            switch (resizeData.handleType) {
                case 'se': // Southeast
                    newWidth = Math.max(minWidth, resizeData.startWidth + deltaX);
                    newHeight = Math.max(minHeight, resizeData.startHeight + deltaY);
                    break;
                case 'sw': // Southwest
                    newWidth = Math.max(minWidth, resizeData.startWidth - deltaX);
                    newHeight = Math.max(minHeight, resizeData.startHeight + deltaY);
                    newLeft = resizeData.startLeft + (resizeData.startWidth - newWidth);
                    break;
                case 'ne': // Northeast
                    newWidth = Math.max(minWidth, resizeData.startWidth + deltaX);
                    newHeight = Math.max(minHeight, resizeData.startHeight - deltaY);
                    newTop = resizeData.startTop + (resizeData.startHeight - newHeight);
                    break;
                case 'nw': // Northwest
                    newWidth = Math.max(minWidth, resizeData.startWidth - deltaX);
                    newHeight = Math.max(minHeight, resizeData.startHeight - deltaY);
                    newLeft = resizeData.startLeft + (resizeData.startWidth - newWidth);
                    newTop = resizeData.startTop + (resizeData.startHeight - newHeight);
                    break;
                case 'n': // North
                    newHeight = Math.max(minHeight, resizeData.startHeight - deltaY);
                    newTop = resizeData.startTop + (resizeData.startHeight - newHeight);
                    break;
                case 's': // South
                    newHeight = Math.max(minHeight, resizeData.startHeight + deltaY);
                    break;
                case 'w': // West
                    newWidth = Math.max(minWidth, resizeData.startWidth - deltaX);
                    newLeft = resizeData.startLeft + (resizeData.startWidth - newWidth);
                    break;
                case 'e': // East
                    newWidth = Math.max(minWidth, resizeData.startWidth + deltaX);
                    break;
            }
            
            // Apply constraints to keep window in viewport
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;
            if (newLeft + newWidth > window.innerWidth) {
                newWidth = window.innerWidth - newLeft;
            }
            if (newTop + newHeight > window.innerHeight) {
                newHeight = window.innerHeight - newTop;
            }
            
            terminal.style.left = `${newLeft}px`;
            terminal.style.top = `${newTop}px`;
            terminal.style.width = `${newWidth}px`;
            terminal.style.height = `${newHeight}px`;
            
            e.preventDefault();
        };
        
        const stopResize = () => {
            if (!isResizing) return;
            isResizing = false;
            resizeData = null;
            terminal.classList.remove('resizing');
        };
        
        // Register event listeners for cleanup
        registerEventListener(handle, 'mousedown', startResize);
        registerEventListener(document, 'mousemove', doResize);
        registerEventListener(document, 'mouseup', stopResize);
    });
}

/**
 * Setup window focus management
 */
function setupWindowFocus(terminal) {
    const handleFocus = () => {
        bringToFront(terminal);
    };
    
    // Maintain focus when clicking anywhere in the terminal
    registerEventListener(terminal, 'mousedown', handleFocus);
    registerEventListener(terminal, 'click', handleFocus);
    
    // Prevent losing focus when clicking on terminal content
    const content = terminal.querySelector('.xterm-content');
    if (content) {
        registerEventListener(content, 'click', (e) => {
            e.stopPropagation();
            bringToFront(terminal);
        });
    }
}

/**
 * Setup close button functionality
 */
function setupCloseButton(terminal) {
    const closeButton = terminal.querySelector('.close-button');
    
    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent window focus/drag
        closeTerminal(terminal);
    };
    
    registerEventListener(closeButton, 'click', handleClose);
}

/**
 * Bring a window to front (focus) and manage cursor display
 */
function bringToFront(terminal) {
    // Remove focus from all terminals and hide all cursors
    document.querySelectorAll('.linux-terminal').forEach(t => {
        t.classList.remove('focused');
        t.style.zIndex = '100';
        hideCursorInTerminal(t);
    });
    
    // Focus the clicked terminal and show its cursor
    terminal.classList.add('focused');
    terminal.style.zIndex = '300';
    showCursorInTerminal(terminal);
}

/**
 * Hide cursor in a terminal
 */
function hideCursorInTerminal(terminal) {
    const cursors = terminal.querySelectorAll('.xterm-cursor, .xterm-cursor-vertical');
    cursors.forEach(cursor => cursor.remove());
}

/**
 * Create a standardized green blinking vertical line cursor element
 */
function createGreenCursor() {
    const cursor = document.createElement('span');
    cursor.className = 'xterm-cursor-vertical';
    // Ensure green styling with inline styles as backup
    cursor.style.cssText = 'background: transparent !important; color: #00ff00 !important; border-right: 2px solid #00ff00; animation: xterm-cursor-blink 1s infinite; font-weight: normal; width: 0; display: inline-block;';
    return cursor;
}

/**
 * Show cursor in the active prompt line of a terminal
 */
function showCursorInTerminal(terminal) {
    // Remove any existing cursors first
    hideCursorInTerminal(terminal);
    
    const content = terminal.querySelector('.xterm-content');
    
    // Find the last prompt line that contains a '$' symbol
    const allLines = content.querySelectorAll('.xterm-line');
    for (let i = allLines.length - 1; i >= 0; i--) {
        const line = allLines[i];
        if (line.textContent.includes('$') && !line.textContent.includes('weather')) {
            // This is a command prompt line, add cursor at the end
            const cursor = createGreenCursor();
            line.appendChild(cursor);
            break;
        }
    }
}

/**
 * Add a new prompt line to a terminal with cursor
 */
function addPromptLine(terminal, command = null) {
    const content = terminal.querySelector('.xterm-content');
    const terminalId = terminal.dataset.terminalId;
    
    // If a command was executed, add it to history first
    if (command) {
        const commandLine = document.createElement('div');
        commandLine.className = 'xterm-line';
        commandLine.innerHTML = `<span class="xterm-prompt">${xtermUsername}@${xtermHostname}</span>:<span class="xterm-path">~</span>$ ${command}`;
        content.appendChild(commandLine);
    }
    
    // Add new prompt line
    const newPromptLine = document.createElement('div');
    newPromptLine.className = 'xterm-line';
    newPromptLine.innerHTML = `<span class="xterm-prompt">${xtermUsername}@${xtermHostname}</span>:<span class="xterm-path">~</span>$ `;
    content.appendChild(newPromptLine);
    
    // Show cursor in the focused terminal
    if (terminal.classList.contains('focused')) {
        showCursorInTerminal(terminal);
    }
    
    // Scroll to bottom
    content.scrollTop = content.scrollHeight;
}


/**
 * Handle Linux theme clicks
 */
function handleLinuxClick(x, y) {
    // Check if click is on a terminal - if not, create a subtle desktop effect
    const clickedElement = document.elementFromPoint(x, y);
    const clickedTerminal = clickedElement?.closest('.linux-terminal');
    
    if (!clickedTerminal) {
        // Click on desktop - brief flash effect on all terminals
        const terminals = document.querySelectorAll('.linux-terminal');
        terminals.forEach(terminal => {
            const originalShadow = terminal.style.boxShadow;
            terminal.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3)';
            setTimeout(() => {
                terminal.style.boxShadow = originalShadow;
            }, 150);
        });
    }
    // If clicked on terminal, the focus management is handled by setupWindowFocus
}

/**
 * Cleanup xTerm theme
 */
function cleanupLinuxTheme() {
    
    // Clear all intervals
    linuxIntervals.forEach(intervalId => {
        clearInterval(intervalId);
    });
    linuxIntervals = [];
    
    // Remove desktop icons
    const iconsContainer = document.querySelector('.linux-desktop-icons');
    if (iconsContainer && iconsContainer.parentNode) {
        iconsContainer.parentNode.removeChild(iconsContainer);
    }
    
    // Remove all terminal windows
    const terminals = document.querySelectorAll('.linux-terminal');
    terminals.forEach(terminal => {
        if (terminal.parentNode) {
            terminal.parentNode.removeChild(terminal);
        }
    });
    
    // Clear references
    linuxTerminals = [];
    openWindows.clear();
    nextTerminalId = 1;
    
}