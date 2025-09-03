# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a dual-implementation clock display project:

1. **Terminal Version** (`clocker`): A bash script using `tput` commands for terminal-based clock display
2. **Web Version** (`index.html`, `style.css`, `script.js`): A modern web app that replicates the terminal functionality

Both implementations display the same formatted output: day of week, date with ordinal suffixes, and time with AM/PM and timezone, updating every second.

## Architecture

### Terminal Implementation
- **`clocker`**: Executable bash script that uses `tput` for cursor positioning and terminal manipulation
- Handles terminal resizing via `WINCH` signal trap
- Implements cleanup function for graceful exit with Ctrl+C

### Web Implementation
- **`index.html`**: Simple HTML structure with three display elements (day, date, time)
- **`style.css`**: Terminal-aesthetic styling with green text (#00ff00) on black background
- **`script.js`**: 
  - Real-time clock updates with `setInterval()`
  - Dynamic font sizing algorithm that scales text based on content length and viewport dimensions
  - Date formatting logic that matches the bash script's output format
  - Window resize handling for responsive font scaling

## Key Technical Details

### Date Formatting Logic
Both implementations use identical date formatting:
- Ordinal suffixes for dates (1st, 2nd, 3rd, 4th, etc.) with special handling for 11th-13th
- Month abbreviations with periods except "May"
- 12-hour time format with AM/PM and timezone

### Font Scaling Algorithm (Web Version)
The JavaScript implementation dynamically calculates font sizes using:
```
fontSize = Math.min(viewportWidth / (textLength * 0.6), viewportHeight * scaleFactor)
```
Where scaleFactor is 0.15 for day/time and 0.12 for date.

## Common Commands

### Terminal Version
```bash
./clocker                    # Run the terminal clock
```

### Web Version
```bash
# No build process - static files
# Open index.html directly in browser or serve via:
python3 -m http.server 8000  # Simple HTTP server
# Navigate to http://localhost:8000
```

## Development Notes

- No package managers, build tools, or dependencies required
- The web version is entirely self-contained with vanilla HTML/CSS/JavaScript
- Both versions implement the same Ctrl+C quit message behavior
- Font scaling in the web version recalculates on every clock update and window resize