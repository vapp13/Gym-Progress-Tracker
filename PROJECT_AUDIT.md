# Gym Progress Tracker — Project Audit

**Scope:** This document reflects only what is actually implemented in the codebase as of this review. Nothing here describes planned-but-unbuilt work unless explicitly marked as such.

---

## 1. Architecture Overview

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + Vite 8 (JavaScript, no TypeScript) |
| Routing | React Router 7 (`HashRouter`, required for GitHub Pages static hosting) |
| Backend | None — 100% client-side. No custom server, no Cloud Functions |
| Database | Firebase Firestore (NoSQL, client SDK direct access) |
| Authentication | Firebase Authentication (Google Sign-In only) |
| Hosting | GitHub Pages, deployed via GitHub Actions on push to `main` |
| Charts | Recharts |
| Icons | lucide-react |
| PWA | vite-plugin-pwa (installable, offline app-shell caching) |
| Styling | Plain CSS with custom properties (design tokens), no CSS framework |

There is no backend server, no REST/GraphQL API layer, and no Cloud Functions — every "API endpoint" in this app is a direct Firestore SDK call from the browser, secured entirely by Firestore Security Rules (rules are managed manually in the Firebase Console; there is no `firestore.rules` file checked into this repository).

---

## 2. Features by Module

### 2.1 Authentication (`context/AuthContext.jsx`, `features/auth/`)
- **What it does:** Google Sign-In only, with persisted session across page refreshes.
- **How it works:** `signInWithPopup` with `GoogleAuthProvider`; `onAuthStateChanged` listens for session state on every load. On first-ever sign-in, creates a `users/{uid}` document. On **every** login (new or returning), calls `ensurePublicProfile` to guarantee a `publicProfiles/{uid}` doc exists.
- **Key files:** `AuthContext.jsx`, `ProtectedRoute.jsx` (redirects unauthenticated users to `/login`, renders `TopBar`/`BottomNav` for authenticated users), `Login.jsx`, `GoogleSignInButton.jsx`.

### 2.2 Theming (`context/ThemeContext.jsx`)
- **What it does:** Dark mode by default, toggleable light mode, persisted in `localStorage`.
- **How it works:** Sets `data-theme` attribute on `<html>`; CSS custom properties in `styles/theme.css` swap per theme.
- **Note:** There is currently no UI control exposed anywhere to actually toggle the theme (the `toggleTheme` function exists in context but no button calls it in the current page set) — **see Section 4**.

### 2.3 Exercise Library (`pages/ExerciseLibrary.jsx`, `features/exercises/`)
- **What it does:** Browse a shared exercise library with text search, a quick "muscle group" filter, an "Advanced Filter" (main/supporting muscle), and a detail modal.
- **How it works:** `useExercises` hook reads the entire `exercises` collection once (read-only, shared, admin-managed — clients cannot write to it). Filtering/search happens client-side via `useMemo`. `ExerciseDetailModal` parses numbered instruction text into a semantic `<ol>` (via `utils/textFormatting.js`) and renders `muscleGroupMain`/`muscleGroupSupport` as color-coded tags.
- **Key files:** `hooks/useExercises.js`, `services/exercises.service.js`, `ExerciseCard`, `ExerciseFilters`, `AdvancedFilterModal`, `ExerciseDetailModal`.

### 2.4 Workout Plans (`pages/WorkoutPlans.jsx`, `pages/WorkoutPlanEditor.jsx`, `features/workouts/`)
- **What it does:** Create, edit, and delete reusable workout plan templates (goal, days/week, session duration, experience level, and a list of exercises with target sets/reps/weight/rest).
- **How it works:** Full CRUD via `useWorkoutPlans` hook against the top-level `workoutPlans` collection, filtered by `userId`. `ExercisePicker` (a searchable modal reusing the exercise library data) adds exercises into the plan being edited. Editor has both create and edit modes based on a URL parameter, with a Cancel button that discards changes.
- **Key files:** `hooks/useWorkoutPlans.js`, `services/workoutPlans.service.js`, `PlanCard`, `PlanMetaForm`, `PlanExerciseRow`, `ExercisePicker`.

