# DFW7 Crit Walk Dashboard - Technical Buildout Plan

> **🚨 MOBILE-FIRST DESIGN REQUIRED 🚨**
>
> **Primary Use Case**: Technicians conducting crit walks ON-SITE using their PHONES
> - Must work perfectly on iPhone and Android
> - Camera integration is CRITICAL
> - All touch targets minimum 48px
> - One-handed operation required
> - Desktop is secondary/enhanced experience
>
> See `MOBILE_FIRST_DESIGN.md` for detailed guidelines

---

## Project Overview

**Project Name**: DFW7 RME Crit Walk Dashboard
**Purpose**: Web application for maintenance technicians to manage critical equipment inspections
**Brand**: DFW7 RME (Reliability Maintenance Engineering)
**Tech Stack**: React 18 + TypeScript + Vite + Firebase + Tailwind CSS
**Design Approach**: **Mobile-First** (phones primary, desktop enhanced)

---

## Firebase Project Configuration

### Firebase Project Details
- **Project ID**: `df7critwalk`
- **Auth Domain**: `df7critwalk.firebaseapp.com`
- **Storage Bucket**: `df7critwalk.firebasestorage.app`
- **API Key**: `AIzaSyCWrZs6QHXq8iX8bdraZflVBdXEBsTDxlo`
- **App ID**: `1:952501056539:web:a21d184f5d75f11cfbf4be`
- **Messaging Sender ID**: `952501056539`
- **Measurement ID**: `G-XM4JETK8FM`

### Firebase Services Enabled
- ✅ Firebase Authentication (Email/Password)
- ✅ Cloud Firestore (Database)
- ✅ Firebase Storage (Photo storage)
- ✅ Firebase Hosting (Web hosting)
- ✅ Firebase Analytics

### Team Login Credentials
- **Email**: `dfw7rme@critwalk.com`
- **Password**: `dfw7rme`

---

## Development Philosophy Adherence

- [ ] Maintain **minimal scope** - only essential features
- [ ] Follow **vertical slicing** - implement features end-to-end
- [ ] Avoid **over-engineering** and premature optimization
- [ ] Keep **code simple and readable**
- [ ] Use **intuitive structure** for easy navigation
- [ ] Maintain **clean separation of concerns**
- [ ] Minimize **external dependencies**

---

## Phase 1: Project Setup & Configuration

### 1.1 Initialize React Project
- [x] Run `npm create vite@latest . -- --template react-ts` in current directory
- [x] Install core dependencies: `npm install`
- [x] Install Firebase: `npm install firebase`
- [x] Install React Router: `npm install react-router-dom`
- [x] Install date-fns: `npm install date-fns`
- [x] Install React Hook Form: `npm install react-hook-form`
- [x] Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer`
- [x] Initialize Tailwind: `npx tailwindcss init -p`

### 1.2 Configure Tailwind CSS
- [x] Update `tailwind.config.js` with DFW7 brand colors
  - [x] Add brand blue: `#003F87`
  - [x] Add brand red: `#BF0A30`
  - [x] Add brand gear gray: `#808080`
  - [x] Add status colors (green, yellow, red, gray)
- [x] Create `src/index.css` with Tailwind directives
- [x] Add custom CSS classes for buttons, inputs, cards, badges

### 1.3 Firebase Configuration
- [x] Install Firebase CLI globally: `npm install -g firebase-tools`
- [x] Login to Firebase: `firebase login`
- [x] Initialize Firebase: `firebase init`
  - [x] Select Firestore
  - [x] Select Storage
  - [x] Select Hosting
  - [x] Set public directory to `dist`
  - [x] Configure as SPA (Single Page App)

### 1.4 Environment Configuration
- [x] Create `.env` file with Firebase credentials
  - [x] `VITE_FIREBASE_API_KEY=AIzaSyCWrZs6QHXq8iX8bdraZflVBdXEBsTDxlo`
  - [x] `VITE_FIREBASE_AUTH_DOMAIN=df7critwalk.firebaseapp.com`
  - [x] `VITE_FIREBASE_PROJECT_ID=df7critwalk`
  - [x] `VITE_FIREBASE_STORAGE_BUCKET=df7critwalk.firebasestorage.app`
  - [x] `VITE_FIREBASE_MESSAGING_SENDER_ID=952501056539`
  - [x] `VITE_FIREBASE_APP_ID=1:952501056539:web:a21d184f5d75f11cfbf4be`
  - [x] `VITE_TEAM_LOGIN_EMAIL=dfw7rme@critwalk.com`
  - [x] `VITE_TEAM_LOGIN_PASSWORD=dfw7rme`
