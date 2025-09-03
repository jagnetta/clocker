# Clocker

A clock display project with both terminal and web implementations.

## What's Included

### Terminal Version (`clocker`)
A bash script that displays a centered clock in the terminal using `tput` commands. Features:
- Day of the week display
- Formatted date with ordinal suffixes (1st, 2nd, 3rd, etc.)
- Time with AM/PM and timezone
- Automatically centers content in terminal window
- Updates every second
- Clean exit message when terminated with Ctrl+C

### Web Version
A modern web app that replicates the terminal clocker functionality:

**Files:**
- `index.html` - Main HTML structure
- `style.css` - Styling with green terminal-like appearance
- `script.js` - JavaScript for real-time clock updates and dynamic sizing

**Features:**
- Bright green text on black background (terminal aesthetic)
- Dynamic font sizing that scales to fit browser window
- Responsive design that adjusts to window resizing
- Same date/time formatting as the original bash script
- Ctrl+C keyboard shortcut shows quit message
- Mobile-friendly responsive layout

## Usage

**Terminal version:**
```bash
./clocker
```

**Web version:**
Open `index.html` in any modern web browser.

Both versions display the current day, date, and time in a centered, easy-to-read format that updates every second.