### 2.5 Workout Sessions (`pages/WorkoutSession.jsx`, `pages/WorkoutHistory.jsx`, `features/sessions/`)
- **What it does:** Start a live workout from a plan, log actual reps/weight per set with a rest timer between sets, and mark the session complete. View past completed sessions.
- **How it works:** `startSession` creates an "in-progress" document immediately; set data is held in local React state during the workout (not written to Firestore set-by-set, to limit write costs) and written once on `completeSession`. Completing a session also triggers two side effects:
  1. Writes a `volume` metric entry into `users/{uid}/progressLogs` per exercise (denormalized for the Progress charts).
  2. Calls `bumpPublicStreak`, which incrementally updates `publicProfiles/{uid}.streak` (compares today vs. the last logged workout date — O(1), no full history re-read).
- **Key files:** `hooks/useWorkoutSessions.js`, `services/workoutSessions.service.js`, `SessionExerciseCard`, `SetRow`, `RestTimer`, `SessionSummaryCard`.
- **Known limitation:** if the browser closes mid-workout, in-progress set data is lost (only the "started" shell session persists) — no resume-session capability exists.

### 2.6 Goals (`pages/Goals.jsx`, `features/goals/`)
- **What it does:** Create/edit/delete personal goals (type, start/current/target value, deadline, status), with a progress bar that correctly handles both "increase" goals (e.g. strength) and "decrease" goals (e.g. weight loss).
- **How it works:** Full CRUD via `useGoals` against the top-level `goals` collection. `currentValue` is **manually updated by the user** — there is no automatic linking between a goal and actual logged workout/measurement data.
- **Key files:** `hooks/useGoals.js`, `services/goals.service.js`, `GoalCard`, `GoalForm`.

### 2.7 Progress Tracking (`pages/Progress.jsx`, `features/progress/`)
- **What it does:** Log body weight measurements over time (line chart) and view per-exercise volume progress over time (line chart, exercise selected via dropdown).
- **How it works:** `useMeasurements` reads/writes `users/{uid}/bodyMeasurements`. `useProgressLogs` reads `users/{uid}/progressLogs` (written automatically by the session-completion flow described in 2.5, never written directly by the user). Both charts are Recharts `LineChart`s styled with the app's CSS variables.
- **Key files:** `hooks/useMeasurements.js`, `hooks/useProgressLogs.js`, `services/measurements.service.js`, `services/progress.service.js`, `BodyWeightChart`, `ExerciseProgressChart`, `MeasurementForm`, `ExerciseSelector`.

### 2.8 Dashboard (`pages/Dashboard.jsx`, `features/dashboard/`)
- **What it does:** Home screen combining nine cards: Welcome, Today's Workout (suggests the first workout plan), Current Goal, Weekly Progress (ring chart vs. a target derived from the first plan's `daysPerWeek`), Streak, Recent Workouts, Personal Records (best logged volume per exercise), Body Metrics (latest weight + delta), Quick Actions.
- **How it works:** Each card is an independent component that calls its own hook directly (no shared dashboard-level data-fetching layer) — e.g. `PersonalRecordsCard` cross-references `useProgressLogs` with `useExercises` client-side to resolve exercise names.
- **Key files:** All files in `features/dashboard/`.

