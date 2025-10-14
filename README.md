# DFW7 RME Crit Walk Dashboard

A web application for maintenance technicians at a distribution facility to manage critical equipment inspections ("crit walks"). The system tracks equipment, photo uploads, inspection history, and assignments with color-coded status indicators.

## Features

- **Equipment Management**: Track critical equipment across multiple categories (HVAC, Conveyor, Electrical, Forklift, Dock, Safety)
- **Crit Walk Tracking**: Record inspections with photo uploads, notes, and timestamps
- **Real-time Status Monitoring**: Color-coded status indicators based on time since last inspection
  - Green: ≤ 8 hours
  - Yellow: 8-12 hours
  - Red: > 12 hours
- **Assignment System**: Managers can assign crit walks to specific technicians
- **Failure Tracking**: Document equipment failures and link to work orders
- **Photo Management**: Upload, view, and auto-cleanup of equipment photos (30-day retention)
- **Role-Based Access**: Manager vs Technician permissions
- **Mobile-First Design**: Optimized for on-the-floor use on mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom brand colors
- **Backend**: Firebase
  - Authentication
  - Firestore (NoSQL database)
  - Storage (photo uploads)
  - Hosting
- **Date Handling**: date-fns
- **Forms**: react-hook-form
- **Routing**: react-router-dom v7

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Firebase account with a project configured

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd criwalkdashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_TEAM_LOGIN_EMAIL=dfw7rme@critwalk.com
VITE_TEAM_LOGIN_PASSWORD=dfw7rme
```

4. Configure Firebase (if not already done):
```bash
firebase login
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

## Build & Deployment

### Build for Production
```bash
npm run build
```
This runs TypeScript checks and builds optimized assets to the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

### Deploy to Firebase
```bash
npm run deploy
```
This builds the project and deploys to Firebase Hosting.

### Deploy Specific Firebase Services
```bash
# Hosting only
firebase deploy --only hosting

# Firestore rules only
firebase deploy --only firestore:rules

# Storage rules only
firebase deploy --only storage:rules
```

## Project Structure

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

## Architecture

### Authentication Flow
1. Firebase Authentication with team account
2. User selects their name and role from team list
3. User profile cached in localStorage
4. Role-based access control (Manager vs Technician)

### Data Model
- **Firestore Collections**:
  - `equipment/` - Equipment records
    - `equipment/{id}/critWalks/` - Subcollection of crit walks per equipment
  - `equipmentStatus/` - Separate collection for current status (enables fast queries)
  - `assignments/` - Task assignments to technicians

### State Management
- React Context API for user state
- Custom hooks for Firebase subscriptions
- Real-time updates with Firestore `onSnapshot`

### Storage Structure
Photos: `equipment/{equipmentId}/critwalks/{critWalkId}/{timestamp}_{index}.jpg`

## Brand Colors

The application uses Texas flag-inspired brand colors:

```javascript
brand: {
  blue: '#003F87',        // Primary actions
  red: '#BF0A30',         // Danger/delete
  gear: '#808080',        // Borders/dividers
}
status: {
  green: '#10B981',       // Good status (≤8hrs)
  yellow: '#F59E0B',      // Warning (8-12hrs)
  red: '#EF4444',         // Critical (>12hrs)
  gray: '#6B7280',        // Never completed
}
```

## Contributing

For development guidelines and architecture details, see `CLAUDE.md`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Team

73 team members across maintenance technician and manager roles at DFW7 distribution facility.
