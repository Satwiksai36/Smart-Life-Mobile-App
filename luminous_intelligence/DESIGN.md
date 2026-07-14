---
name: Luminous Intelligence
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#57dffe'
  on-secondary-container: '#006172'
  tertiary: '#005523'
  on-tertiary: '#ffffff'
  tertiary-container: '#007030'
  on-tertiary-container: '#63f889'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 20px
  gutter: 16px
---

## Brand & Style
The design system embodies a premium, AI-driven productivity environment that merges the structural clarity of Material 3 with the refined aesthetics of Apple’s Human Interface Guidelines. It targets high-performance individuals who value focus, clarity, and sophisticated utility.

The visual language is rooted in **Modern Minimalism** enhanced by **Glassmorphism**. It utilizes multi-layered depth, subtle background blurs, and soft gradients to create a sense of lightness and technical sophistication. The emotional response is one of "calm capability"—where the interface feels intelligent, unobtrusive, and exceptionally polished.

## Colors
This design system utilizes a high-clarity palette centered on an **Indigo Primary** for action and focus, and a **Cyan Secondary** for supplemental data and AI-related accents. 

- **Primary Gradient**: A linear flow from `#4F46E5` to `#6366F1` (135 degrees) is used for high-impact elements like FABs and progress indicators.
- **Glass Surfaces**: Card backgrounds should use `rgba(255, 255, 255, 0.7)` in light mode and `rgba(30, 41, 59, 0.5)` in dark mode, both paired with a `20px` backdrop-blur.
- **Semantic Colors**: Green is reserved for success/habit completion; Amber for warnings; Red for critical deletions or missed goals.

## Typography
The system relies exclusively on **Inter** for its modern, neutral, and highly legible characteristics. 

- **Headings**: Use Bold (700) or SemiBold (600) weights with slightly tighter letter-spacing to create a "locked-in" premium feel.
- **Body Text**: Maintain a generous line height (1.5x) to ensure readability during deep work sessions.
- **Micro-copy**: Use the Medium (500) weight for labels and captions to maintain visual hierarchy without needing excessive size.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a soft 8px rhythm. 

- **Desktop**: 12-column grid, 24px gutters, max-width 1440px.
- **Mobile**: 4-column grid, 16px gutters, 20px side margins.
- **Philosophy**: Use "Negative Space as a Feature." Group related AI insights within cards using `24px` internal padding to prevent visual clutter. Horizontal rhythm should prioritize alignment with the card edges rather than the screen edge where possible.

## Elevation & Depth
Depth is communicated through **Glassmorphism** and **Ambient Shadows** rather than solid elevation.

- **Surface Tiers**:
    - **Level 0 (Background)**: Base color (`#F8FAFC`).
    - **Level 1 (Cards)**: Semi-transparent white with a `1px` inner stroke (`rgba(255,255,255,0.4)`).
    - **Level 2 (Modals/Overlays)**: Increased blur (`40px`) and a more pronounced drop shadow.
- **Shadow Profile**: Use a "soft-diffusion" approach. A typical card shadow: `0 10px 25px -5px rgba(0, 0, 0, 0.05)`.
- **Interactivity**: On hover, cards should subtly lift (translate -2px) and the shadow spread should increase slightly.

## Shapes
The shape language is consistently **Rounded**. 

- **Cards**: All primary containers must use a `24px` corner radius to evoke a modern, friendly, and premium handheld feel.
- **Interactive Elements**: Buttons and inputs use a `12px` radius, providing enough contrast from the larger card containers to remain distinct.
- **Segmented Controls**: The outer container and the active "thumb" should share a harmonious radius (e.g., 10px inside a 12px container).

## Components

- **Glassmorphic Cards**: Use a white 40% transparent background, `24px` radius, and a `1px` border of `rgba(255,255,255,0.5)`. This creates the "frosted" edge effect.
- **Floating Action Button (FAB)**: A circular button with the Indigo-to-Cyan gradient. Use a high-elevation shadow (`0 20px 30px rgba(79, 70, 229, 0.3)`).
- **Segmented Controls**: Pill-shaped backgrounds with a sliding "Glass" pill for the active state. Subtle haptic feedback should be implied visually via transition speed.
- **AI Assistant Chat**: 
    - *User Bubbles*: Solid Indigo with white text.
    - *AI Bubbles*: Glassmorphic with a subtle Cyan glow effect (`0 0 15px rgba(6, 182, 212, 0.2)`).
- **Progress Rings**: Use a stroke width of `8px`. The track should be a low-opacity version of the color, and the progress should be a gradient of the primary or secondary color.
- **Charts**: 
    - *Line Charts*: Use curved paths (splines) with a subtle gradient area fill below the line.
    - *Bar Charts*: Use rounded top corners (radius: 4px).
- **Bottom Navigation**: Use an active state indicator consisting of a small `4px` dot or a subtle glowing line below the active icon, colored in the primary indigo.
- **Empty States**: Use monochromatic, thin-line illustrations with large areas of "white space" and a clear, primary-colored CTA.