### 2.9 User Profile & Settings (`pages/Profile.jsx`, `pages/Settings.jsx`, `features/profile/`)
- **What it does:** Edit personal information (date of birth → auto-calculated age, height, gender, units preference), fitness information (main goal, experience level), training preferences (days/week, session duration, preferred time, equipment), gym preferences (city/area, preferred gyms, typical days/times — no address field exists), and per-field privacy visibility toggles.
- **How it works:** All fields extend the existing private `users/{uid}` document under nested keys (`profile`, `trainingPreferences`, `gymPreferences`, `visibility`). Each form section saves independently via `useUserProfile().saveSection(key, data)`, which explicitly re-merges with the currently-cached section data before writing — a deliberate workaround for Firestore's `merge:true` not deep-merging nested objects.
- **Key files:** `hooks/useUserProfile.js`, `services/userProfile.service.js`, `PersonalInfoForm`, `FitnessInfoForm`, `TrainingPreferencesForm`, `GymPreferencesForm`, `VisibilitySettingsForm`, `AvatarDisplay`, `utils/age.js`, `utils/units.js`.
- **Note:** current body weight is intentionally **not** duplicated into the profile — the Settings page relies on the existing `bodyMeasurements` data as the single source of truth.

### 2.10 Friends / Social Foundation (`pages/Friends.jsx`, `features/friends/`)
- **What it does:** Send/accept/decline friend requests via a shareable "Friend Code" (the user's own Firestore UID, copy-pasted manually — there is no searchable user directory), view a friends list (name, avatar, streak), and unfriend.
- **How it works:** `friends` and `friendRequests` are subcollections under each `users/{uid}` document. Requests are keyed by the sender's own UID (so a sender can check their own request with a single-document read, and can never impersonate someone else). Accepting a request performs a single Firestore `writeBatch`: delete the request, and create reciprocal `friends` entries in **both** users' subcollections. This bidirectional cross-user write is authorized by a security-rule pattern (not a Cloud Function) that permits a user to add themselves into someone else's friend list only if a matching pending request exists.
- **Key files:** `hooks/useFriends.js`, `services/friends.service.js`, `FriendCard`, `FriendRequestCard`, `AddFriendForm`.
- **Public profile linkage:** `publicProfiles/{uid}` is the only document another user is ever allowed to read about someone else — it holds `displayName`, `photoURL`, `streak`, and `achievements` (see Section 4 — `achievements` is never populated).

---

## 3. Navigation & App Shell

- `TopBar` — sticky, solid (non-transparent) header with the app name and an avatar button linking to `/profile`.
- `BottomNav` — floating pill nav with four items: **Exercises, Plans, Goals, Progress**. Dashboard, Profile, Settings, Friends, and Workout History are reached via links from other pages, not the bottom nav.
- Routing is entirely client-side (`HashRouter`) with 13 routes, all but `/login` wrapped in `ProtectedRoute`.
- Every page component is lazy-loaded (`React.lazy`) except `Login`, keeping the initial bundle smaller (notably keeping Recharts out of the main bundle until the Progress page is visited).

---

## 4. Partially Implemented, Placeholder, or Unwired Functionality

| Item | Status |
|---|---|
| `achievements` field (`publicProfiles`) | Field exists in the schema and is always written as an empty array; nothing in the codebase ever populates it or displays it. Explicitly scoped as future-only when this was built. |
| `Visibility` settings (goals/training activity/progress summaries → friends/private) | The toggle UI works and persists to Firestore, but **nothing currently reads or enforces it** — there is no "view a friend's profile/activity" page yet, so the stored preference has no consumer. |
| `hasPendingOutgoingRequest()` (`services/friends.service.js`) | Fully implemented function, exported, but never imported or called anywhere in the UI. Dead code. |
| `syncPublicProfileBasics()` (`services/publicProfile.service.js`) | Implemented but unused — there is no UI anywhere to edit display name or upload a custom photo, so this has no current caller. |
| `videoUrl` (exercise schema, mentioned in earlier planning) | Not referenced anywhere in current code — only `imageUrl` is read (with a graceful "No image yet" placeholder box) in `ExerciseDetailModal`. |
| Theme toggle (dark/light) | `ThemeContext` fully implements `toggleTheme`, but no button in any current page calls it — light mode is currently unreachable through the UI even though the underlying CSS/logic works. |
| Resume an interrupted workout session | Not implemented — if the app closes mid-session, only the empty "started" shell persists in Firestore; in-progress set data held in local state is lost. |
| Achievements / Activity Feed / Challenges / Matching (training partners, gym/schedule matching) | Explicitly **not built** — the data model (goal, experience level, gym city/typical days-times, friends graph) was designed to support these later, but no querying, matching, feed, or challenge logic exists anywhere in the code. |

No `TODO`, `FIXME`, or commented-out code blocks were found anywhere in the source tree — the codebase is clean of explicit markers; the items above were identified by tracing what's actually wired up versus what's only scaffolded.

---

## 5. External Integrations

| Integration | Purpose | Notes |
|---|---|---|
| Firebase Authentication | Google Sign-In | Only provider enabled |
| Firebase Firestore | Primary and only database | No other database |
| GitHub Actions + GitHub Pages | CI/CD and hosting | Firebase config injected via GitHub Secrets at build time |
| Google Fonts (CDN) | Space Grotesk + Inter | Loaded via `@import` in `index.css`, not a package dependency |

**Not present anywhere in the codebase:** payments/billing, AI/LLM APIs, file/image storage (no Firebase Storage — avatars come only from the Google account's photo URL), analytics/tracking, email/notifications, or any third-party REST API beyond Firebase and Google Fonts.

---

## 6. Database Schema (Firestore)

```
users/{userId}                              — private, owner-only
  displayName, email, photoURL, createdAt
  preferences: { theme, units }
  profile: { dateOfBirth, height, gender, goal, experienceLevel }
  trainingPreferences: { daysPerWeek, sessionDuration, preferredTime, equipment }
  gymPreferences: { cityArea, preferredGyms[], typicalDays[], typicalTimes[] }
  visibility: { goals, trainingActivity, progressSummaries }  // 'friends' | 'private'

  users/{userId}/bodyMeasurements/{entryId}   — private subcollection
    date, weight, createdAt

  users/{userId}/progressLogs/{entryId}       — private subcollection, written only by completeSession
    date, exerciseId, metric ('volume'), value

  users/{userId}/friends/{friendUserId}       — private subcollection
    since (timestamp)

  users/{userId}/friendRequests/{senderUid}   — private subcollection, doc ID = sender's own uid
    fromDisplayName, fromPhotoURL, status ('pending'), createdAt

publicProfiles/{userId}                      — readable by any signed-in user
  displayName, photoURL, streak, lastWorkoutDate, achievements[]

exercises/{exerciseId}                       — shared, read-only to clients (admin-managed via console)
  name, category, muscleGroup, muscleGroupMain, muscleGroupSupport,
  equipment, difficulty, instructions, tips, imageUrl (optional)

workoutPlans/{planId}                        — top-level, filtered by userId field
  userId, name, goal, daysPerWeek, sessionDuration, experienceLevel,
  exercises: [{ exerciseId, exerciseName, targetSets, targetReps, targetWeight, restSeconds, order }],
  isArchived, createdAt, updatedAt

workoutSessions/{sessionId}                  — top-level, filtered by userId field, append-only history
  userId, planId, status ('in-progress' | 'completed'),
  exercises: [{ exerciseId, exerciseName, restSeconds, sets: [{ reps, weight, completed }] }],
  startedAt, completedAt

goals/{goalId}                               — top-level, filtered by userId field
  userId, type, startValue, currentValue, targetValue, deadline, status, createdAt
```

**Security model summary:** every collection/subcollection is gated by `request.auth.uid` matching either the document's `userId` field or its path segment — except `exercises` (any signed-in user may read, no client may write) and `publicProfiles` (any signed-in user may read; only the owner may write). The `friends`/`friendRequests` rules additionally use `exists()`/`get()` calls to verify mutual consent for the one case where a user must write into another user's subcollection (accepting a friend request).

No composite Firestore indexes are required beyond the single one already needed for `workoutSessions` (filter by `userId` + order by `startedAt`), created earlier via the Firebase Console's auto-suggested index link.

---

## 7. Application Flow (User Perspective)

1. **Land on `/login`** → if already signed in, immediately redirected to Dashboard; otherwise shown a branded sign-in screen with a single "Sign in with Google" button.
2. **First-ever sign-in** creates the private user document and public profile document.
3. **Dashboard** greets the user and surfaces an at-a-glance view: suggested workout, active goal, weekly progress ring, streak, recent history, personal records, latest body weight, and quick-action shortcuts.
4. **Exercises tab** — browse/search/filter the shared library, tap any card for full instructions/tips/muscle breakdown.
5. **Plans tab** — view saved workout plans, create a new one (name, goal, schedule, exercises with targets), or start one directly from its card.
6. **Starting a plan** launches a live session — log each set's actual reps/weight, get a rest timer between sets, then "Finish Workout," which silently updates progress charts and streak in the background.
7. **Goals tab** — set and track personal goals with a visual progress bar; updated manually as the user progresses.
8. **Progress tab** — log body weight over time and inspect volume trends for any specific exercise.
9. **Profile (via avatar in top bar)** — view age/height summary, copy a Friend Code, and navigate to Settings or Friends.
10. **Settings** — edit personal/fitness/training/gym info and privacy toggles, saved section by section.
11. **Friends** — paste someone's Friend Code to send a request; accept/decline incoming requests; see friends' names, avatars, and streaks; unfriend at will.

Throughout, the app works as an installable PWA (dark theme, offline app-shell caching) and is fully keyboard/screen-reader accessible per the accessibility pass done earlier (focus states, `aria-live` regions, reduced-motion support, WCAG-checked color contrast).

---

## 8. Technical Debt & Architectural Notes

- **No backend / no Cloud Functions by design.** This keeps the stack simple and free-tier-friendly, but it's the reason the friends system needs a somewhat intricate security-rule pattern instead of a straightforward server-side fan-out — a Cloud Function would be a more conventional (though heavier) solution if the friends graph grows in complexity later (e.g., blocking, mutual-friend counts).
- **Firestore rules live only in the Firebase Console, not in source control.** There is no `firestore.rules` file in the repository, so rule history isn't version-controlled or code-reviewable alongside the app code — a meaningful gap for a project this far along.
- **`react-hooks/set-state-in-effect` ESLint warnings** appear on every data-fetching hook (`useGoals`, `useMeasurements`, `useProgressLogs`, `useWorkoutPlans`, `useWorkoutSessions`, `useUserProfile`, `useFriends`) — all follow the same intentional `fetchX()` call inside `useEffect` pattern. It's consistent and functionally correct, but it is a repeated, unaddressed lint warning across seven files rather than a one-off.
- **`AuthContext.jsx` and `ThemeContext.jsx`** each trigger a "Fast Refresh only works when a file only exports components" ESLint warning, since both export a component and a hook from the same file — a common, low-risk pattern, but technically inconsistent with the lint rule in place.
- **No pagination anywhere.** Workout plans, sessions, goals, and friends lists all fetch their entire collection in one read. Fine at the current scale of a single/small user base; would need addressing before this could handle power users with hundreds of sessions or friends.
- **Client-side-only filtering/search.** Exercise library search, muscle-group filters, and dashboard "personal records" cross-referencing all happen in-browser over already-fetched data — appropriate for the current small dataset sizes, but wouldn't scale to a large shared exercise library.
- **Some dashboard cards independently re-fetch data already fetched elsewhere** (e.g., `TodaysWorkoutCard` and `WeeklyProgressCard` both call `useWorkoutPlans`, and multiple cards independently call `useWorkoutSessions`) rather than sharing a single fetch — each hook call is a separate Firestore read per mount. Not currently a problem at this scale, but a candidate for consolidation if read costs become a concern.
- **Two dead/unused exported functions** (`hasPendingOutgoingRequest`, `syncPublicProfileBasics`) — harmless, but unreferenced code that either needs a caller or should be removed.
- **Bundle size warning at build time** — the main JS chunk is ~808 KB (mostly the Firebase SDK), flagged by Vite's build output as exceeding the 500 KB chunk-size guideline. Not yet addressed; Recharts is already correctly isolated to its own lazy-loaded chunk.
