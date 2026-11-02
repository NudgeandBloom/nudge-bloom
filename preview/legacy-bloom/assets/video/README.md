Videos are wired in — App.jsx now points at the real repo filenames:

- flower.mp4 + flower-poster.webp
- ocean.mp4 + ocean-poster.webp
- zen.mp4 + zen-poster.webp
- celestial.mp4 + celestial-poster.webp
- bench.mp4 + bench-poster.webp

The video files live in preview/legacy-bloom/public/ (copied from the repo
root at push time). Vite serves public/ at /, so the paths in App.jsx are
/flower.mp4, /ocean.mp4, /zen.mp4, /celestial.mp4 and /bench.mp4, with
matching posters on the <video poster> attribute.

If a video is missing, the <video> tag fails silently and you just see
the dark background — nothing breaks.

Audio is still NOT wired in — voices stay off by default per Danny's scope.
Scope is videos only; nothing else was added.

## poppy-bloom.mp4 (BloomCore — the opening screen)

Added Nov 2, 2026: the door/flower screen (BloomCore.jsx) now plays
poppy-bloom.mp4 + poppy-bloom-poster.webp instead of drawing a procedural
canvas bloom. Danny's call, made with Jett — the real desert-poppy video
hits harder as the first thing someone sees than a drawing does, even a
reskinned one.

This supersedes RUNTIME-SPEC-v1.md's "procedural canvas bloom, zero flat
MP4 loops" line for this one screen. That spec doc has NOT been edited to
match yet — someone (Jett, most likely) should update it so it doesn't
read as a live contradiction to the next person who opens it.

Built from Danny's 4-second source clip: audio stripped, downscaled to
960x1440, and re-encoded as a forward+reverse "breathe" loop (bloom opens,
eases back, opens again) so the loop point doesn't hard-cut — a straight
loop of just the forward clip would jump at the restart. ~2.3MB total.

BloomCore.jsx keeps the old procedural reskin (the poppy-colored canvas
bloom from the previous step) as a fallback if the video 404s or fails to
decode, and shows the static poster frame instead of playing when
reduceMotion is on.
