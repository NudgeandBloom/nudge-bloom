# JETT TO CLAUDE — Legacy Bloom preview, read this first

Danny is the tester. You are the builder. GitHub is how we share — the chat links and file cards keep failing between us, GitHub does not.

## Where the code is
- Repo: NudgeandBloom/nudge-bloom (public)
- Branch: preview/legacy-bloom
- Latest code commit: f386a58bbf7120a283e4538d409bccc3a8bcf103
- Delete commit (stale src/index.js removed): 7066712fa373eeb14284264b756bc74436cec048
- Main and the live site were NOT touched.

## Preview link (for Danny, not for your automated fetch)
https://muse.ai/s/nudge-bloom-legacy-bloom-preview-oy6srxhrgxlrxy/VlOCysYbzzRom9PN6HkeJdrSoYCru15YViaaonSLPwQ
This is a live interactive page, not a video. Danny taps it, tugs the leaf, it moves.
Note: the public link still serves the older hand-built preview until Danny approves publishing the new Vite build. The Vite build is staged.

## What works / what doesn't — Danny's check, Nov 1 ~3:00 PM
Works: flowers first, Settings, sanctuaries exist, Bench exists.
Does NOT work yet (fix these):
1. Leaf tug is temporary — it must ENTER the sanctuaries and STAY there, not snap back to the door.
2. Sanctuary pictures are off — they must be the REAL videos (flower.mp4, ocean.mp4, zen.mp4, celestial.mp4, bench.mp4 + posters at the repo root), living and moving, not looped still pictures. If a video fails, say so visibly.
3. Gus's face is not visible at the Bench — use the locked Gus render (gray hair, goatee, tattooed forearms, apron, towel) behind the counter, clearly visible.
4. Hold-to-talk opens the browser right-click menu — prevent contextmenu on long-press everywhere, add a tap-to-talk button that works without any menu.
5. Voice: when Danny talks, something must respond visibly — at minimum a spoken/text reply. Do not claim voice recognition works if it doesn't.

## Rules (Danny's, do not break)
- No audio files wired in as fake buttons. Voice stays stubbed/off until Danny clears it.
- No Mikosabi, no Counter Wisdom, no counter-talk lines. That is YouTube/vault only.
- No character over-cards at the door. Flowers first.
- Preview branch only. Nothing to main, nothing live, nothing for sale, without Danny's PRINT/GO.

## Videos on GitHub
The real videos/posters are at the repo root on this branch (inherited from main). They could NOT be copied into preview/legacy-bloom/public/ via the GitHub connector — it rejects binary files. If you can push binaries, put them there. Otherwise leave them at the root and point App.jsx at /flower.mp4 etc. — that is how the current code already does it.

## How to send work back
You cannot push directly (GitHub not linked to your session). Send Danny a zip — code-only is fine, videos are already in the repo — and Jett will push it to this branch and send back the new commit hash. Verify the hash yourself by cloning, like last time.
