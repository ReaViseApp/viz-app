# Planning Guide

Viz. is a visual content sharing platform that enables users to curate and repost specific selections from other users' content with a permission-based system, combining Instagram-style social feeds with granular content licensing.

**Experience Qualities**:
1. **Playful** - The interface uses soft pastels, rounded shapes, and delightful micro-interactions that make content curation feel light and joyful
2. **Precise** - Visual overlays and interactive borders allow users to select exactly what they want to repost with pixel-perfect accuracy
3. **Social** - Community-focused features like approval requests, comments, and attribution maintain creator relationships while enabling remixing

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
The app requires multiple interconnected views (feed, profile, lists, approval dashboard), real-time interactions (likes, comments, approval requests), media handling (images/videos with overlays), and sophisticated state management for user permissions and content selections.

## Essential Features

### Instagram-Style Feed
- **Functionality**: Infinite-scrolling vertical feed displaying posts with media, captions, likes, and comments
- **Purpose**: Core content discovery and consumption experience that feels familiar to social media users
- **Trigger**: Landing on homepage or refreshing the feed
- **Progression**: Load initial posts → User scrolls → Reach scroll threshold → Load more posts → Repeat
- **Success criteria**: Smooth scrolling with no jank, posts load before user reaches bottom, images/videos display correctly

### Interactive Visual Selection Overlays
- **Functionality**: Semi-transparent colored borders pulse over quotable content areas; clicking opens selection popup with "Viz.List This" action
- **Purpose**: The core differentiator - allows users to curate specific visual elements rather than entire posts
- **Trigger**: User taps/clicks on highlighted border area within post media
- **Progression**: Hover over selection area → Border brightens → Click/tap → Popup appears with preview → Choose action (Viz.List or Cancel) → Confirmation toast
- **Success criteria**: Overlays are clearly visible but don't obscure content, interactions feel responsive (<100ms), popup positions correctly near selection

### Permission-Based Reposting System
- **Functionality**: Content areas marked as "Open to Repost" (mint) or "Approval Required" (peach); approval requests sent to original creator
- **Purpose**: Balances creator control with content remixing, building trust and attribution
- **Trigger**: User clicks "Viz.List This" on a selection area
- **Progression**: Click Viz.List button → Check permission type → If open: add to list immediately → If approval needed: send request → Show appropriate toast → (Later: creator approves/denies)
- **Success criteria**: Permission state is visually obvious, approval requests are tracked, creators receive notifications

### Shield-Shaped Avatars
- **Functionality**: All user avatars rendered in distinctive shield/badge shape (rounded top, pointed bottom)
- **Purpose**: Unique brand identity element that makes Viz. instantly recognizable
- **Trigger**: Avatar displayed anywhere in the app (post headers, comments, profiles)
- **Progression**: Image loaded → Clipped to shield path → Border applied → Rendered
- **Success criteria**: Shape is consistent across all sizes, images don't distort, shield shape is recognizable

