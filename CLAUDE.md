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
- **Theme Modules**: Separate JS/CSS files for Matrix, LCARS, and Thor themes
- **`timezones.js`**: Comprehensive timezone data with DST calculations

## Key Technical Systems

### Modular Theme Architecture
- **Dynamic Loading**: Themes loaded on-demand to reduce initial bundle size
- **Resource Management**: Advanced cleanup system prevents conflicts and memory leaks
- **Theme Isolation**: Complete separation with proper cleanup between theme switches
- **Random Initialization**: Randomly selects theme on startup

### Weather Integration System
- **OpenWeatherMap API**: Live weather data with API key: `1e9db439b2d25a3ec0549dd6dd6d5854`
- **Multi-format Search**: Cities, ZIP codes, coordinates, international locations
- **Geocoding Support**: Converts locations to precise coordinates
- **Error Handling**: Comprehensive API failure management and user feedback

### Theme-Specific Features
- **Matrix Theme**: Green terminal aesthetic with Matrix rain effects and kanji rotation
- **LCARS Theme**: Star Trek orange interface with warp speed animations
- **Thor Theme**: Norse gold theme with lightning effects and runes

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

## Current Status

- **Web Application**: Production-ready with comprehensive theme system and weather integration
- **Terminal Scripts**: Both original and enhanced versions available
- **Documentation**: Complete technical documentation consolidated in README.md
- **Testing**: All features tested across themes and platforms