- [x] Create `.env.example` for documentation
- [x] Add `.env` to `.gitignore`

### 1.5 Logo Setup
- [x] Convert `RMELogo.png` to SVG format (using PNG for now)
- [x] Create `src/assets/` directory
- [x] Save logo as `src/assets/logo.png`
- [x] Create `src/assets/Logo.tsx` component wrapper
  - [x] Support small, medium, large sizes
  - [x] Accept className prop for customization

---

## Phase 2: Project Structure Setup

### 2.1 Create Directory Structure
- [x] Create `src/components/common/` directory
- [x] Create `src/components/equipment/` directory
- [x] Create `src/components/critWalk/` directory
- [x] Create `src/components/assignments/` directory
- [x] Create `src/pages/` directory
- [x] Create `src/services/` directory
- [x] Create `src/hooks/` directory
- [x] Create `src/contexts/` directory
- [x] Create `src/types/` directory
- [x] Create `src/data/` directory
- [x] Create `src/utils/` directory

---

## Phase 3: Core Type Definitions

### 3.1 User Types
- [x] Create `src/types/user.types.ts`
- [x] Define `Role` type: `'manager' | 'technician'`
- [x] Define `UserProfile` interface
  - [x] name: string
  - [x] role: Role
  - [x] timestamp: number

### 3.2 Equipment Types
- [x] Create `src/types/equipment.types.ts`
- [x] Define `Equipment` interface
  - [x] id, name, description, location, category
  - [x] createdBy, createdAt, isActive
  - [x] critWalkInterval, expectedPhotoCount
  - [x] photoGuidelines (optional), tags (optional)
- [x] Define `EquipmentStatus` interface
  - [x] lastCritWalkAt, lastCritWalkBy, nextDueBy
  - [x] status: 'green' | 'yellow' | 'red' | 'never'
  - [x] totalWalksCompleted
- [x] Define `EquipmentFormData` interface

### 3.3 Crit Walk Types
- [x] Create `src/types/critWalk.types.ts`
- [x] Define `CritWalkPhoto` interface
  - [x] storageUrl, thumbnailUrl (optional), uploadedAt
- [x] Define `CritWalk` interface
  - [x] id, equipmentId, equipmentName
  - [x] technicianName, completedAt
  - [x] notes (optional), photos array
- [x] Define `CritWalkFormData` interface

### 3.4 Assignment Types
- [x] Create `src/types/assignment.types.ts`
- [x] Define `AssignmentStatus` type
- [x] Define `Assignment` interface
- [x] Define `AssignmentFormData` interface

---

## Phase 4: Team Members Data

### 4.1 Team Members List
- [x] Create `src/data/teamMembers.ts`
- [x] Add all 73 team members (sorted alphabetically)
  - [x] Aaron Burke through Zachary Porter
- [x] Export `TEAM_MEMBERS` array
- [x] Export `EQUIPMENT_CATEGORIES` array
  - [x] HVAC, Conveyor System, Electrical, Forklift
  - [x] Dock Equipment, Safety Equipment, Other

---

## Phase 5: Firebase Service Layer

### 5.1 Firebase Initialization
- [x] Create `src/services/firebase.ts`
- [x] Import and initialize Firebase app with env variables
- [x] Export `auth` instance (Firebase Authentication)
- [x] Export `db` instance (Firestore)
- [x] Export `storage` instance (Firebase Storage)

### 5.2 Authentication Service
- [x] Create `src/services/auth.service.ts`
- [x] Implement `loginAsTeam()` function
  - [x] Use team credentials from env variables
  - [x] Return success/error status
- [x] Implement `logout()` function
  - [x] Sign out from Firebase
  - [x] Clear localStorage userProfile

### 5.3 Equipment Service
- [x] Create `src/services/equipment.service.ts`
- [x] Implement `createEquipment(data, createdBy)`
  - [x] Add to 'equipment' collection
  - [x] Initialize equipment status document