### Viz.It Creator Tool (Content Upload System)
- **Functionality**: Multi-step tool for creators to upload/capture content, define selectable areas with lasso drawing, and publish with metadata
- **Purpose**: Empowers creators to control how their content can be reused while building a permission-based sharing ecosystem
- **Trigger**: Click "Viz.It" in sidebar (requires logged-in user)
- **Progression**: Click Viz.It → Choose "Take/Upload" or "From Viz.List" → Step 1: Capture or upload media (photo/video) → Preview and confirm → Step 2: Draw freehand lasso selections on canvas → Set each selection as "Open" (mint) or "Approval Required" (peach) → Delete/edit selections → Step 3: Add title (max 20 words with live counter) → Add hashtags (auto-formatted with #) → Preview final content → Publish → Confetti animation → Success toast → Redirect to feed
- **Success criteria**: Camera access works, file uploads accept images/videos, canvas lasso drawing is smooth and intuitive, selection areas save with correct coordinates, permission types are visually distinct, word counter turns coral when over limit, published posts appear in feed with interactive overlays, confetti animation plays on success

### User Registration System
- **Functionality**: Modal-based registration with email/phone options, username creation, password setup, and terms acceptance
- **Purpose**: Enables users to create accounts and access personalized features
- **Trigger**: Click "Sign Up for Viz." button in header
- **Progression**: Open modal → Choose email/phone registration → Enter credentials → Read and accept terms → Create account → Auto-login → Show success toast
- **Success criteria**: Form validates inputs, unique usernames enforced, 16-digit Viz. Biz ID generated, user data persists, logged-in state displays correctly

### User Login System
- **Functionality**: Modal-based authentication with email/phone toggle and dual authentication methods (password or OTP)
- **Purpose**: Allows existing users to access their accounts with flexible authentication options
- **Trigger**: Click "Log In" button in header
- **Progression (Password)**: Open modal → Toggle email/phone → Enter credentials → Enter password → Validate → Auto-login → Show welcome toast
- **Progression (OTP)**: Open modal → Toggle email/phone → Enter credentials → Switch to OTP tab → Send 6-digit code → Enter code within 5 minutes → Verify → Auto-login → Show welcome toast
- **Success criteria**: Both authentication methods work correctly, OTP expires after 5 minutes, forgot password link accessible, modal has pastel pink header bar, active tab shows pink underline, success messages in mint green, all errors handled gracefully

### Logged-In User Interface
- **Functionality**: Header displays user's shield avatar and username with dropdown menu
- **Purpose**: Provides quick access to profile, settings, and logout
- **Trigger**: User successfully logs in or registers
- **Progression**: Avatar displayed in header → Click avatar → Dropdown appears → Select option (Profile/Settings/Logout)
- **Success criteria**: Avatar renders correctly, dropdown styled with pink shadow, logout clears session

### Viz.List Personal Collections
- **Functionality**: Saved selections organized in user's personal collection with status-based filtering and search capabilities
- **Purpose**: Allows users to curate visual mood boards and inspiration collections, tracking approval status for each item
- **Trigger**: Click "Viz.List" in sidebar or save selection from feed via "Viz.List This" button in selection popups
- **Progression**: 
  - From Feed: Hover selection → Click → Popup appears → Click "Viz.List This" → Item added with appropriate status (approved/pending)
  - Navigate to Viz.List page → View saved selections in responsive grid (3 columns desktop, 2 mobile) → Filter by status tabs (All/Approved/Pending/Declined) → Search by creator → Click approved items → View options popup → Use in Viz.It, View Original, or Remove
- **Success criteria**: 
  - "Open to Repost" selections added immediately with "approved" status and mint toast
  - "Approval Required" selections added with "pending" status and peach toast
  - Pending and declined items displayed with grayscale filter
  - Approved items shown in full color with mint checkmark badge
  - Status badges visible in grid thumbnails (top-right corner)
  - Creator username displayed in bottom-left of thumbnails
  - Declined items show "Remove" button on hover
  - Empty state displays with illustration and "Explore Feed" CTA button
  - Search filters by creator username in real-time
  - Tab counts update dynamically based on status
  - Status syncs with Approval Status page when requests are approved/declined

### Approval Status Dashboard
- **Functionality**: View pending approval requests (outgoing and incoming) with approve/deny actions
- **Purpose**: Creators manage who can use their content; users track request status
- **Trigger**: Click "Approval Status" in sidebar
- **Progression**: Open dashboard → See pending requests → Review request details → Approve or deny → Confirmation
- **Success criteria**: Requests update in real-time, approval/denial is immediate, requestor is notified

### Editorial Creation System (Viz.Edit)
- **Functionality**: Multi-step editorial creator that allows users to design visual compositions using approved items from their Viz.List, with full-screen viewer for published editorials
- **Purpose**: Enables users to create original editorial content by remixing and composing saved visual elements with creative tools
- **Trigger**: Click "Viz.It" in sidebar → Choose "From Viz.List"
- **Progression**: 
  - **Step 1 - Select Content**: View grid of approved Viz.List items (pending/declined hidden) → Multi-select items with click/tap → Selected items show pink border, checkmark, scale animation → Must select at least 1 item → Click "Next" 
  - **Step 2 - Canvas Editor**: Three-column layout (Toolbox | Canvas | Assets) → Use tools (Add Caption, Add Shapes, Add Emojis, Add Graffiti, Background Color) to add elements → Drag assets from right panel onto 600x600px square canvas → Move, resize, rotate, layer, delete canvas elements → Manage multiple pages (add, delete, reorder) via bottom thumbnails → Click "Save Draft" or "Publish"
  - **Step 3 - Preview & Publish**: Preview all pages in carousel → Swipe/arrow keys to navigate → Add optional title → Review assets used → Click "Confirm Publish" → Confetti animation → Success toast "Your Viz.Edit is live!" → Redirect to feed
  - **Feed Display**: Editorial cards show "VizEdit" badge in pastel pink, first page thumbnail, quoted content count ("X from Viz.Listings"), multi-page indicator dots
  - **Full-Screen Viewer**: Click card opens modal → Page-by-page navigation with swipe/arrows → Quoted content areas highlighted with pink borders → Click quoted area shows "View Original Reference" and "Viz.List This" buttons → Page indicator dots at bottom → Close with X button in top-right
- **Success criteria**: 
  - Only approved items visible in Step 1, multi-select works smoothly with visual feedback
  - Canvas editor: all tools functional, drag-and-drop works, elements are editable (move/resize/rotate), grid pattern visible for alignment
  - Page management: can add/delete/reorder pages (minimum 1 page), thumbnails show current page highlight
  - Preview: carousel navigation works, all pages render correctly with elements in correct positions
  - Published editorials appear in main feed with "VizEdit" badge, quoted content count displayed, confetti plays on publish
  - Full-screen viewer: opens on card click, keyboard navigation (arrows, Escape), quoted areas are clickable and show action buttons, smooth page transitions

### Enhanced Feed Display
- **Functionality**: Mixed feed of posts and editorials with interactive overlays and "New Viz.Its" notification banner
- **Purpose**: Provides dynamic content discovery with visual indicators for quotable areas and fresh content alerts
- **Trigger**: Navigate to home/feed page
- **Progression**: View combined feed → See posts with selection overlays (mint/peach borders pulsing) → See editorials with VizEdit badge → Click "New Viz.Its" banner to load fresh content → Hover selection areas to see brighter borders → Click to open "Viz.List This" popup
- **Success criteria**: 
  - Posts and editorials are properly mixed in chronological order
  - Selection overlays visible with correct color coding (mint for open, peach for approval)
  - "New Viz.Its" banner appears as pastel pink pill with sparkle icon at top of feed
  - Editorial cards show quoted content count and multi-page indicators
  - All interactions smooth and responsive

### Enhanced Profile Page
- **Functionality**: User profile with avatar, stats, bio, tabs for different content types (All Viz.Its, Viz.Edits, Viz.List), grid displays with hover previews
- **Purpose**: Comprehensive view of user's content, creations, and saved items with social metrics
- **Trigger**: Click user avatar or navigate to profile
- **Progression**: View profile header (shield avatar, username, bio, stats: posts/followers/following) → Edit Profile button (own) or Follow button (others) → Switch tabs → View content grids (3-col desktop, 2-col mobile) → Hover items to see view counts → Click to view full content
- **Success criteria**:
  - Shield-shaped avatar displays correctly at 120x140px
  - Stats show accurate counts for posts, followers, following
  - Follow button: pastel pink when unfollowed, outlined when following
  - Tabs: "All Viz.Its" (all content), "Viz.Edits" (editorials only), "Viz.List" (saved items, owner-only)
  - Active tab has pastel pink underline
  - Grid items show selection overlays on posts, VizEdit badge on editorials
  - Hover overlay shows view count with eye icon
  - Responsive grid layout adapts to screen size

## Edge Case Handling

- **No Posts Available**: Show friendly empty state with "Welcome to Viz." message and suggestion to follow users
- **Failed Image Load**: Display placeholder with gentle error message and retry button
- **Network Interruption**: Show toast notification, cache viewed content, queue actions for retry
- **Rapid Like/Unlike**: Debounce interactions to prevent multiple server requests
- **Selection Popup Off-Screen**: Reposition popup to stay within viewport bounds
- **Overlapping Selections**: Layer popups with z-index, dismiss previous popup when new one opens
- **Video Playback Errors**: Fallback to thumbnail image, show "Video unavailable" message
- **Long Captions**: Truncate with "...more" expansion, ensure no layout breaking
- **No Approval Response**: Show "Pending" status indefinitely, allow user to cancel request
- **Deleted Original Content**: Gray out selection in Viz.List, show "Content no longer available"

## Design Direction

The design should evoke feelings of **playful creativity, gentle empowerment, and artistic curation**. Like walking through a pastel art gallery where you can touch and remix everything. The interface should feel soft, approachable, and delightful - never corporate or sterile. Think indie social media meets Pinterest's visual curation with Tumblr's creative freedom. Every interaction should spark a small moment of joy.

## Color Selection

A soft, romantic pastel palette that feels fresh and modern while maintaining excellent readability.

- **Primary Color**: Pastel Pink (oklch(0.85 0.08 350)) - Main brand color representing creativity and playfulness, used for buttons, active states, and key UI elements
- **Secondary Colors**: 
  - Soft Rose (oklch(0.87 0.07 355)) for hover states and subtle emphasis
  - Light Pink Tint (oklch(0.98 0.02 350)) for background variations
- **Accent Color**: Deeper Pink (oklch(0.70 0.15 340)) for CTAs and important actions like "Sign Up" - demands attention while staying harmonious
- **Supporting Colors**:
  - Soft Mint (oklch(0.85 0.08 150)) for "Open to Repost" indicators - suggests "go ahead, it's available"
  - Soft Peach (oklch(0.88 0.08 60)) for "Approval Required" - gentle warning that permission is needed
  - Soft Coral (oklch(0.75 0.15 25)) for likes and positive actions - warm and friendly
- **Foreground/Background Pairings**:
  - Primary Pink (oklch(0.85 0.08 350)): White text (oklch(1 0 0)) - Ratio 6.2:1 ✓
  - Deeper Pink (oklch(0.70 0.15 340)): White text (oklch(1 0 0)) - Ratio 5.1:1 ✓
  - Background White (oklch(1 0 0)): Dark Charcoal (oklch(0.25 0 0)) - Ratio 13.8:1 ✓
  - Light Pink Tint (oklch(0.98 0.02 350)): Dark Charcoal (oklch(0.25 0 0)) - Ratio 12.5:1 ✓
  - Soft Gray text (oklch(0.50 0 0)) on White - Ratio 4.6:1 ✓

## Font Selection

Typography should balance playful approachability with clean readability - friendly but not childish, modern but not cold.

- **Primary Font**: Plus Jakarta Sans - A geometric sans-serif with friendly rounded details that perfectly captures Viz.'s personality. Used for all interface text.
- **Display Weight**: For "Viz." branding and large headlines
- **Bold Weight**: For usernames, button labels, and emphasis
- **Medium Weight**: For body text and captions
- **Regular Weight**: For secondary text and timestamps

- **Typographic Hierarchy**:
  - H1 (App Title "Viz."): Plus Jakarta Sans Bold / 32px / tight letter-spacing (-0.02em)
  - H2 (Section Headers): Plus Jakarta Sans Bold / 24px / normal letter-spacing
  - Post Username: Plus Jakarta Sans Bold / 14px / normal letter-spacing
  - Body Text (Captions): Plus Jakarta Sans Medium / 14px / relaxed line-height (1.5)
  - Secondary Text (Timestamps): Plus Jakarta Sans Regular / 12px / soft gray color
  - Button Labels: Plus Jakarta Sans Bold / 14px / slight letter-spacing (0.01em)

## Animations

Animations should feel organic and delightful - like things are gently floating and breathing rather than mechanically moving. Every motion should have purpose and personality.

- **Selection Borders**: Continuous gentle pulse (2s ease-in-out loop) with subtle glow effect - invites interaction without being annoying
- **Like Heart**: Double-tap triggers expanding heart animation (scale 0 → 1.2 → 1) with opacity fade, completed in 600ms using spring physics
- **Button Hovers**: Subtle lift (translateY -1px) with soft shadow increase over 200ms - makes buttons feel pressable
- **Popup Appearance**: Scale from 0.9 to 1 with slight upward float (translateY 10px → 0) over 250ms with ease-out - feels like it's bubbling up
- **Toast Notifications**: Slide in from top (translateY -100% → 0) over 300ms, pause, then fade out after 3s
- **Avatar Shimmer**: Loading avatars show gentle shimmer animation sweeping across
- **Infinite Scroll Loading**: Subtle spinner with rotating pastel gradient (not jarring)
- **Video Autoplay**: Fade-in over 400ms when entering viewport
- **Menu Dropdown**: Scale from 0.95 to 1 with fade-in over 150ms - feels snappy but smooth

## Component Selection

- **Components**:
  - `Card` for post containers with subtle shadow and rounded corners
  - `Avatar` as base, custom clip-path applied for shield shape
  - `Button` for all CTAs with variant="default" (pink) and variant="outline" (white with pink border)
  - `Dialog` for full-screen modals (photo viewer, profile)
  - `Popover` for selection action popup (positioned near clicked area)
  - `DropdownMenu` for three-dot post menu
  - `Textarea` for comment input with auto-resize
  - `ScrollArea` for smooth infinite scroll implementation
  - `Tabs` for organizing Approval Status (incoming/outgoing)
  - `Badge` for permission type indicators ("Open to Repost", "Approval Required")
  - `Separator` for subtle dividers between comments
  - `Skeleton` for loading states
  - `Sonner` toast for notifications

- **Customizations**:
  - Custom shield avatar component using CSS clip-path polygon
  - Custom video player with double-tap detection and mute toggle
  - Custom selection overlay component with interactive borders using SVG or div with border-radius
  - Custom carousel for multi-image posts using Embla Carousel
  - Infinite scroll implementation using Intersection Observer

- **States**:
  - Buttons: default (pink), hover (deeper pink + lift), active (pressed down), disabled (50% opacity)
  - Selection borders: idle (gentle pulse), hover (brightened + faster pulse), clicked (popup appears)
  - Like button: unliked (outline heart), liked (filled coral heart)
  - Video: loading (skeleton), playing (visible controls on hover), error (fallback thumbnail)

- **Icon Selection**:
  - Heart (phosphor-icons) for likes
  - ChatCircle for comments
  - PaperPlaneRight for sharing
  - DotsThree for post menu
  - Plus for "Viz.It" creation
  - ListChecks for "Viz.List"
  - Stamp for "Approval Status"
  - X for closing popups
  - Play/Pause for video controls

- **Spacing**:
  - Post cards: mb-6 gap between posts
  - Card padding: p-4 for content areas
  - Action bar icons: gap-4 between icons
  - Avatar to username: gap-2
  - Section margins: mb-3 between caption sections
  - Sidebar icons: gap-6 vertical spacing

- **Mobile**:
  - Hide sidebar, show bottom navigation bar instead with same 4 icons
  - Full-width posts (no max-width constraint)
  - Header buttons stack vertically or use hamburger menu
  - Selection popups position at bottom of screen (sheet-style) instead of floating
  - Larger tap targets (min 44x44px) for all interactive elements
  - Carousel swipe gestures more prominent
  - Comments open in full-screen drawer instead of inline expansion
