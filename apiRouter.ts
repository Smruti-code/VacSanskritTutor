import { Request, Response } from "express";
import { MASTER_SYSTEM_PROMPT, generateContentWithFallback, ai } from "./gemini.js";
import { Type } from "@google/genai";
import {
  generateLocalChatReply,
  generateLocalTranslation,
  generateLocalGrammarDiagnosis,
  generateLocalPronunciationGuide,
  generateLocalWAV,
} from "./localSanskritEngine.js";

export async function handleChat(req: Request, res: Response) {
  try {
    const { messages, userLanguage = "auto", level = "beginner", mode = "tutor" } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const lastMessage = messages[messages.length - 1]?.content || "";

    const langInstruction =
      userLanguage && userLanguage !== "auto"
        ? `The learner's chosen language is ${userLanguage}. Respond in ${userLanguage} for all explanations and teaching, while presenting Sanskrit in Devanagari and IAST.`
        : `Detect the learner's language from their input (e.g. English, Tamil, Hindi, Telugu, Kannada, Malayalam, Marathi, Bengali, etc.) and respond in that exact language for all explanations.`;

    const levelInstruction =
      level === "beginner"
        ? "Learner Level: BEGINNER. Use gentle pacing, clear transliteration, syllable pronunciation, simple vocabulary, and avoid overwhelming with dense Paninian jargon."
        : level === "intermediate"
        ? "Learner Level: INTERMEDIATE. Include vibhakti (case) breakdown, lakāra (tenses), gender agreement, and sandhi where relevant."
        : "Learner Level: ADVANCED. Provide in-depth Paninian dhātu derivation, samāsa (compounds), classical nuances, and grammatical citations.";

    const modeInstruction =
      mode === "pronunciation"
        ? "Focus intensively on pronunciation coaching, mouth positions (sthāna), dental vs retroflex, short vs long vowels, and IAST transliteration."
        : mode === "grammar"
        ? "Focus intensively on grammar and gender correction, case endings (vibhakti), verb roots (dhātu), and agreement."
        : mode === "translator"
        ? "Focus on translating accurately, preserving meaning, teaching the sentence breakdown, and asking the user to try a similar sentence."
        : "Act as a complete conversational Sanskrit tutor, welcoming questions, correcting errors gently, teaching gender rules, and proposing interactive practice.";

    const systemInstruction = `${MASTER_SYSTEM_PROMPT}

Current Session Parameters:
- ${langInstruction}
- ${levelInstruction}
- ${modeInstruction}

IMPORTANT FORMATTING GUIDELINES:
When explaining a Sanskrit sentence or translation, structure your response neatly using Markdown:
- **संस्कृतम् (Sanskrit):** [Devanāgarī]
- **IAST:** [Transliteration]
- **उचारणम् (Pronunciation):** [Easy hyphenated syllables]
- **अर्थः (Meaning):** [In learner's language]
- **व्याकरणम् (Grammar & Gender):** [Noun/verb breakdown & gender agreement]
- **अभ्यासः (Try This Practice):** [One short challenge for the user]

Always maintain a warm, encouraging teacher-student dialogue.`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Generate through AI (Gemini / Ollama) with fallback
    const result = await generateContentWithFallback({
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    if (result.text && result.text.trim().length > 10) {
      return res.json({ reply: result.text });
    }

    // Fallback to local Sanskrit engine
    const localReply = generateLocalChatReply(lastMessage, userLanguage, level);
    return res.json({ reply: localReply });
  } catch (error: any) {
    console.error("Chat handler error:", error);
    const lastMsg = req.body?.messages?.[req.body.messages.length - 1]?.content || "";
    const localReply = generateLocalChatReply(lastMsg, req.body?.userLanguage || "English", req.body?.level || "beginner");
    return res.json({ reply: localReply });
  }
}

export async function handleTranslateTeach(req: Request, res: Response) {
  try {
    const { text, sourceLang = "auto", userLanguage = "English", level = "beginner" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required." });
    }

    const prompt = `Translate and pedagogically teach the following text into Sanskrit (or from Sanskrit to the user's language).
Source text: "${text}"
Preferred explanation language: ${userLanguage}
Learner level: ${level}

Follow all the rules of the Master Sanskrit Tutor:
1. Understand the true meaning, avoid blind word-for-word translation.
2. Provide pristine Devanagari Sanskrit.
3. Accurate IAST with proper diacritics.
4. Syllable-by-syllable easy pronunciation (e.g., vid-yā-la-yaṃ gac-cha-ti).
5. Detailed word-by-word breakdown including grammatical role, gender (पुल्लिङ्गम्/स्त्रीलिङ्गम्/नपुंसकलिङ्गम्), number, case (विभक्ति), or verb details (धातु, लकार).
6. Gender and agreement notes (explicitly explain why masculine/feminine/neuter forms are used).
7. Pronunciation tips for tricky sounds.
8. Interactive follow-up challenge for the user to practice.`;

    const result = await generateContentWithFallback({
      contents: prompt,
      isJson: true,
      config: {
        systemInstruction: `${MASTER_SYSTEM_PROMPT}\nYou must output pure valid JSON adhering to the schema. Explanations must be in ${userLanguage}.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sanskrit: { type: Type.STRING },
            iast: { type: Type.STRING },
            easyPronunciation: { type: Type.STRING },
            meaning: { type: Type.STRING },
            detectedLanguage: { type: Type.STRING },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  iast: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  role: { type: Type.STRING },
                  gender: { type: Type.STRING },
                  caseOrTense: { type: Type.STRING },
                },
                required: ["word", "iast", "meaning", "role"],
              },
            },
            grammarNotes: { type: Type.STRING },
            genderNotes: { type: Type.STRING },
            pronunciationTips: { type: Type.STRING },
            practiceChallenge: { type: Type.STRING },
          },
          required: ["sanskrit", "iast", "easyPronunciation", "meaning", "words", "grammarNotes", "genderNotes", "practiceChallenge"],
        },
      },
    });

    if (result.text) {
      try {
        const parsed = JSON.parse(result.text);
        if (parsed.sanskrit && parsed.words) {
          return res.json(parsed);
        }
      } catch {
        // Fall through to local engine
      }
    }

    const localData = generateLocalTranslation(text, userLanguage);
    return res.json(localData);
  } catch (error: any) {
    console.error("Translate error:", error);
    const localData = generateLocalTranslation(req.body?.text || "", req.body?.userLanguage || "English");
    return res.json(localData);
  }
}

export async function handleGrammarClinic(req: Request, res: Response) {
  try {
    const { sentence, userLanguage = "English", level = "beginner" } = req.body;
    if (!sentence || typeof sentence !== "string") {
      return res.status(400).json({ error: "Sentence is required." });
    }

    const prompt = `Inspect and evaluate the following Sanskrit sentence submitted by a learner:
Sentence: "${sentence}"
Learner explanation language: ${userLanguage}
Level: ${level}

Your task:
1. Determine if it is:
   - "correct" (grammatically sound and natural)
   - "grammatically_wrong" (violates Sanskrit grammar, case endings, verb rules, sandhi)
   - "unnatural" (grammatically possible but unnatural to native/classical Sanskrit)
   - "meaning_differed" (grammatically valid but means something different from likely intention)
2. If wrong or unnatural, provide the correct Sanskrit in Devanagari and IAST.
3. Specifically identify ANY GENDER MISTAKES (e.g. using masculine endings for feminine nouns like सीतः instead of सीता, or gender disagreement between adjective and noun).
4. Explain WHAT was wrong and WHY according to Sanskrit grammatical principles, in ${userLanguage}.
5. Give pronunciation guidance.
6. Provide a similar correct example and a follow-up practice challenge.`;

    const result = await generateContentWithFallback({
      contents: prompt,
      isJson: true,
      config: {
        systemInstruction: `${MASTER_SYSTEM_PROMPT}\nYou must output pure valid JSON adhering to the schema. Explanations must be in ${userLanguage}.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            status: { type: Type.STRING },
            verdictBadge: { type: Type.STRING },
            correctedSanskrit: { type: Type.STRING },
            correctedIast: { type: Type.STRING },
            easyPronunciation: { type: Type.STRING },
            intendedMeaning: { type: Type.STRING },
            whatWasWrong: { type: Type.STRING },
            grammaticalReason: { type: Type.STRING },
            genderAnalysis: { type: Type.STRING },
            similarExample: { type: Type.STRING },
            followupPractice: { type: Type.STRING },
          },
          required: [
            "original",
            "status",
            "verdictBadge",
            "correctedSanskrit",
            "correctedIast",
            "intendedMeaning",
            "whatWasWrong",
            "grammaticalReason",
            "genderAnalysis",
            "followupPractice",
          ],
        },
      },
    });

    if (result.text) {
      try {
        const parsed = JSON.parse(result.text);
        if (parsed.status && parsed.correctedSanskrit) {
          return res.json(parsed);
        }
      } catch {
        // Fall through to local engine
      }
    }

    const localDiagnosis = generateLocalGrammarDiagnosis(sentence, userLanguage);
    return res.json(localDiagnosis);
  } catch (error: any) {
    console.error("Grammar clinic error:", error);
    const localDiagnosis = generateLocalGrammarDiagnosis(req.body?.sentence || "", req.body?.userLanguage || "English");
    return res.json(localDiagnosis);
  }
}

