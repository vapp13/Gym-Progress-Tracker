# Gym Progress Tracker

A premium, mobile-first fitness app for planning workouts, training in real time, and tracking real progress — body measurements, personal records, and goals — all in one place.

**[Open the app →](https://vapp13.github.io/Gym-Progress-Tracker/)**

---

## App Overview

Gym Progress Tracker covers the full cycle of a training life: build a plan (or skip planning and train freely), log every set as you go, and watch your body metrics, strength, and goals evolve over time. It's installable to your phone's home screen, works offline once loaded, and defaults to a dark theme built for gym lighting.

---

## Key Features

- Google Sign-In — no separate account or password to manage
- Structured workout plans with supersets, notes, and scheduled training days
- Starter templates for common routines (Push/Pull/Legs, Upper/Lower, Full Body)
- Free Workout mode — train without a plan, build the session as you go
- Live session logging with autosave, previous-performance recall, rest timers, and a plate calculator
- Exercise library with rich filtering and full exercise detail views
- Workout history with both list and calendar views
- Ten goal types, each with its own dashboard showing progress, pace, and trend
- Body measurement tracking across 17 metrics, with full edit/delete history
- Automatic BMI, BMR, TDEE, calorie target, and other estimate calculations
- Personal records tracked automatically per exercise
- Achievements and a friend activity feed
- CSV export of your data, and CSV import for body measurements
- Dark and light themes, fully installable as a Progressive Web App

---

## User Authentication

Sign in with your Google account. There's no separate password to create or remember — your workouts, plans, goals, and measurements are tied to your Google identity and private to you.

---

## Dashboard

Your home screen the moment you open the app. It shows:
- **Today's Workout** — your scheduled or suggested plan, with one-tap buttons to start it or start a Free Workout instead. Once you've completed a workout for the day, this card switches to a "Done for today!" state rather than prompting you again.
- **Current Goal** — your active goal's progress at a glance, with a trend indicator.
- **Weekly Progress** — how many training days you've completed this week against your target.
- **Streak** — your current consecutive-training-day streak.
- **Personal Records** — your best lifts, updated automatically.
- **Recent Workouts** — your last few completed sessions.
- **Body Metrics** — a quick summary of your latest weight and calculated stats.

---

## Workout Plans

Build structured, reusable workout plans:
- Add exercises from the full library, with sets, reps, weight, and rest time for each — weight is optional, since you often won't know it in advance.
- Group exercises into **supersets**, visually linked, with the rest timer intelligently waiting until the whole round is done rather than resting after every single exercise.
- Add notes to individual exercises or the plan as a whole.
- Set which days of the week a plan is scheduled for, so it appears automatically as "Today's Workout" on the right day.
- See your recent workout history and a shortcut to full history right on the Plans page.

Nothing is saved automatically while you're building or editing a plan — leaving with unsaved changes will ask you to confirm first.

---

## Templates

Don't want to start from a blank plan? Choose from ready-made templates — Push Day, Pull Day, Leg Day, Upper Body Routine, Lower Body Routine, and Full Body Routine — each pre-filled with a sensible exercise selection, sets, and reps. Applying a template loads it into the plan editor for you to review and adjust; it's only saved once you choose to save it.

---

## Free Workouts

Prefer to train without a fixed plan? Start a Free Workout and build the session as you go — search and add exercises one at a time (or several at once), log your sets, and finish whenever you're done. Free Workouts behave identically to plan-based sessions everywhere else in the app: they appear in your history, count toward your streak, and feed your personal records and progress charts.

---

## Live Workout Sessions

Whether you're following a plan or training freely, the in-session experience is built to be fast:
- **Continuous autosave** — close the app mid-workout and reopen it later to pick up exactly where you left off, timer included.
- **Previous performance** — see what you lifted last time for each exercise before you log a new set.
- **Set types** — mark a set as Working, Warm-up, Drop-set, Failure, or Assisted, each with a distinct color and a short explanation available by tapping the help icon.
- **Rest timer** — starts automatically between sets, with a sound and vibration when it completes, and skips correctly across superset pairings.
- **Plate calculator** — for barbell exercises, quickly see which plates to load per side for a target weight.
- **Flexible logging** — add or remove sets and exercises mid-session, and mark a workout paused, discarded, or complete at any time.
- **Exercise details on demand** — tap the info icon on any exercise card to see its full details without leaving your workout.

---

## Exercise Library

Browse an extensive exercise library with:
- Fast search
- A **Muscle Groups** filter, organized by Upper Body, Lower Body, and Other, listing the specific muscles trained within each
- An **Equipment** filter
- Advanced filters for specific main/supporting muscles and difficulty level
- Full exercise details — instructions, tips, difficulty, and targeted muscles — accessible from the library itself or directly from any workout card

The same browsing experience is used everywhere you pick an exercise — building a plan, applying a template, or adding to a Free Workout — so it always looks and behaves the same way.

---

## Workout History

Every completed workout is kept in your history, viewable as:
- A **list**, showing each session's name, date, duration, and a quick summary
- A **calendar**, showing which days you trained at a glance, with a tap-through to that day's full session detail

Tap into any session to see its full breakdown — every exercise, every set, and how it compared to your previous session with the same plan.

---

## Goals

Set a real, specific goal rather than a generic number. Ten goal types are supported:

- Lose Weight, Gain Weight, Build Muscle
- Reduce Body Fat, Maintain Weight
- Improve Strength (linked directly to a specific exercise)
- Improve Endurance, Increase Flexibility, Improve Cardiovascular Health
- General Fitness

You can have multiple goals, but only one is ever your **Active Goal** — the one driving your Dashboard and Weekly Progress. Each goal has its own detail page showing:
- Percent complete and amount remaining
- Time remaining and an estimated completion date
- A trend indicator — **Improving**, **Stable**, or **Behind** — based on your most recent progress, not just your overall pace

Goals move through **Active → Completed → Archived** states, and completed or archived goals can always be reactivated. Certain goal types include a flexible tracking log for supplementary metrics (like VO₂ Max or resting heart rate) that don't fit neatly into a single number.

---

## Profile

Your central fitness overview, combining body metrics, goals, measurement progress, exercise progress, achievements, and personal records in one place:
- **Body Metrics** — current weight, change since your first entry, active goal progress, last measurement date, BMI, BMR, and TDEE, all as quick-glance stat cards.
- **Active Goal** — a read-only summary of your current goal's progress.
- **Body Measurements** — a button to quickly log a new measurement, and another to view the full Body Metrics breakdown.
- **Measurement Progress** — pick any measurement you've tracked from a grouped selector, filter the graph by date range (Last 30 Days, 3 Months, 6 Months, Year, or All Time), and view its full history with the ability to edit or delete individual entries.
- **Exercise Progress** — pick from exercises you've actually logged (searchable, so it stays usable even with a large exercise library) to see training volume over time, alongside your best weight, estimated 1-rep max, session count, and average volume.
- **Achievements** — milestones you've earned (training streaks, personal record counts, goals completed), with an info button showing every achievement available, earned or not.
- **Personal Records** — your top records at a glance, with a link to browse your complete record history.

---

## Body Metrics

A dedicated page for the numbers behind your training:
- **BMI, BMR, and TDEE**, calculated automatically from your profile and latest weight
- **Calorie Targets** — maintenance, fat loss, and muscle gain estimates based on your TDEE
- **Other Estimates** — ideal body weight and body surface area

These are general estimates from standard formulas, not medical advice — a note to that effect is always shown alongside them.

---

## Progress Tracking

Body measurement tracking covers 17 metrics across two categories:
- **Body Composition Metrics** — body fat %, fat-free body weight, subcutaneous and visceral fat, body water, skeletal muscle, muscle mass, bone mass, protein %, and metabolic age (typically sourced from a smart scale or body composition scanner)
- **Body Measurements** — waist, neck, shoulders, chest, biceps, forearms, abdomen, hips, thighs, and calves (tape measure)

Every entry can include optional notes, and every past entry can be corrected or removed if you make a mistake — nothing you log is locked in permanently by accident.

---

## Personal Records

Every exercise you've trained keeps its own personal record automatically: heaviest weight lifted, best reps in a set, estimated one-rep max, and best total session volume — each only ever updated when you genuinely beat it, with the date you achieved it. Browse your top records from your Profile, or see your complete history on a dedicated page.

---

## Friends & Activity

Add friends using your unique Friend Code (no public directory or search — friends are added deliberately, by sharing your code directly). See a friend's training streak and achievements on their activity page, and check the shared **Activity Feed** for recent achievements and workouts across all your friends. What's visible is controlled entirely by each person's own privacy settings.

---

## Data Export & Import

From Settings, export your data to CSV at any time:
- Body Measurements
- Workout History (session summaries)
- Personal Records

Body Measurements can also be **imported** from a CSV in the same format as the export — useful for restoring data or bringing in a bulk history.

---

## Mobile-First Design

Every screen is designed for one-handed phone use first: large touch targets, a bottom navigation bar for quick access to Exercises, Plans, Home, Goals, and your Profile, and layouts that scale cleanly from the smallest phone screens up to tablets.

---

## Dark & Light Theme

The app defaults to a premium dark theme designed for gym lighting, with a light theme available any time from Settings.

---

## Installable App

Gym Progress Tracker is a full Progressive Web App. Install it to your phone's home screen for an app-like experience, including access to your most recently loaded data even without a connection.

---

## Future Roadmap

Some directions being explored for future updates:
- Deeper friend activity sharing (goal and progress summaries, not just workouts and achievements)
- Workout reminders and richer notifications
- Broader pagination across long-running lists as usage grows
- Continued refinement of the visual design system

---

*Gym Progress Tracker is under active development — features and screens described here may continue to evolve.*