---
name: Aura Mobile
colors:
  surface: '#fbf8fc'
  surface-dim: '#dcd9dd'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f7'
  surface-container: '#f0edf1'
  surface-container-high: '#eae7eb'
  surface-container-highest: '#e4e1e6'
  on-surface: '#1b1b1e'
  on-surface-variant: '#3d4a40'
  inverse-surface: '#303033'
  inverse-on-surface: '#f3f0f4'
  outline: '#6c7b6f'
  outline-variant: '#bbcabd'
  surface-tint: '#006d3e'
  primary: '#006d3e'
  on-primary: '#ffffff'
  primary-container: '#1dbf73'
  on-primary-container: '#004726'
  inverse-primary: '#4de090'
  secondary: '#625595'
  on-secondary: '#ffffff'
  secondary-container: '#c6b7ff'
  on-secondary-container: '#524584'
  tertiary: '#732ee4'
  on-tertiary: '#ffffff'
  tertiary-container: '#b895ff'
  on-tertiary-container: '#4e00ad'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6efdaa'
  primary-fixed-dim: '#4de090'
  on-primary-fixed: '#00210f'
  on-primary-fixed-variant: '#00522d'
  secondary-fixed: '#e7deff'
  secondary-fixed-dim: '#ccbeff'
  on-secondary-fixed: '#1e0e4e'
  on-secondary-fixed-variant: '#4a3d7c'
  tertiary-fixed: '#eaddff'
  tertiary-fixed-dim: '#d2bbff'
  on-tertiary-fixed: '#25005a'
  on-tertiary-fixed-variant: '#5a00c6'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e1e6'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a refreshing, friendly, and structured mobile experience. Inspired by serene lifestyle applications and clean creator hubs, it balances calm pastel backdrops with razor-sharp functional clarity.

### Aesthetics & Tone
- **Calm & Inviting:** The visual mood relies on gentle pastel periwinkle/lavender washes across key headers and hero segments, creating an immediate sense of ease and delight.
- **Modern Minimalism:** Flat surfaces, crisp whitespace, hairline dividing lines, and purposeful contrast eliminate cognitive overload.
- **Friendly Professionalism:** Soft geometric shapes and warm typography pair with vibrant primary green accents to signal action, momentum, and success.

### Design Movement
Modern Soft-Minimalism: Blending clean content-focused typography, high-clarity cards, and ultra-subtle tinted elevations to highlight content hierarchy without heavy skeumorphic noise.

## Colors

The palette balances serene ambient hues with functional high-contrast anchors:

- **Primary (`#1DBF73`):** High-energy emerald green reserved for primary calls-to-action, success states, active badges, and conversion touchpoints.
- **Secondary (`#C4B5FD`):** Soft pastel lavender used for ambient top-sheet headers, subtle active pills, and delicate brand framing.
- **Tertiary (`#7C3AED`):** Deep energetic violet utilized for focused badges, selected tab indicators, or secondary interactive highlights.
- **Neutral (`#18181B`):** Deep charcoal black for primary text, structural icons, and deep controls, softening the harshness of pure black.
- **Surface & Canvas:** Canvas grounds itself on `#FAFAFA` with cards sitting crisply on `#FFFFFF`. Hairline dividers employ `#E4E4E7` to provide gentle separation.

## Typography

The typography leverages **Plus Jakarta Sans** across all levels. Its balanced geometric construction and rounded apertures convey a contemporary, approachable, and legible voice suited for mobile density.

- **Headlines:** Set with deliberate tight tracking (`-0.02em` to `-0.01em`) and bold weights for clear section anchors and profile titles.
- **Body:** Open line heights (`1.4`–`1.5`) preserve breathing room in dense listing rows and informational panels.
- **Labels & Microcopy:** Slightly tracked uppercase or medium-weight styles ensure high legibility in status tags, badges, and field headers.

## Layout & Spacing

The layout is optimized for an ergonomic 390px mobile viewport utilizing an 8pt vertical rhythm and a fluid 4-column mobile grid.

- **Margins & Gutters:** A standard 20px (`1.25rem`) outer margin prevents UI elements from crowding display bezels. Internal grid columns use a 16px (`1rem`) gutter.
- **Component Padding:** Standard cards and list cells employ vertical paddings of 12px–16px and horizontal paddings of 16px–20px.
- **Header Scaffolding:** Top profile zones and banners occupy flexible vertical containers (typically 140px–180px) layered behind avatars, creating natural overlapping hierarchy.

## Elevation & Depth

Visual depth is achieved through delicate surface stacking and feather-light shadows rather than heavy drop shadows:

- **Level 0 (Flat Canvas):** `#FAFAFA` base background.
- **Level 1 (Cards & Groups):** Pure white (`#FFFFFF`) containers with either a 1px border (`#E4E4E7`) or a featherweight ambient shadow: `0 2px 8px -2px rgba(24, 24, 27, 0.04), 0 1px 4px -1px rgba(24, 24, 27, 0.02)`.
- **Level 2 (Floating Controls & Popovers):** Elevated action buttons, bottom sheets, and floating triggers feature `0 10px 25px -5px rgba(24, 24, 27, 0.08), 0 8px 10px -6px rgba(24, 24, 27, 0.04)`.
- **Overlapping Planes:** Profile avatars overlap the boundary between lavender header backgrounds and white surface cards, using a 3px solid white outline ring to visually detach from the canvas.

## Shapes

The shape system adopts a friendly, accessible curved identity:

- **Cards & Enclosures:** Built with `rounded-lg` (16px / `1rem`), delivering clean visual soft corners.
- **Buttons & Interactive Tags:** Form inputs and primary CTA buttons use either 8px or full pill radii (`9999px`) for high tactile feedback.
- **Avatars & Badges:** Avatars are rendered strictly circular (`rounded-full`), framed with white border rings.

## Components

### Buttons
- **Primary Action:** Solid `#1DBF73` filled button with pure white text, bold label styling, 12px vertical padding, and 8px border radius. On press, transitions to `#17a865`.
- **Secondary / Outline:** Pure white surface with `#E4E4E7` border, `#18181B` typography, and subtle tap feedback.

### Profile & Content Headers
- Full-bleed or edge-to-edge top block with `#C4B5FD` (or pastel gradient) fill.
- Circular avatar positioned half in the colored header, half over the white card surface, enclosed in a 3px `#FFFFFF` halo.
- Title and subtitle centered or left-aligned directly below.

### Lists & Settings Rows
- Full-width tap targets with minimal 1px `#F4F4F5` bottom dividers.
- Left edge accommodates a 24px minimalist line icon (`#18181B` or `#71717A`), followed by standard body text.
- Trailing slot supports switches, plain text metadata (`#71717A`), or subtle chevron navigators.

### Input Fields & Controls
- **Form Inputs:** 48px height, 1px border (`#E4E4E7`), smooth 8px radius, `#FAFAFA` subtle fill or pure white card context. Focus state triggers a 1.5px `#7C3AED` or `#1DBF73` stroke.
- **Toggle Switches:** Capsule track (`#E4E4E7` inactive, `#18181B` or `#1DBF73` active) housing a 20px white circular thumb.
- **Chips & Status Badges:** Pill-shaped capsules with subtle tint fills (e.g., `#DCFCE7` text `#15803D` for "Online", or `#EDE9FE` text `#6D28D9` for "Beta").