- [x] Implement `getAllEquipment()`
  - [x] Query active equipment only
  - [x] Order by createdAt desc
- [x] Implement `getEquipmentById(id)`
- [x] Implement `updateEquipment(id, data)`
- [x] Implement `deleteEquipment(id)` - soft delete
- [x] Implement `getEquipmentStatus(equipmentId)`
- [x] Implement `getAllEquipmentStatuses()`
  - [x] Return Map<string, EquipmentStatus>

### 5.4 Storage Service
- [x] Create `src/services/storage.service.ts`
- [x] Implement `uploadPhoto(equipmentId, critWalkId, photo, index)`
  - [x] Upload to `equipment/{equipmentId}/critwalks/{critWalkId}/` path
  - [x] Return download URL
- [x] Implement `uploadMultiplePhotos(equipmentId, critWalkId, photos[])`
  - [x] Use Promise.all for parallel uploads
- [x] Add placeholder for `optimizeImage()` (future enhancement)

### 5.5 Crit Walk Service
- [x] Create `src/services/critWalk.service.ts`
- [x] Implement `createCritWalk(data, technicianName, equipmentName)`
  - [x] Create document in equipment/{id}/critWalks subcollection
  - [x] Upload photos via storage service
  - [x] Update document with photo URLs
  - [x] Update equipment status
- [x] Implement `updateEquipmentStatus(equipmentId, technicianName)`
  - [x] Update lastCritWalkAt, lastCritWalkBy
  - [x] Set status to 'green'
  - [x] Increment totalWalksCompleted
- [x] Implement `getCritWalksByEquipment(equipmentId, limit)`
  - [x] Order by completedAt desc

### 5.6 Assignment Service
- [x] Create `src/services/assignment.service.ts`
- [x] Implement `createAssignment(data, assignedBy, equipmentName)`
- [x] Implement `getAssignmentsByTechnician(technicianName)`
- [x] Implement `getAllAssignments()`
- [x] Implement `completeAssignment(assignmentId, critWalkId)`

---

## Phase 6: Utility Functions

### 6.1 Status Calculator
- [x] Create `src/utils/statusCalculator.ts`
- [x] Implement `calculateStatus(lastCritWalkAt, critWalkInterval)`
  - [x] Return 'never' if no walks
  - [x] Return 'green' if ≤ 8 hours
  - [x] Return 'yellow' if ≤ 12 hours
  - [x] Return 'red' if > 12 hours
- [x] Implement `getStatusColor(status)` - background color class
- [x] Implement `getStatusBorderColor(status)` - border color class
- [x] Implement `getStatusTextColor(status)` - text color class
- [x] Implement `getStatusBgClass(status)` - background class

### 6.2 Date Helpers
- [x] Create `src/utils/dateHelpers.ts`
- [x] Implement `formatTimestamp(timestamp)` - formatted date string
- [x] Implement `formatTimeAgo(timestamp)` - relative time (e.g., "2 hours ago")
- [x] Implement `getHoursSince(timestamp)` - numeric hours difference

---

## Phase 7: Context & Hooks

### 7.1 User Context
- [x] Create `src/contexts/UserContext.tsx`
- [x] Define `UserContextType` interface
  - [x] userProfile, isManager, isTechnician
- [x] Create `UserProvider` component
- [x] Create `useUser()` hook with error handling

### 7.2 Equipment Hook
- [x] Create `src/hooks/useEquipment.ts`
- [x] Implement real-time listener for equipment collection
- [x] Implement real-time listener for equipmentStatus collection
- [x] Calculate current status on each status update
- [x] Return { equipment, statuses, loading }

---

## Phase 8: Component Development

**MOBILE-FIRST DESIGN**: Primary users are technicians on phones conducting crit walks on-site.
All components must be optimized for touch, camera access, and one-handed operation.

### 8.1 Common Components
- [x] Create `src/components/common/LoadingSpinner.tsx`
  - [x] Centered spinner with brand-blue color
  - [x] Large enough to see on mobile (min 48px)
- [x] Create `src/components/common/StatusBadge.tsx`
  - [x] Color-coded status indicator
  - [x] Support small, medium, large sizes
  - [x] **Mobile**: Use icons + color (not just color alone)
  - [x] **Mobile**: Large badges on equipment cards (24px+ height)