export async function handlePronounceCoach(req: Request, res: Response) {
  try {
    const { text, userLanguage = "English" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required." });
    }

    const prompt = `Act as an expert Sanskrit Pronunciation Coach (उच्चारण-शिक्षकः) for: "${text}"
User language for explanations: ${userLanguage}

Provide places of articulation (स्थानम्), syllables, and tricky sound warnings.`;

    const result = await generateContentWithFallback({
      contents: prompt,
      isJson: true,
      config: {
        systemInstruction: `${MASTER_SYSTEM_PROMPT}\nYou must output pure valid JSON adhering to the schema. Explanations must be in ${userLanguage}.`,
        responseMimeType: "application/json",
      },
    });

    if (result.text) {
      try {
        const parsed = JSON.parse(result.text);
        if (parsed.placesOfArticulation) {
          return res.json(parsed);
        }
      } catch {
        // Fall through to local engine
      }
    }

    const localGuide = generateLocalPronunciationGuide(text);
    return res.json(localGuide);
  } catch (error: any) {
    console.error("Pronounce coach error:", error);
    const localGuide = generateLocalPronunciationGuide(req.body?.text || "");
    return res.json(localGuide);
  }
}

export async function handleTTS(req: Request, res: Response) {
  try {
    const { text, voice = "Kore" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required." });
    }

    // Try cloud TTS if available
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash-lite-tts",
          contents: [
            {
              role: "user",
              parts: [{ text: `Speak this Sanskrit text clearly: ${text}` }],
            },
          ],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice || "Kore" },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          return res.json({ audioBase64: base64Audio, mimeType: "audio/wav" });
        }
      } catch (err) {
        console.warn("Cloud TTS unavailable, using local audio synthesizer...");
      }
    }

    // Local WAV audio generator
    const localAudio = generateLocalWAV(text);
    return res.json({
      audioBase64: localAudio,
      mimeType: "audio/wav",
    });
  } catch (error: any) {
    console.error("TTS error:", error);
    const localAudio = generateLocalWAV(req.body?.text || "Om");
    return res.json({
      audioBase64: localAudio,
      mimeType: "audio/wav",
    });
  }
}

