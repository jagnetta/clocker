# Clocker - Modular Theme System

The Clocker application has been refactored into a modular theme system to make the codebase more manageable and reduce file sizes.

## File Structure

### Core Files (Always Loaded)
- **`index-modular.html`** - New modular HTML file with dynamic theme loading
- **`core-script.js`** - Core functionality + Matrix theme (13KB vs original 29KB)
- **`base-style.css`** - Core styles + Matrix theme (26KB vs original 78KB)

### Theme Modules (Loaded On Demand)
- **`lcars-theme.js`** - LCARS theme functionality
- **`lcars-theme.css`** - LCARS theme styles
- **`thor-theme.js`** - Thor theme functionality  
- **`thor-theme.css`** - Thor theme styles

### Legacy Files (Preserved)
- **`index.html`** - Original monolithic version
- **`script.js`** - Original full script
- **`style.css`** - Original full styles

## Usage

### To Use the Modular Version:
1. Open `index-modular.html` in your browser
2. The Matrix theme loads by default
3. Click theme buttons to dynamically load LCARS or Thor themes

### File Size Benefits:
- **Initial Load**: ~39KB (core-script.js + base-style.css)
- **Per Theme**: ~6-8KB additional when theme is selected
- **vs Original**: 107KB for all themes loaded at once

## Theme System Architecture

### Matrix Theme (Default)
- Loaded in `core-script.js` and `base-style.css`
- No additional files needed
- Green Matrix digital rain effect
- Kanji character rotation
- Terminal-style interface

### LCARS Theme Module
- `lcars-theme.js`: Warp speed effects, photon torpedoes, Klingon flybys
- `lcars-theme.css`: Orange LCARS interface, 3D animations, Star Trek styling
- Loaded dynamically when user selects LCARS

### Thor Theme Module  
- `thor-theme.js`: Lightning effects, Mjolnir strikes, Asgardian runes
- `thor-theme.css`: Gold/blue Norse styling, 3D hammer physics
- Loaded dynamically when user selects Thor

## Dynamic Loading System

The modular system includes:

1. **CSS Management**: Automatically loads/unloads theme CSS files
2. **JavaScript Modules**: Dynamically imports theme functionality
3. **Memory Management**: Prevents loading duplicate themes
4. **Error Handling**: Graceful fallbacks if theme files fail to load
5. **Theme State**: Maintains proper theme switching between modules

## Development Benefits

- **Smaller Files**: Each file is now focused and manageable
- **Faster Loading**: Only load what you need
- **Better Organization**: Theme-specific code is isolated
- **Easier Debugging**: Problems are isolated to specific themes
- **Reduced Context**: Each file fits comfortably within token limits

## Testing

To test the modular version:

```bash
# Start local server
python3 -m http.server 8001

# Open browser to:
http://localhost:8001/index-modular.html
```

## Migration Notes

- The original `index.html`, `script.js`, and `style.css` are preserved
- All functionality remains identical
- Theme switching behavior is preserved
- Mobile responsiveness is maintained
- All animations and effects work as before

The modular system provides the same user experience while making the codebase much more maintainable and reducing initial load times.