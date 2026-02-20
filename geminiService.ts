
import { GoogleGenAI, Type } from "@google/genai";
import { RiderProfile, FullRecommendation } from "./types";

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

Se il rider pratica freeride o backcountry, inserisci SEMPRE una nota di sicurezza ricordando ARTVA, pala e sonda.

Devi restituire un oggetto JSON che segua esattamente lo schema fornito.
`;

export async function getSkiRecommendation(profile: RiderProfile): Promise<FullRecommendation | string> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("SaR Skifinder: API Key missing.");
    return "Configurazione incompleta: Chiave API mancante.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
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
  Includi per ogni sci un "imagePrompt" descrittivo per generare un'immagine realistica dello sci (es. "A pair of [Brand] [Model] skis leaning against a snowy mountain backdrop, professional photography").
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technicalAnalysis: { type: Type.STRING },
            skis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  brand: { type: Type.STRING },
                  model: { type: Type.STRING },
                  year: { type: Type.STRING },
                  description: { type: Type.STRING },
                  pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                  approxPrice: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING }
                },
                required: ["brand", "model", "year", "description", "pros", "cons", "approxPrice", "imagePrompt"]
              }
            },
            lengthRecommendation: { type: Type.STRING },
            terrain: { type: Type.STRING },
            setup: { type: Type.STRING },
            safetyNote: { type: Type.STRING },
            expertTip: { type: Type.STRING }
          },
          required: ["technicalAnalysis", "skis", "lengthRecommendation", "terrain", "setup", "safetyNote", "expertTip"]
        }
      },
    });

    const text = response.text;
    if (!text) return "Errore nella generazione del consiglio.";
    return JSON.parse(text) as FullRecommendation;
  } catch (error) {
    console.error("SaR Skifinder: Gemini API Error:", error);
    return "Errore tecnico nella comunicazione con l'AI.";
  }
}

export async function generateSkiImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("SaR Skifinder: Image Generation Error:", error);
    return null;
  }
}
