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
