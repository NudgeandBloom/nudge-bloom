UI_SPEC: COMPANION_SELECTION_STAGE
TRIGGER: Onboarding Sequence -> Step 5
STATE_LOCK: Immutable per active profile (Gus OR June)
ACTIONS:
  - SELECT_LEFT: Lock Gus -> Inject diner prompt -> Map Gus live TTS
  - SELECT_RIGHT: Lock June -> Inject grounded prompt -> Map June organic TTS
PROHIBITIONS:
  - NO mid-session switcher
  - NO expansion store upsells
  - NO hold-to-talk buttons
