# CSS Organization Guide

This directory contains the separated and organized CSS files for the HiOS Mobile application. The CSS has been split from the monolithic `style.css` into logical modules for easier maintenance and understanding.

## File Structure and Purpose

### 1. **variables.css**
- **Purpose**: Defines all CSS custom properties (variables)
- **Contains**: 
  - Color variables (primary, secondary, tertiary, etc.)
  - Sizing variables (border-radius, spacing)
  - Font variables
  - Theme definitions for all locations (Dobrota, Spain, France, Turkey, Morocco, etc.)
  - Glass morphism variables
  - Dark mode overrides
- **Load Order**: FIRST - must load before other files use the variables

### 2. **fonts.css**
- **Purpose**: Font face declarations and icon font setup
- **Contains**:
  - Material Symbols Rounded font definition
  - Material icons styling
- **Load Order**: SECOND

### 3. **global.css**
- **Purpose**: Global element and base styles
- **Contains**:
  - Body and * (universal selector) styles
  - Main container styles
  - Heading (h1-h6) and paragraph defaults
  - Basic text styles
- **Load Order**: THIRD

### 4. **background.css**
- **Purpose**: Background wrapper and image handling
- **Contains**:
  - Background wrapper positioning and effects
  - Background image styling
  - Glass noise effects
  - Background toggle classes
- **Load Order**: FOURTH

### 5. **cards.css**
- **Purpose**: Card, box, and container components
- **Contains**:
  - Card styling (.card, .glass-container-ready)
  - Translucent box variants (.translucentBox, .translucentAboutBox)
  - Rounded image styling
  - Join/stacked container styles
  - Glass morphism effects for cards
  - Acrylic effect overrides
- **Load Order**: FIFTH

### 6. **typography.css**
- **Purpose**: Heading, text, and font styling
- **Contains**:
  - Heading styles (.blue-h2, .blue-h3, .gradientHeading)
  - Paragraph and text styles
  - Animation for pulse effect
  - Text alignment utilities
  - ID-specific text styles (#p11, #p12, #para, etc.)
- **Load Order**: SIXTH

### 7. **buttons.css**
- **Purpose**: All button and button-like elements
- **Contains**:
  - Primary button styles (.button)
  - Navigation buttons (.navButton, .navButtonInactive)
  - Special buttons (#nextButtonRoomkey, #signupButton, etc.)
  - Segmented button styles (joinLeft, joinRight, etc.)
  - Drawer buttons
  - Close button styling
- **Load Order**: SEVENTH

### 8. **forms.css**
- **Purpose**: Form controls, inputs, and form-related elements
- **Contains**:
  - Input field styles (.form-control, .loginInput)
  - Join variants for stacked inputs
  - Login-specific styles
  - Offer/promotion box styles
  - Iframe wrapper styles
  - Icon styling for forms
- **Load Order**: EIGHTH

### 9. **navigation.css**
- **Purpose**: Navigation, drawer, and navigation pill components
- **Contains**:
  - Navigation links and pills (.nav-pills, .nav-link)
  - Side drawer styling
  - Drawer overlay
  - Sub-navigation pills (header tabs)
  - Drawer animations
  - Scrollable navigation
- **Load Order**: NINTH

### 10. **components.css**
- **Purpose**: UI components like switches, selects, toasts, tabs
- **Contains**:
  - Switch/toggle styling
  - Select dropdown styling with custom arrow
  - Tab styling (.tab-content, .tab-pane)
  - Toast notification styling
  - Settings group styling
  - Container and spacing utilities
- **Load Order**: TENTH

### 11. **utilities.css**
- **Purpose**: Utility and helper classes
- **Contains**:
  - Spacing utilities (margin, padding: .mt-*, .mb-*, .p-*, etc.)
  - Display utilities (.d-flex, .h-100)
  - Positioning utilities (.position-fixed, .bottom-0)
  - Flexbox utilities (.align-items-center, .justify-content-between)
  - Image utilities (.img-fluid)
- **Load Order**: ELEVENTH

### 12. **accessibility.css**
- **Purpose**: Accessibility features and high-contrast mode
- **Contains**:
  - High contrast mode overrides
  - Enhanced visibility for buttons and controls
  - Color contrast improvements for accessibility
- **Load Order**: TWELFTH (late load to override other styles)

### 13. **google-auth.css**
- **Purpose**: Google Sign-In button styling
- **Contains**:
  - Google Material Button styling
  - Button states (hover, focus, disabled, active)
  - Icon and content wrapper styling
- **Load Order**: LAST

## Import Order in main.jsx

The files are imported in the correct cascade order in `src/main.jsx`:

```javascript
import "./assets/css/variables.css";      // 1. Variables first
import "./assets/css/fonts.css";          // 2. Fonts
import "./assets/css/global.css";         // 3. Global styles
import "./assets/css/background.css";     // 4. Background
import "./assets/css/cards.css";          // 5. Cards
import "./assets/css/typography.css";     // 6. Typography
import "./assets/css/buttons.css";        // 7. Buttons
import "./assets/css/forms.css";          // 8. Forms
import "./assets/css/navigation.css";     // 9. Navigation
import "./assets/css/components.css";     // 10. Components
import "./assets/css/utilities.css";      // 11. Utilities
import "./assets/css/accessibility.css";  // 12. Accessibility (overrides)
import "./assets/css/google-auth.css";    // 13. Google Auth (last)
```

## Finding and Modifying Styles

When you need to modify a specific style:

1. **Colors and Variables**: Look in `variables.css` - all color definitions are there, organized by theme
2. **Button Styling**: Look in `buttons.css` - all button variants are here
3. **Form Fields**: Look in `forms.css` - input, select, and login styles
4. **Cards/Containers**: Look in `cards.css` - box and card styling
5. **Navigation**: Look in `navigation.css` - nav pills, drawers, and menu items
6. **Text/Headings**: Look in `typography.css` - heading and text styles
7. **Spacing**: Look in `utilities.css` - margin and padding classes
8. **Accessibility**: Look in `accessibility.css` - high contrast and a11y features

## Theme System

The application uses a theme system with multiple location-based themes:
- Default (dobrota)
- Spain
- France
- Turkey
- Morocco
- Clouds
- London
- Yorkshire
- Scotland
- Generic Green
- Generic Cyan
- Generic Orange

All theme variables are defined in `variables.css` with their light and dark mode variants. To add a new theme or modify existing colors, edit the appropriate section in `variables.css`.

## Dark Mode

Dark mode is handled automatically through:
- CSS custom properties with `@media (prefers-color-scheme: dark)` queries
- Explicit `.theme-dark` class overrides
- Automatic light mode override with `.theme-light` class

Most dark mode styles are defined inline with their light mode counterparts in `variables.css`.

## Maintenance Tips

1. **Keep Related Styles Together**: If you add new button variants, add them to `buttons.css`, not a random file
2. **Use CSS Variables**: Always use `var(--primary)` instead of hardcoding colors - this keeps themes working
3. **Check Cascade Order**: If a style isn't working, it might be overridden by a later file. Check the import order
4. **Mobile First**: Remember media queries for responsive design are scattered - look for `@media` in each file
5. **Test All Themes**: When making changes, test with different themes selected to ensure consistency

## Migration Notes

The original `style.css` file has been completely split into these 13 files. The old monolithic file is no longer used. If you need to reference the original file for comparison, it should still exist in the repository history.

All functionality remains identical - this is purely an organizational refactor to improve maintainability.