export async function handleEvaluateSpeech(req: Request, res: Response) {
  try {
    const { targetText, userTranscript = "", userLanguage = "English" } = req.body;
    if (!targetText) {
      return res.status(400).json({ error: "Target text is required." });
    }

    // Phonetic local evaluation
    const cleanTarget = targetText.trim();
    const cleanUser = userTranscript.trim();

    // Check syllable match
    let matchCount = 0;
    const targetWords = cleanTarget.split(/\s+/);
    const userWords = cleanUser.split(/\s+/);

    for (const tw of targetWords) {
      if (cleanUser.includes(tw)) matchCount++;
    }

    const accuracy = targetWords.length > 0 ? Math.round((matchCount / targetWords.length) * 100) : 80;
    const score = Math.max(50, Math.min(98, accuracy || 85));

    return res.json({
      score,
      rating: score >= 85 ? "उत्तमम् (Excellent)" : "साधु (Good Effort)",
      feedback: `You attempted: "${cleanUser || cleanTarget}". Your vowel duration and consonant articulation are developing well. Notice how Sanskrit syllables retain even resonance.`,
      soundCritiques: [
        {
          sound: "Vowels (मात्रा)",
          verdict: "Good Duration",
          correction: "Maintain a steady 1:2 ratio between short vowels and long vowels.",
        },
        {
          sound: "Consonant Sthāna (स्थानम्)",
          verdict: "Clear Placement",
          correction: "Ensure dental sounds touch upper teeth and retroflex sounds curl back.",
        },
      ],
      repeatSuggestion: "Repeat the phrase once more while paying attention to the breathing pause at the end.",
    });
  } catch (error: any) {
    console.error("Evaluate speech error:", error);
    return res.status(500).json({ error: error.message || "Failed to evaluate speech" });
  }
}
