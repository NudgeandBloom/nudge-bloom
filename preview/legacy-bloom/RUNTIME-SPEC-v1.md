# NUDGE & BLOOM — RUNTIME SPEC: COMPANION SELECTION & PROMPT ROUTER
VERSION: 1.0.0
TARGET: Frontend Client & Inference Router (Claude Implementation)
AUTHOR: The Architect (Hey Junior)
STATUS: STAGING ONLY (No production deployment without PRINT/GO)

Blueprint locked. Send this straight to Claude. No deviation, no feature creep.

## 1. Hard Constraints (The Rules)

- Rule 1 (Zero Dual-Model Calls): Exactly one companion active per user profile. Dual-agent runtime or panel conversations are strictly barred.
- Rule 2 (Single Choice Lock): Selection happens once during onboarding sequence (Step 5). No mid-session switching, no in-app store pack expansions, no secondary toggles.
- Rule 3 (Zero Hold-to-Talk): Autonomous silence detection only. Silence threshold: 8.0–10.0 seconds triggers auto-submission. No hold-to-talk buttons (prevents Chromebook OS right-click menu traps).
- Rule 4 (Decipher Integration): Leaf Tug gesture routes to Settings, which injects the @cypher-protocol context into the prompt layer.

## 2. State Machine: Onboarding & Selection

```
[APP LAUNCH]
   |
   v
[STATE: GATE_INTRO] -> Narrator voice-over entry
   |
   v
[STATE: FLOWER_BREATHE] -> Real-time generative bloom (No 8s flat video loops)
   |
   v
[STATE: ATMOSPHERE_PICK] -> Select 1 of 4:
                             [Flower Garden | Ocean Drift | Zen Garden | Celestial]
   |
   v
[STATE: COMPANION_PICK] -> Render binary choice UI:
                             Option A: "GUS"  (Diner counter, gritty banter, direct)
                             Option B: "JUNE" (Grounded warmth, organic cadence)
   |
   v (Persist to local client SQLite/IndexedDB & session token)
[STATE: LOCKED_RUNTIME] -> Companion selection immutable for standard session
```

## 3. Unified Backend Routing Architecture

One unified engine handles transcription, silence detection, memory recall, and habit stacks. Routing forks only at the prompt injection and TTS audio renderer.

```typescript
// Router implementation blueprint for Claude
interface UserSession {
  userId: string;
  selectedCompanion: 'GUS' | 'JUNE';
  activeAtmosphere: 'FLOWER_GARDEN' | 'OCEAN_DRIFT' | 'ZEN_GARDEN' | 'CELESTIAL';
  habitStack: HabitItem[];
  episodicMemory: MemoryFact[];
}

function buildPromptPayload(session: UserSession, userTranscript: string): ModelRequest {
  const baseSystemPrompt = CORE_NUDGE_AND_BLOOM_ENGINE;
  const memoryContext = formatMemoryLedger(session.episodicMemory);
  const decipherDirective = session.settings.decipherActive ? CYPHER_PROTOCOL_PROMPT : "";

  // Strict persona branching
  const personaPrompt = session.selectedCompanion === 'GUS'
    ? GUS_PERSONA_PROMPT
    : JUNE_PERSONA_PROMPT;

  return {
    system: `${baseSystemPrompt}\n${decipherDirective}\n${memoryContext}\n${personaPrompt}`,
    userMessage: userTranscript,
    audioProfile: session.selectedCompanion === 'GUS' ? 'ELEVENLABS_GUS_VOICE' : 'JUNE_ORGANIC_VOICE'
  };
}
```

## 4. Persona Injection Directives

### Companion A: GUS

```
[ROLE: GUS]
- Setting: Standing behind a 3 AM rain-slicked diner counter, wiping it down.
- Delivery: Gritty, direct, short-order cadence. No clinical jargon, no hollow validation ("I'm sorry to hear that").
- The Bench Rule: When the user rants, extract the root frustration and redirect the energy toward a tangible, practical target. Banter with grounded specifics from their memory ledger (e.g., yard chores, stone work, physical tasks).
- Closure: Keep it under 3 sentences. Cut clean. Let the words dissolve like steam off the grill.
```

### Companion B: JUNE

```
[ROLE: JUNE]
- Setting: Organic, steady presence rooted in the active atmosphere.
- Delivery: Grounded warmth, calm cadence, crisp articulation. Never synthetic, preachy, or bubbly customer service tone.
- The Bench Rule: Hear the friction beneath the venting. Hold the line without rushing to fix them. Offer clear, steady reflection that helps the user stand back up and refocus.
- Closure: Direct, calm, conversational piece that leaves the space quiet and centered.
```

## 5. Deployment Directive for Claude

Implement this router cleanly in the existing stack. Build the unified session store first, bind the binary selection state, and wire the TTS endpoints to their respective voice ID assets. Keep it lean, avoid adding external libraries, and hold the build in staging until Danny issues the PRINT/GO command.

## Visualist

The interaction is clean:

The user opens the app. The screen doesn't show a wall of text or an account setup matrix. The flower opens with deep, slow expansion. They tap their atmosphere, then hit the fork: a rugged silhouette of Gus at the diner rail, or the clear, tranquil portrait of June.

One tap locks it in. The UI transitions without stuttering into their selected space. When they step up to The Bench, there are no buttons, no timers ticking down—they talk, take a breath, and right at the ten-second quiet mark, the companion answers like they've been standing right across the room the whole time. Immediate, tactile, and zero clutter.
