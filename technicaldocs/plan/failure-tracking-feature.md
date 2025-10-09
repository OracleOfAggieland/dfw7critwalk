# Failure Tracking & Work Order System - Implementation Plan

## Overview
Add failure flagging system to crit walks, enabling technicians to identify issues, link work orders, and track resolution status.

---

## User Stories

### Technician Flow
1. **During Crit Walk**: Tech identifies an equipment issue
2. **Flag Failure**: Tech marks crit walk as having a failure
3. **Enter WO**: Tech inputs related Work Order number
4. **Add Notes**: Tech provides details in notes field (existing)
5. **Submit**: Crit walk submitted with failure flag

### Manager Flow
1. **Dashboard View**: Manager sees flagged equipment at a glance
2. **Review Flags**: Manager clicks equipment to see flagged crit walks
3. **Edit Flags**: Manager can modify flag status or WO number
4. **Add Comments**: Manager can comment on crit walk history
5. **Resolve Flag**: Manager marks issue as resolved when WO completed

### General Flow
1. **History View**: Anyone can see flag status in crit walk history
2. **Resolution**: Anyone can resolve a flag once issue is fixed
3. **Audit Trail**: System tracks who resolved flag and when

---

## Data Model Changes

### 1. CritWalk Type (`src/types/critWalk.types.ts`)

**Add to `CritWalk` interface:**
```typescript
export interface CritWalk {
  // ... existing fields

  // Failure tracking
  hasFailure: boolean;                    // Is this a flagged failure?
  workOrderNumber?: string;               // Related WO (optional)
  failureResolvedAt?: Timestamp | null;   // When was issue resolved?
  failureResolvedBy?: string;             // Who resolved it?

  // Comments/discussion
  comments?: CritWalkComment[];           // Array of comments
}

export interface CritWalkComment {
  id: string;
  text: string;
  createdBy: string;
  createdAt: Timestamp;
}
```

### 2. Equipment Status Type (`src/types/equipment.types.ts`)

**Add to `EquipmentStatus` interface:**
```typescript
export interface EquipmentStatus {
  // ... existing fields

  // Active failure tracking
  hasActiveFailure: boolean;              // Does equipment have unresolved failure?
  activeFailureCount: number;             // Number of unresolved failures
  lastFailureAt?: Timestamp | null;       // When was last failure reported?
}
```

---

## UI/UX Changes

### 1. CritWalk Form (`src/components/critWalk/CritWalkForm.tsx`)

**Add after photo upload, before notes:**

