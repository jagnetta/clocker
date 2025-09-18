# GEMINI.md

## Project Overview

This project, "Clocker", is a sophisticated clock display application with both a web-based and a terminal-based implementation. The application is designed with a modular architecture, allowing for easy theming and extension.

The web application features a dynamic theme system, with five initial themes: Matrix, LCARS, Thor, SBEmail, and Linux. It also integrates with the OpenWeatherMap API to provide real-time weather information. The application is built with vanilla JavaScript, HTML, and CSS, and it dynamically loads theme-specific modules (JS and CSS) as needed.

The terminal application is a bash script that displays the current time and date in the center of the terminal. An "improved" version of the script is also provided, which addresses several bugs and performance issues in the original.

## Building and Running

### Web Application

1.  Open `index.html` in a modern web browser.
2.  The application will start with a random theme.
3.  Use the theme selector buttons at the top of the page to switch between themes.
4.  To use the weather functionality, enter a location (city, ZIP code, or coordinates) in the weather input box and click "OK".

**Note:** The OpenWeatherMap API key is hardcoded in `core-script.js`. For production use, you should replace it with your own API key.

### Terminal Application

There are two versions of the terminal application:

*   `clocker`: The original, basic version.
*   `clocker-improved`: An enhanced version with bug fixes and performance improvements.

To run either version, execute the script from your terminal:

```bash
./clocker
```

or

```bash
./clocker-improved
```

## Development Conventions

*   **Modular Themes:** The web application uses a modular theme system. Each theme consists of a `.js` file and a `.css` file.
    *   The JavaScript file for a theme should export an `init<ThemeName>Theme` function and a `cleanup<ThemeName>Theme` function.
    *   The `init` function is called when the theme is activated, and the `cleanup` function is called when the theme is deactivated.
*   **Dynamic Loading:** Themes are loaded dynamically by `core-script.js` as needed.
*   **Centralized Logic:** The core application logic (clock updates, theme switching, weather API integration) is handled in `core-script.js`.
*   **Bash Best Practices:** The `clocker-improved` script follows best practices for shell scripting, including `set -euo pipefail`, dependency checking, and robust error handling.
