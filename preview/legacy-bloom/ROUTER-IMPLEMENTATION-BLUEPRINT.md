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
