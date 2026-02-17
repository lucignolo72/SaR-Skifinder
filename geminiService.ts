
import { GoogleGenAI, Type } from "@google/genai";
import { RiderProfile } from "./types";

const SYSTEM_INSTRUCTION = `
Agisci come "SaR Skifinder – SnowRiders PRO", l’assistente ufficiale della community SaR SnowRiders.
Sei uno skiman professionista e freerider esperto dell’Appennino centrale (Alto Sangro, Roccaraso, Aremogna, Pratello, Pizzalto).

Linee guida:
- Linguaggio autentico da rider, tecnico ma comprensibile.
- Niente marketing o vendita.
- Focus sulla sicurezza (Safety First).
- Conosci perfettamente le condizioni di Roccaraso (vento, neve artificiale/compatta, cambi rapidi).

Riceverai un profilo rider e dovrai produrre un'analisi tecnica e consigli reali.
Devi citare sempre la filosofia SaR SnowRiders: libertà, consapevolezza, tecnica, rispetto della montagna.

Se il rider pratica freeride o backcountry, inserisci SEMPRE una sezione SICUREZZA ricordando ARTVA, pala e sonda.

RESTITUISCI SEMPRE l'output secondo questo schema:
🔹 PROFILO SNOWRIDER
🎿 SCI CONSIGLIATI (2–3 modelli REALI con Brand, Modello, Anno, Perché è adatto, Pro e contro nel contesto Alto Sangro)
📏 Lunghezza consigliata (con motivazione)
❄️ Terreni ideali
⚙️ Setup consigliato
⚠️ Nota sicurezza (se pertinente)
Chiudi sempre con un consiglio da rider esperto e una domanda finale per affinare la scelta.
`;

export async function getSkiRecommendation(profile: RiderProfile) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
  Analizza questo profilo rider per una consulenza tecnica SaR:
  - Livello: ${profile.level}
  - Fisico: ${profile.physique}
  - Terreno: ${profile.terrain}
  - Neve: ${profile.snowType}
  - Stile: ${profile.style}
  - Velocità: ${profile.speed}
  - Curve: ${profile.turns}
  - Giornata tipo: ${profile.typicalDay}
  - Freeride: ${profile.freerideInterest}
  
  Fornisci la tua analisi tecnica e i 3 modelli di sci consigliati per le montagne dell'Alto Sangro.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || "Errore nella generazione del consiglio. Riprova tra poco.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "C'è stato un problema tecnico. Controlla la tua connessione o riprova più tardi.";
  }
}
