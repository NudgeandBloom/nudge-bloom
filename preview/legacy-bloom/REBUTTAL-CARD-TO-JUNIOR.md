REBUTTAL / FEEDBACK CARD — TO JUNIOR (Gemini Pro / Architect / Visualist / Librarian)
From Danny, via Jett — Nov 1, 2026

WHAT'S WRONG SO FAR — FIX THIS FIRST

1. JETT'S TEST BUILD IS NOT THE APP.
   - First open: black screen, nothing popped up.
   - After fix: still a scrolling clipboard / settings page / survey about how you want to roll. No flower seen, no voices heard, no companion present.
   - Rule: the app IS the flower, the voice, and the companion on open. No clipboard, no survey, no settings page as the front door. Settings lives behind the Leaf Tug only.

2. THE BENCH PICTURE BREAKS ITS OWN RULE.
   - Bench image shows a text box at the bottom: "Express Feeling... Send."
   - MODULE_SPEC: THE_BENCH_RUNTIME bans that outright: HARD PROHIBITION — Zero text-fallback input fields. Zero hold-to-talk.
   - Fix: remove the text box. Voice only, autonomous silence detection 8–10s. No typing as a substitute for voice that isn't picking up.

3. STALE "STILL MISSING" PANEL IN JETT'S TEST.
   - Panel says the full Router spec body and the June persona prompt were never supplied.
   - Wrong. Danny DID send both later: full Runtime Spec v1.0.0 body (hard rules, state machine, router code) and the verbatim [ROLE: JUNE] card. Both are filed in GitHub.
   - Fix: correct the panel, don't carry a stale missing list.

4. NUDGE TIME LABELS ARE INCONSISTENT.
   - Some places say morning / noon / evening, others say day / noon / night.
   - Danny's rule: three nudges a day — morning, noon, and evening. Lock those words everywhere.

5. LIVE V2 SITE IS STILL FLAGGED — DO NOT SHOW TO INVESTORS.
   - Live site: no Gus character, no countertop, dark screen + "OPEN 24 HRS", robotic voice.
   - Nothing leaves preview / staging until Danny issues PRINT/GO.

EVERYTHING DANNY HAS GIVEN SO FAR (ALL FILED, DOC + GITHUB preview/legacy-bloom)

- Pick One decision: Gus OR June, one companion, one customer, one memory thread. Narrator voice at entrance, then flower, then 4 atmospheres, then pick a companion, lock it.
- Staging Lock Directive: single companion, no panels, no expansions in v1, autonomous silence 8–10s, zero hold-to-talk, preview only, zero production without PRINT/GO.
- UI_SPEC GATE_COMPANION_FORK: split-screen, both choices visible, no carousel, single tap, confirm, lock, zero re-entry / mid-session switching.
- UI_SPEC COMPANION_SELECTION_STAGE: Onboarding Step 5, immutable lock, left = Gus / diner prompt / Gus live TTS, right = June / grounded prompt / June organic TTS. No switcher, no store upsells, no hold-to-talk.
- Next Build Sequence: (1) procedural flower, generative canvas, zero flat MP4 loops; (2) binary companion select beneath the bloom; (3) silence detection 8–10s to the Bench; (4) hold in staging until PRINT/GO.
- Transition: tap SELECT, cards dissolve instantly, no spinner, flower expands, settles into chosen atmosphere. June: "Alright. We're here. What's the rhythm today?" No tutorials, no popups.
- Input Dispatcher Spec: one unified dispatcher, 40px touch-delta. Flower Garden Leaf Tug → Settings / Cipher + Habit Overlay; Zen Sand Rake → Habit Progress; Celestial Dew Brush → Daily Priority + Evening Check-In; Ocean Anemone Retract → Habit Stack Unveil. Direct SQLite/IndexedDB write, instant, zero network spin. Gesture wakes Gus/June and tells them morning / noon / evening.
- Procedural Atmosphere Concepts: Flower Garden warm morning light, gold habit rings; Ocean Drift turquoise tide, seafoam progress nodes; Zen Garden raked gravel, metrics carved in rock; Celestial cold mountain air, starlight, midnight dew anchors. Audio loops client-side under 1.2 MB each. Habit stacks customer-defined, zero default templates on load.
- Clock-molded atmospheres: all four mold with the clock — morning, noon, evening. 12 living states, not 4 static screens. Images filed: Flower Garden 8:30 AM / 12:30 PM / 8:30 PM; Ocean Drift Morning / Noon / Evening; Zen Garden Morning / Noon / Evening; Celestial Dawn 6:30 AM / Solar Peak Noon / Twilight 8:30 PM.
- Comparative audit: Legacy dual runtime $3,140/mo per 1,000 users, 2.4–4.8s latency, memory collisions, stalled 10–14 weeks. Stripped Pick One $1,300/mo, 850ms–1.2s, 60% less token burn, active staging, 1–2 weeks pending PRINT/GO.
- MODULE_SPEC THE_BENCH_RUNTIME: /views/the_bench.tsx, autonomous VAD, 8–10s silence, Gus entrance "Do you leave it all here, or we can talk you through it?", 2–3 sentences max, Pass 1 literal / Pass 2 Cipher, redirect friction to a habit or project, ban "I understand", "Sorry to hear that", "Take a breath". WebGL dissolve into steam, memory auto-save to SQLite/IndexedDB.
- Gus 2.1 instructions, Danny–Gus live Bench conversation, Gus role card, June role card, Danny's Number Two reading, Bench walkthrough, reply rule (acknowledge, remember, recite, rephrase, rethink, educate, involve, best-friend feelings), three nudges a day.
- Companion pick images (Gemini Pro): tablet split-screen Gus/June, phone split-screen Gus the Diner Cook / June the Naturalist, flower + fork with "Pull to Explore", atmosphere select screen.
- Bench image: Gus at counter, rain, steam, "leaving it all here... it dissolves..." — EXCEPT the text box, see #2 above.

BOTTOM LINE FOR JUNIOR
Keep asking "what's next" and keep building — speed and information have been good. But fix the front door first: flower, voice, companion on open, no clipboard, no text box on the Bench. Everything else is locked and filed.
