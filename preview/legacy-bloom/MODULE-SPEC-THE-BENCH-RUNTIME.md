MODULE_SPEC: THE_BENCH_RUNTIME
TARGET: Claude Code Implementation (Staging Container)
VIEW: /views/the_bench.tsx

INPUT_CONTROLLER:
  AUDIO_CAPTURE: Autonomous client-side VAD (Web Audio API)
  SILENCE_TIMEOUT: 8.0s - 10.0s continuous silence triggers execution
  HARD_PROHIBITION: Zero hold-to-talk handlers (trips ChromeOS right-click menu)
  HARD_PROHIBITION: Zero text-fallback input fields

COMPANION_BEHAVIOR (GUS 2.1):
  ENTRANCE_LINE: "Do you leave it all here, or we can talk you through it?"
  RESPONSE_LENGTH: Strict 2–3 sentences maximum
  INTENT_ROUTING:
    - Pass 1 (Literal): Parse user rant text
    - Pass 2 (Cipher): Identify root friction; strip surface hostility
    - Injection: Redirect friction toward an active habit or real-world project
    - Negative Constraints: Ban "I understand", "Sorry to hear that", "Take a breath"
  DISSIPATION_EFFECT:
    - WebGL shader dissolves user transcript into rising griddle steam on reply commit
    - Local episodic memory auto-saves delta to SQLite/IndexedDB before view unmounts
