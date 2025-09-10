# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a sophisticated multi-theme temporal interface with dual implementations:

1. **Terminal Version**: Two bash scripts (`clocker` and `clocker-improved`)
2. **Web Version**: Advanced multi-theme web application with weather integration

Both implementations display formatted time with day of week, date with ordinal suffixes, and time with AM/PM and timezone, updating every second.

## Architecture

### Terminal Implementation
- **`clocker`**: Original 48-line bash script with creative ordinal suffix logic but critical bugs
- **`clocker-improved`**: Enhanced 180+ line production-ready version with comprehensive error handling
- **Key Features**: Terminal cursor positioning, signal handling, graceful exit, window resize support

### Web Implementation - Advanced Multi-Theme System
- **`index.html`**: Main HTML structure with theme selector and weather integration
- **`base-style.css`**: Core styling and layout foundation
- **`core-script.js`**: Main application logic with modular theme management
- **Theme Modules**: Separate JS/CSS files for Matrix, LCARS, Thor, SBEMAIL, and Linux themes
- **`timezones.js`**: Comprehensive timezone data with DST calculations

## Key Technical Systems

### Modular Theme Architecture
- **Dynamic Loading**: Themes loaded on-demand to reduce initial bundle size
- **Resource Management**: Advanced cleanup system prevents conflicts and memory leaks
- **Theme Isolation**: Complete separation with proper cleanup between theme switches
- **Random Initialization**: Randomly selects theme on startup

### Weather Integration System
- **OpenWeatherMap API**: Live weather data (API key configured in core-script.js)
- **Multi-format Search**: Cities, ZIP codes, coordinates, international locations
- **Geocoding Support**: Converts locations to precise coordinates
- **Error Handling**: Comprehensive API failure management and user feedback

### Theme-Specific Features
- **Matrix Theme**: Green terminal aesthetic with Matrix rain effects and rotating kanji in upper right corner of time/date panel
- **LCARS Theme**: Star Trek orange interface with warp speed animations and Vulcan salute decoration
- **Thor Theme**: Norse gold theme with lightning effects and runes
- **SBEMAIL Theme**: Strong Bad's Compy 386 retro computer theme with nostalgic HomestarRunner aesthetics
- **Linux Theme**: X-Windows desktop simulation with draggable/resizable terminal windows, weather and clocker applications, desktop icons, and timezone management

## Common Commands

### Terminal Versions
```bash
./clocker                    # Original version (has bugs but smooth visuals)
./clocker-improved          # Enhanced version (production-ready, comprehensive)
```

### Web Version
```bash
# Open index.html in browser - fully self-contained
# No build process required
python3 -m http.server 8000  # Optional local server
```

## Technical Implementation Details

### Enhanced Error Handling (clocker-improved)
- **Dependency Validation**: Checks for tput, date, sleep commands
- **Terminal Capability Testing**: Validates cursor positioning support
- **Bounds Checking**: Prevents positioning errors on small terminals
- **Graceful Degradation**: Handles errors without crashing

### Performance Optimizations
- **Terminal Script**: 67% reduction in system calls (1 date call vs 3 per second)
- **Web App**: Lazy theme loading, efficient resource cleanup
- **Smooth Updates**: No screen flickering through selective screen updates

### Theme Switching Hygiene
- **8-Step Process**: Complete cleanup → class management → background control → initialization
- **Resource Tracking**: Global arrays track intervals and event listeners for cleanup
- **Error Prevention**: Comprehensive null checks and defensive programming

### Linux Theme Architecture
- **X-Windows Simulation**: Authentic Linux desktop environment with gray background and retro aesthetics
- **Terminal Windows**: Draggable, resizable xterm-style windows with proper focus management
- **Desktop Icons**: Click-to-launch weather and clocker applications with visual feedback
- **Window Management**: Cascading placement, proper z-index handling, and focus retention
- **Application Integration**: Weather app with curses-style interface and clocker with timezone selection
- **Mobile Optimization**: Shows only clocker terminal and theme selector on mobile devices

## Development Guidelines

### Adding New Themes
1. Create `new-theme.js` and `new-theme.css`
2. Implement `initNewTheme()` and `cleanupNewTheme()` functions
3. Register in `availableThemes` array in `core-script.js`
4. Add theme option button in `index.html`

### Code Quality Standards
- **Modular Architecture**: Clean separation of concerns with dynamic loading
- **Error Prevention**: Comprehensive null checks and defensive programming  
- **Performance Focus**: Efficient resource usage with proper cleanup
- **User Experience**: Smooth, professional transitions and interactions

## Linux Theme Functionality

### Terminal Applications
- **Weather Application**: Interactive curses-style interface with location search, current conditions, and 5-day forecast
  - Immediate 'q' quit functionality (no Enter key required)
  - Dynamic box sizing based on content width
  - Properly aligned weather forecast display
  - Restart capabilities with command history (./weather, up arrow, !!)

- **Clocker Application**: Enhanced timezone-aware clock display
  - Arrow key navigation through worldwide timezones
  - DST-aware timezone descriptions with GMT offsets
  - Status bar with keyboard shortcuts
  - Immediate 'q' quit with graceful exit messages

### Window Management Features  
- **Dragging**: Move windows via titlebar with visual feedback
- **Resizing**: Edge and corner resize handles for all directions
- **Focus Management**: Click anywhere in terminal to maintain input focus
- **Cascading Placement**: Automatic window positioning to avoid overlaps

## SBEMAIL Theme Features

### Authentic Compy 386 Experience
- **Strong Bad's Computer**: Faithful recreation of the Compy 386 from HomestarRunner.com
- **DOS-Style Startup**: Authentic A:\> prompt with Strong Bad's boxing glove typing
- **Random Phrases**: Rotating collection of Strong Bad quotes during initialization
- **Retro Aesthetics**: Beige monitor housing, green terminal text, scan lines

### Interactive Weather System
- **Built-in Weather Search**: Integrated weather search within the terminal interface
- **Scrolling Ticker**: Animated weather data display with proper CSS-based scrolling
- **Multiple Search Support**: Users can perform unlimited weather searches with real-time ticker updates
- **API Integration**: Full OpenWeatherMap API integration with error handling

### Typography and Styling
- **Consistent Font Sizing**: All terminal text elements use uniform 25px font size
- **Retro Computer Fonts**: Westminster, Press Start 2P, Orbitron font stack
- **CRT Effects**: Authentic scan lines and screen flicker animations
- **Boxing Gloves Interaction**: Click effects with boxing gloves and occasional Trogdor appearances

### Timezone Management
- **Integrated Slider**: Built-in timezone control within the Compy terminal
- **DST Support**: Full daylight saving time calculations and display
- **Real-time Updates**: Clock updates reflect timezone changes immediately

## Current Status

- **Web Application**: Production-ready with comprehensive theme system and weather integration
- **SBEMAIL Theme**: Complete Strong Bad Compy 386 experience with weather integration, scrolling ticker, and consistent styling
- **Matrix Theme**: Fixed rotating kanji display - now properly shows in upper right corner of time/date panel
- **Linux Theme**: Full X-Windows simulation with terminal applications, desktop icons, and window management
- **Terminal Scripts**: Both original and enhanced versions available
- **Code Quality**: All excessive debug logging removed, optimized performance
- **Documentation**: Complete technical documentation consolidated in README.md and CLAUDE.md
- **Testing**: All features tested across themes and platforms