- [x] Create `src/components/common/Modal.tsx`
  - [x] Backdrop, header with title, body, close button
  - [x] Support small, medium, large sizes
  - [x] **Mobile**: Full-screen on phones, centered on desktop
  - [x] **Mobile**: Large X button for closing (min 44x44px)
- [x] Create `src/components/common/Button.tsx`
  - [x] Support primary, secondary, danger variants
  - [x] Support fullWidth prop
  - [x] Disabled state styling
  - [x] **Mobile**: Minimum 48px height (touch target)
  - [x] **Mobile**: 18px font size for readability
  - [x] **Mobile**: Full width by default, auto on md+ breakpoint

### 8.2 User Selection Component
- [x] Create `src/components/UserSelection.tsx`
- [x] Add logo display (large, centered)
- [x] Add searchable name dropdown
  - [x] Filter team members by search term
  - [x] Select name from list
  - [x] **Mobile**: Use native HTML datalist or large searchable list
  - [x] **Mobile**: Large tap targets for each name (min 48px height)
  - [x] **Mobile**: Auto-focus search input, bring up keyboard
- [x] Add role selection (technician vs manager)
  - [x] Clear descriptions for each role
  - [x] Visual distinction (blue for tech, red for manager)
  - [x] **Mobile**: Large card-style buttons (min 80px height)
  - [x] **Mobile**: Full width cards, stack vertically
- [x] Save profile to localStorage on continue
- [x] Call onUserSelected callback
- [x] **Mobile**: Bottom-anchored "Continue" button (always visible)

### 8.3 Equipment Components
- [x] Create `src/components/equipment/EquipmentCard.tsx`
  - [x] Display name, location, description
  - [x] Show status badge with border color
  - [x] Display category and last walk time
  - [x] Clickable card with hover effect
  - [x] **Mobile**: Full width cards, min 120px height
  - [x] **Mobile**: Large colored left border (8px) for status
  - [x] **Mobile**: 18px font for equipment name
  - [x] **Mobile**: Entire card is tap target (min 48px)
- [x] Create `src/components/equipment/EquipmentGrid.tsx`
  - [x] Display all equipment in grid layout
  - [x] Filter by status (all, green, yellow, red, never)
  - [x] Show "Create Equipment" button for managers
  - [x] Handle card clicks to navigate to detail page
  - [x] Integrate EquipmentForm in modal
  - [x] **Mobile**: Single column layout (grid-cols-1)
  - [x] **Mobile**: Sticky search bar at top
  - [x] **Mobile**: Horizontal scrollable filter chips
  - [x] **Mobile**: Floating "+" button (bottom-right, managers only)
  - [x] **Desktop**: Multi-column grid (md:grid-cols-2 lg:grid-cols-3)
- [x] Create `src/components/equipment/EquipmentForm.tsx`
  - [x] Form fields: name, description, location, category
  - [x] Interval and photo count inputs
  - [x] Photo guidelines textarea
  - [x] Validation with react-hook-form
  - [x] Submit handler with error handling
  - [x] **Mobile**: Single column layout, full width inputs
  - [x] **Mobile**: Large native select for category dropdown
  - [x] **Mobile**: Appropriate keyboard types (number for intervals)

### 8.4 Crit Walk Components
- [x] Create `src/components/critWalk/PhotoUpload.tsx`
  - [x] File input with preview grid
  - [x] Multiple photo selection
  - [x] Remove photo functionality
  - [x] Max photos limit (default 10)
  - [x] Image preview thumbnails
  - [x] **Mobile CRITICAL**: Use `capture="environment"` attribute for direct camera access
  - [x] **Mobile**: Large "📷 Take Photo" button (min 80px height, full width)
  - [x] **Mobile**: Photo preview grid (2 columns max on mobile)
  - [x] **Mobile**: Large X button on each thumbnail for removal (44x44px)
  - [x] **Mobile**: Progress indicator "Photos: 2/3 required"
- [x] Create `src/components/critWalk/CritWalkForm.tsx`
  - [x] Photo upload component integration
  - [x] Notes textarea
  - [x] Validation (at least 1 photo required)
  - [x] Submit handler with loading state
  - [x] **Mobile**: Photo upload as primary action (top of form)
  - [x] **Mobile**: Large textarea for notes (min 4 rows, 16px font)
  - [x] **Mobile**: Bottom-anchored submit button (always visible)
  - [x] **Mobile**: Show photo guidelines BEFORE opening camera
