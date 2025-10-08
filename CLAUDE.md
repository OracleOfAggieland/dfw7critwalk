# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DFW7 RME Crit Walk Dashboard - A web application for maintenance technicians at a distribution facility to manage critical equipment inspections ("crit walks"). The system tracks equipment, photo uploads, inspection history, and assignments with color-coded status indicators.

**Tech Stack**: React 18 + TypeScript, Vite, Tailwind CSS, Firebase (Auth, Firestore, Storage, Hosting)

## Development Commands

```bash
# Development
npm run dev              # Start dev server (Vite)

# Build & Deploy
npm run build            # TypeScript check + Vite build → dist/
npm run preview          # Preview production build
npm run deploy           # Build + Firebase deploy (hosting + functions)

# Firebase
firebase login           # Authenticate with Firebase
firebase deploy          # Deploy all (hosting, firestore, storage)
firebase deploy --only hosting          # Deploy hosting only
firebase deploy --only firestore:rules  # Deploy Firestore rules only
firebase deploy --only storage:rules    # Deploy Storage rules only
```

## Architecture & Code Organization

### Authentication Flow
1. **Firebase Auth**: Team account login (`dfw7rme@critwalk.com`)
2. **User Selection**: After Firebase auth, users select name + role from team list
3. **Role-Based Access**: Manager (create equipment, assign) vs Technician (complete crit walks)
4. **Local Storage**: User profile cached in localStorage after selection

### Data Architecture
The app uses **Firebase Firestore** with a denormalized structure for performance:

**Collections**:
- `equipment/` - Equipment records
  - `equipment/{id}/critWalks/` - Subcollection of crit walk records for each equipment
- `equipmentStatus/` - Separate collection tracking current status per equipment (enables fast queries)
- `assignments/` - Task assignments to technicians

**Key Pattern**: Equipment status is maintained separately from equipment records to enable efficient real-time status queries without scanning all crit walk subcollections.

### State Management
- **React Context API**: `UserContext` provides user profile and role checks throughout app
- **Custom Hooks**: `useEquipment`, `useCritWalks`, `useAssignments` encapsulate Firebase subscriptions
- **Real-time Updates**: Most data uses Firestore `onSnapshot` for live updates

### File Organization
```
src/
├── types/           # TypeScript interfaces (equipment, critWalk, user, assignment)
├── services/        # Firebase service layer (auth, equipment, critWalk, storage, assignment)
├── hooks/           # Custom React hooks for data fetching
├── contexts/        # React contexts (UserContext)
├── components/      # Organized by feature (common, equipment, critWalk, assignments)
├── pages/           # Top-level route components
├── utils/           # Pure functions (statusCalculator, dateHelpers)
└── data/            # Static data (teamMembers.ts - 73 team members)
```

### Status Calculation System
Equipment status is dynamically calculated based on time since last crit walk:
- **Green**: ≤ 8 hours since last walk
- **Yellow**: 8-12 hours
- **Red**: > 12 hours
- **Never**: No walks completed

Status colors are brand-aligned (see Brand Colors below).

## Development Philosophy

**From `technicaldocs/developmentPhilosophy.txt`**:

- **Minimal Scope**: Every enhancement should contain only what's needed. Build the leanest possible version to deliver value.
- **Vertical Slicing**: Implement features end-to-end through necessary layers before considering downstream systems.
- **YAGNI Principle**: Build only what is required now, not what might be needed later.
- **Single-Focus Specs**: One core requirement per spec. Additional needs documented separately.
- **Simple Solutions**: Prioritize straightforward approaches over complex ones.
- **Minimal Dependencies**: Avoid unnecessary external dependencies.

## Brand & Design System

### Brand Colors
```javascript
brand: {
  blue: '#003F87',        // Texas flag blue - primary actions
  red: '#BF0A30',         // Texas flag red - danger/delete
  gear: '#808080',        // Gear gray - borders/dividers
  'blue-light': '#1E5BA8',
  'red-light': '#D93A3A',
}
status: {
  green: '#10B981',       // Good status (≤8hrs)
  yellow: '#F59E0B',      // Warning (8-12hrs)
  red: '#EF4444',         // Critical (>12hrs)
  gray: '#6B7280',        // Never completed
}
```

### Tailwind Utility Classes
The project defines custom component classes in `src/index.css`:
- `.btn-primary`, `.btn-secondary`, `.btn-danger` - Button styles
- `.input-field` - Form input styling
- `.card`, `.card-hover` - Card containers
- `.badge-{color}` - Status badges

**Always use these predefined classes** instead of inline Tailwind utilities for consistency.

## Firebase Configuration

### Environment Variables
Required in `.env`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_TEAM_LOGIN_EMAIL=dfw7rme@critwalk.com
VITE_TEAM_LOGIN_PASSWORD=dfw7rme
```

### Firestore Security
- All collections require authentication (`request.auth != null`)
- No granular role-based rules (role enforcement in client only)
- Crit walks stored as subcollections under equipment

### Storage Structure
Photos stored at: `equipment/{equipmentId}/critwalks/{critWalkId}/{timestamp}_{index}.jpg`

## Key Implementation Details

### Photo Upload Flow
1. User selects photos in `PhotoUpload` component
2. `CritWalkForm` submits with photo File[] array
3. `createCritWalk` service creates placeholder doc to get ID
4. `uploadMultiplePhotos` uploads to Storage with crit walk ID
5. Crit walk doc updated with photo URLs
6. `equipmentStatus` collection updated with completion timestamp

### Real-time Status Updates
The `useEquipment` hook subscribes to both `equipment` and `equipmentStatus` collections, calculates current status in real-time based on `lastCritWalkAt` timestamp, and provides a Map of statuses by equipment ID.

### Mobile-First Design
Per `MOBILE_FIRST_DESIGN.md`, all components should be mobile-optimized first, with progressive enhancement for larger screens. Use Tailwind's responsive prefixes (`md:`, `lg:`).

## Common Development Tasks

### Adding a New Equipment Field
1. Update `Equipment` interface in `src/types/equipment.types.ts`
2. Add field to `EquipmentForm.tsx` form
3. Update `createEquipment` in `equipment.service.ts`
4. Display in `EquipmentCard.tsx` and `EquipmentDetail.tsx`

### Adding a New Service Function
Services follow consistent patterns:
- Import Firestore functions at top
- Define collection constants
- Export async functions with try/catch error handling
- Log errors with `console.error`
- Throw user-friendly error messages

### Updating Firestore Rules
1. Edit `firestore.rules`
2. Deploy with `firebase deploy --only firestore:rules`
3. Test rules in Firebase Console → Firestore → Rules playground

## Team Data

73 team members defined in `src/data/teamMembers.ts` (alphabetically sorted). Equipment categories: HVAC, Conveyor System, Electrical, Forklift, Dock Equipment, Safety Equipment, Other.

## Important Notes

- **TypeScript**: Project uses TypeScript strict mode. All new code must be typed.
- **Date Handling**: Use `date-fns` for formatting (imported in `dateHelpers.ts`). Firebase Timestamps must be converted with `.toDate()`.
- **Form Validation**: Use `react-hook-form` with inline validation rules.
- **No Routing Library**: Currently using `react-router-dom` v7 with nested Routes.
- **Build Output**: Vite builds to `dist/` directory (configured in `vite.config.ts`)