```
┌─────────────────────────────────────┐
│ Photos (2/3)                        │
│ [Photo previews]                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ⚠️ Failure Detected?                │
│                                     │
│ ○ No issues (default)               │
│ ● Issue found - requires attention  │
│                                     │
│ [If "Issue found" selected:]        │
│                                     │
│ Work Order Number:                  │
│ ┌─────────────────────────────────┐ │
│ │ WO-12345                        │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Notes (optional)                    │
│ ┌─────────────────────────────────┐ │
│ │ Describe the issue...           │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 2. Equipment Card (`src/components/equipment/EquipmentCard.tsx`)

**Add visual indicator for active failures:**

```
┌────────────────────────────────────────┐
│ 🚨 HVAC Unit #4         [🔴 Active]   │  ← Flag badge
│ Building A - 2nd Floor                 │
│                                        │
│ Last Walk: 2 hours ago                 │
│ ⚠️ 1 unresolved issue - WO-12345       │  ← Failure summary
└────────────────────────────────────────┘
```

### 3. Crit Walk History (`src/components/critWalk/CritWalkHistory.tsx`)

**Show flag status per crit walk:**

```
┌────────────────────────────────────────┐
│ Matt Avila              🚨 FLAGGED     │  ← Flag indicator
│ Oct 08, 2025 10:00 PM                  │
│                                        │
│ ⚠️ Issue: Work Order WO-12345          │
│ All clear                              │
│                                        │
│ [2 photos ▼]                           │
│                                        │
│ 💬 Comments (2)                        │  ← Comments section
│ ┌──────────────────────────────────┐   │
│ │ John Smith - 2 hours ago         │   │
│ │ I'll handle this WO today        │   │
│ └──────────────────────────────────┘   │
│                                        │
│ [✓ Mark as Resolved]  [+ Add Comment] │  ← Actions
└────────────────────────────────────────┘
```

---

## Implementation Phases

### **Phase 1: Data Layer** ✅ COMPLETE
- [x] Update TypeScript interfaces
  - [x] Add failure fields to `CritWalk` type
  - [x] Add `CritWalkComment` interface
  - [x] Update `EquipmentStatus` with failure tracking
- [x] Update Firestore services
  - [x] Modify `createCritWalk` to accept failure data
  - [x] Create `updateCritWalkFailureStatus` function
  - [x] Create `addCritWalkComment` function
  - [x] Update `updateEquipmentStatus` to track active failures
  - [x] Update `equipment.service.ts` to initialize failure fields

### **Phase 2: CritWalk Form** ✅ COMPLETE
- [x] Add failure flag toggle to form
- [x] Add conditional Work Order input field
- [x] Add form validation (WO required if flagged)
- [x] Update form submission to include failure data
- [x] Update equipment status on submission

### **Phase 3: Dashboard Display** ✅ COMPLETE
- [x] Add failure badge to `EquipmentCard`
- [x] Add failure count indicator
- [x] Add visual distinction (red ring around card)
- [x] Status already separate from failure state (no changes needed)
- [ ] Add filter option for "Flagged Equipment" (optional - future enhancement)

### **Phase 4: History View** ✅ COMPLETE
- [x] Add flag indicator to history cards
- [x] Display WO number if present
- [x] Create comment component
- [x] Add "Mark as Resolved" button
- [x] Add "Add Comment" functionality
- [x] Show resolution status and timestamp

### **Phase 5: Manager Features** ✅ COMPLETE
- [x] Add edit flag capability (managers only)
- [x] Add edit WO number capability
- [x] Implement role check for edit permissions
- [x] Add audit trail for who resolved flag (completed in Phase 4)

### **Phase 6: Testing & Polish** ✅ COMPLETE
- [x] Test technician workflow end-to-end
- [x] Test manager workflow
- [ ] Test mobile experience (in progress - user testing)
- [x] Verify Firestore rules allow new fields (no changes needed)
- [x] Update indexes if needed (no new indexes required)
- [x] Deploy to production

---

## Technical Considerations

### Firestore Queries
**New query needed:**
```typescript
// Get all equipment with active failures
const flaggedEquipment = await getDocs(
  query(
    collection(db, 'equipmentStatus'),
    where('hasActiveFailure', '==', true)
  )
);
```

### Firestore Indexes
**Add composite index:**
```json
{
  "collectionGroup": "equipmentStatus",
  "fields": [
    { "fieldPath": "hasActiveFailure", "order": "ASCENDING" },
    { "fieldPath": "lastFailureAt", "order": "DESCENDING" }
  ]
}
```

### Real-time Updates
- Use `onSnapshot` for live failure status updates
- Equipment cards should update immediately when flag is resolved
- History view should reflect comments in real-time

### Security Rules
**Allow authenticated users to update failure status:**
```javascript
// firestore.rules
match /equipment/{equipmentId}/critWalks/{walkId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null;
  allow update: if request.auth != null &&
    request.resource.data.diff(resource.data).affectedKeys()
      .hasOnly(['failureResolvedAt', 'failureResolvedBy', 'comments']);
}
```

---

## Mobile UX Considerations

### Form Design (Mobile-First)
- Large touch targets for failure toggle (min 48px)
- WO input with numeric keyboard for faster entry
- Clear visual feedback when failure is flagged
- Confirmation dialog before submitting flagged walk

### Dashboard Filters
- Swipeable filter chips at top
- "All", "Flagged Only", "Green", "Yellow", "Red"
- Flagged equipment always visible regardless of status

### History Interactions
- Tap flag to expand resolution options
- Bottom sheet for "Add Comment" (native mobile feel)
- Swipe to dismiss resolved flags

---

## Success Metrics

**After Implementation:**
1. 100% of equipment issues linked to Work Orders
2. Reduced time to identify failing equipment
3. Clear audit trail of issue → resolution timeline
4. Improved manager visibility into equipment problems
5. Faster response time to critical failures

---

## Estimated Timeline

**Total: 12-18 hours of development**

- Phase 1: 1-2 hours
- Phase 2: 2-3 hours
- Phase 3: 2-3 hours
- Phase 4: 3-4 hours
- Phase 5: 2-3 hours
- Phase 6: 2-3 hours

**Target Completion:** 2-3 working days (with testing)

---

## Next Steps

1. Review plan with stakeholders
2. Get approval for implementation
3. Begin with Phase 1 (data layer changes)
4. Iterate through phases sequentially
5. Deploy feature-by-feature for testing
6. Gather feedback after Phase 3 (basic functionality)
7. Refine based on real-world usage

---

## Questions to Resolve

- [ ] Should flagged equipment appear at top of dashboard automatically?
- [ ] Should managers receive notifications for new flags?
- [ ] Should there be different severity levels (Critical, Warning, Info)?
- [ ] Should flags auto-expire after a certain time?
- [ ] Should we track multiple WOs per crit walk?
- [ ] Should resolved flags remain visible or be archived?

---

**Document Created:** October 8, 2025
**Author:** Matt Avila
**Status:** Planning Phase