- [x] Create `src/components/critWalk/CritWalkHistory.tsx`
  - [x] Load and display crit walks for equipment
  - [x] Show technician name, timestamp
  - [x] Display photos in grid
  - [x] Show notes if present
  - [x] Click photo to open full size
  - [x] **Mobile**: Timeline vertical layout (not grid)
  - [x] **Mobile**: Collapsible cards (tap to expand photos)
  - [x] **Mobile**: Lazy load older entries
  - [x] **Mobile**: Photo grid (2 columns max on mobile)

---

## Phase 9: Pages

**MOBILE-FIRST LAYOUT**: All pages must work perfectly on phones first, enhance for desktop.

### 9.1 Login Page
- [x] Create `src/pages/Login.tsx`
- [x] Display logo (large, centered)
- [x] Password input field
- [x] Validate password matches env variable
- [x] Call loginAsTeam() on submit
- [x] Show error message on failure
- [x] Loading state during authentication
- [x] **Mobile**: 16px+ font size on input (prevents iOS zoom)
- [x] **Mobile**: Full-screen centered layout
- [x] **Mobile**: Large login button (min 56px height)

### 9.2 Dashboard Page
- [x] Create `src/pages/Dashboard.tsx`
- [x] Render EquipmentGrid component
- [x] Simple wrapper page
- [x] **Mobile**: Full width, edge-to-edge equipment cards
- [x] **Mobile**: Pull-to-refresh support (future enhancement)

### 9.3 Equipment Detail Page
- [x] Create `src/pages/EquipmentDetail.tsx`
- [x] Load equipment by ID from URL params
- [x] Display equipment details card
  - [x] Name, location, status badge
  - [x] Category, last walk, total walks
  - [x] Description, photo guidelines
- [x] Show "Complete Crit Walk" button for technicians
- [x] Render CritWalkHistory component
- [x] Integrate CritWalkForm in modal
- [x] Refresh data after crit walk completion
- [x] **Mobile**: Hero section with large equipment name
- [x] **Mobile**: Photo guidelines in prominent callout box
- [x] **Mobile**: Bottom-anchored "Complete Crit Walk" button (sticky)
- [x] **Mobile**: Full-screen modal for crit walk form
- [x] **Mobile**: Swipeable photo gallery in history

### 9.4 Layout Component
- [x] Create `src/components/Layout.tsx`
- [x] Header with logo, title, user info
  - [x] Click logo/title to navigate to dashboard
  - [x] Display user name and role badge
  - [x] "Change User" button
  - [x] "Logout" button (red, brand color)
- [x] Main content area with max-width container
- [x] Footer with DFW7 RME branding
- [x] **Mobile**: Compact header (logo icon only, not full logo)
- [x] **Mobile**: Hamburger menu for user actions
- [x] **Mobile**: Bottom navigation bar for primary actions
- [x] **Mobile**: Hide footer on small screens (more screen space)
- [x] **Desktop**: Full header with logo, expanded nav

---

## Phase 10: Main App & Routing

### 10.1 App Component
- [x] Create `src/App.tsx`
- [x] Set up BrowserRouter
- [x] Add auth state listener
  - [x] Track isAuthenticated
  - [x] Load userProfile from localStorage
- [x] Implement routing logic
  - [x] Not authenticated → Login page
  - [x] Authenticated, no profile → User selection
  - [x] Authenticated with profile → Dashboard/Equipment routes
- [x] Implement handleUserSelected callback
- [x] Implement handleChangeUser callback
- [x] Show loading spinner during auth check

### 10.2 Main Entry Point
- [x] Create/Update `src/main.tsx`
- [x] Render App in React StrictMode
- [x] Import index.css

---

## Phase 11: Firestore Security Rules

### 11.1 Configure Firestore Rules
- [x] Create/Update `firestore.rules`
- [x] Add authentication check function
- [x] Allow read/write to `equipment` collection (authenticated)
- [x] Allow read/write to `equipment/{id}/critWalks` subcollection
- [x] Allow read/write to `equipmentStatus` collection
- [x] Allow read/write to `assignments` collection
- [x] Deploy rules: `firebase deploy --only firestore:rules`

