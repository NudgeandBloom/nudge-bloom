RENDER_SPEC: THE_BENCH_CIRCADIAN
TARGET: Shader / WebGL Implementation
CYCLE_TRIGGERS:
  - MORNING (06:00–11:59): Warm directional sunlight (3200K), low griddle steam opacity (0.35)
  - NOON (12:00–17:59): Overhead neutral white (5500K), griddle haze active
  - NIGHT (18:00–05:59): Rain-window reflection maps, neon rim lighting, steam text-dissolve active
CONSTRAINTS:
  - Asset budget: Under 2.5 MB total textures
  - Frame rate target: Steady 60 FPS on Chromebook/mobile web
  - Transition: Continuous linear interpolation based on local system clock