---

## Phase 12: Storage Security Rules

### 12.1 Configure Storage Rules
- [x] Create/Update `storage.rules`
- [x] Allow authenticated users to read/write photos
  - [x] Path: `equipment/{equipmentId}/critwalks/{critWalkId}/{filename}`
- [x] Deploy rules: `firebase deploy --only storage`

---

## Phase 13: Build & Deploy Configuration

### 13.1 Vite Configuration
- [x] Create/Update `vite.config.ts`
- [x] Set output directory to `dist`
- [x] Disable sourcemaps for production

### 13.2 Firebase Hosting Configuration
- [x] Create/Update `firebase.json`
- [x] Set public directory to `dist`
- [x] Add SPA rewrite rule (all routes → index.html)
- [x] Configure Firestore, Storage, Hosting

### 13.3 Package Scripts
- [x] Add `"dev": "vite"` script
- [x] Add `"build": "tsc && vite build"` script
- [x] Add `"preview": "vite preview"` script
- [x] Add `"deploy": "npm run build && firebase deploy"` script

---

## Phase 14: Testing & Quality Assurance

### 14.1 Authentication Flow
- [ ] Test login with team password (dfw7rme)
- [ ] Test logout functionality
- [ ] Test user selection from all 73 members
- [ ] Test "Change User" functionality
- [ ] Verify localStorage persistence

### 14.2 Manager Workflows
- [ ] Create new equipment as manager
- [ ] Verify equipment appears in dashboard
- [ ] Test all form validations
- [ ] Test equipment detail view
- [ ] Create assignments (if implemented)

### 14.3 Technician Workflows
- [ ] Complete crit walk as technician
- [ ] Upload multiple photos
- [ ] Add notes to crit walk
- [ ] Verify status changes to green
- [ ] Check crit walk appears in history

### 14.4 Status System
- [ ] Verify new equipment shows "never" status (gray)
- [ ] Verify status changes to green after first walk
- [ ] Test status transitions: green → yellow → red
  - [ ] May need to manually adjust Firestore timestamps for testing
- [ ] Verify status colors in cards and badges

### 14.5 UI/UX Testing
- [ ] Verify logo displays correctly on all pages
- [ ] Check brand colors are consistent
- [ ] Test responsive design on mobile devices
- [ ] Verify all navigation links work
- [ ] Test modal open/close behavior
- [ ] Verify form error messages display
- [ ] Check loading states appear correctly

### 14.6 Mobile Device Testing (CRITICAL - Primary Use Case)
- [ ] **iPhone Testing**
  - [ ] Test on iPhone SE (smallest - 375px width)
  - [ ] Test on iPhone 13/14 Pro (standard - 390px width)
  - [ ] Camera access works in Safari
  - [ ] All buttons tappable without zooming
  - [ ] No horizontal scrolling
  - [ ] Forms work with iOS keyboard
  - [ ] Photo upload from camera works
  - [ ] Photo upload from photo library works
- [ ] **Android Testing**
  - [ ] Test on Samsung Galaxy (standard - 360px width)
  - [ ] Camera access works in Chrome
  - [ ] All touch targets are 48px+ (Android guideline)
  - [ ] Native select dropdowns work properly
  - [ ] Back button navigation works
- [ ] **Touch/Interaction Testing**
  - [ ] All buttons minimum 48px height
  - [ ] No accidental taps (proper spacing)
  - [ ] Swipe gestures work (photo gallery)
  - [ ] Pull-to-refresh works (if implemented)
  - [ ] Bottom buttons not hidden by keyboard
- [ ] **Readability Testing**
  - [ ] Text readable without zooming (16px+ body text)
  - [ ] Status colors visible in bright sunlight
  - [ ] High contrast for accessibility (WCAG AA)
- [ ] **Performance Testing on Mobile**
  - [ ] Page load < 3 seconds on 4G
  - [ ] Photo upload works on slow connection
  - [ ] Smooth scrolling in equipment list
  - [ ] No lag when typing in forms
  - [ ] Fast photo capture and preview

### 14.7 Data Integrity
- [ ] Verify photos upload to correct Storage path
- [ ] Check Firestore document structure
- [ ] Verify timestamps are correct
- [ ] Test data consistency after refresh
- [ ] Verify real-time updates work

---

## Phase 15: Deployment

### 15.1 Pre-Deployment Checklist
- [ ] Run `npm run build` successfully
- [ ] Fix any TypeScript errors
- [ ] Verify .env file is NOT committed to git
- [ ] Check .gitignore includes .env
- [ ] Review Firebase rules are deployed
- [ ] Confirm team account exists in Firebase Auth

### 15.2 Deploy to Firebase Hosting
- [ ] Run `npm run deploy`
- [ ] Verify deployment succeeds
- [ ] Test production URL
- [ ] Verify all features work in production

### 15.3 Post-Deployment Testing
- [ ] Test login on production URL
- [ ] Create test equipment
- [ ] Complete test crit walk
- [ ] Verify photos load correctly
- [ ] Check mobile responsiveness
- [ ] Test on different browsers

---

## Phase 16: Documentation & Handoff

### 16.1 User Documentation
- [ ] Document login process
- [ ] Create manager guide (create equipment, assign tasks)
- [ ] Create technician guide (complete crit walks)
- [ ] Document status color meanings
- [ ] Explain photo guidelines

### 16.2 Technical Documentation
- [ ] Document Firebase project structure
- [ ] List all environment variables
- [ ] Explain Firestore collections schema
- [ ] Document Storage bucket structure
- [ ] Create deployment guide

### 16.3 Maintenance Guide
- [ ] How to add new team members
- [ ] How to update Firebase rules
- [ ] How to update brand colors
- [ ] How to modify status thresholds
- [ ] Troubleshooting common issues

---

## Brand Guidelines Reference

### Colors
- **Primary Blue**: `#003F87` (Texas flag blue) - Primary actions, links
- **Primary Red**: `#BF0A30` (Texas flag red) - Danger/delete actions
- **Gear Gray**: `#808080` - Borders, dividers
- **Status Green**: `#10B981` - Good status (≤8 hours)
- **Status Yellow**: `#F59E0B` - Warning (8-12 hours)
- **Status Red**: `#EF4444` - Critical (>12 hours)
- **Status Gray**: `#6B7280` - Never completed

### Typography
- **Font**: System font stack (Apple, Segoe UI, Roboto, etc.)
- **Headings**: Bold, brand colors for emphasis
- **Body**: Gray-900 primary, Gray-600 secondary
- **Labels**: Gray-700, medium weight

### Logo Usage
- Login page: Large (w-32 h-32), centered
- Header: Small (w-12 h-12), left side
- Always use Logo component wrapper

---

## Notes & Considerations

### Performance Optimizations (Future)
- Implement image compression before upload
- Add thumbnail generation for photos
- Implement pagination for crit walk history
- Add caching layer for frequently accessed data

### Feature Enhancements (Future)
- Assignment system for managers
- Push notifications for overdue equipment
- Reports and analytics dashboard
- Export data to CSV/PDF
- Equipment QR code scanning
- Offline mode support

### Security Enhancements (Future)
- Implement role-based access control in Firestore rules
- Add audit logging
- Implement rate limiting
- Add data encryption at rest

---

## Success Criteria

✅ **Complete** when:
1. All checkboxes in Phases 1-15 are checked
2. Application deploys successfully to Firebase Hosting
3. Team can login and select their name
4. Managers can create equipment
5. **Technicians can complete crit walks with photos ON THEIR PHONES**
6. **Camera integration works seamlessly on iOS and Android**
7. **All buttons and touch targets are minimum 48px (thumb-friendly)**
8. **Text is readable without zooming (16px+ body text)**
9. Status colors update correctly based on time
10. All brand colors and logo are consistent
11. **Mobile-first design: App works perfectly on phones, enhanced on desktop**
12. No console errors in production
13. Data persists correctly in Firestore
14. **Photo upload is fast and intuitive on mobile devices**
15. **One-handed operation is comfortable for technicians**

---

**Last Updated**: 2025-10-07 (Updated for mobile-first design)
**Project Status**: Ready for buildout - MOBILE-FIRST APPROACH
**Primary Users**: Technicians using phones for on-site crit walks
**Next Step**: Complete Phase 5 - Firebase Service Layer
