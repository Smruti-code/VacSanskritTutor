export interface SanskritPhrase {
  devanagari: string;
  iast: string;
  syllables: string;
  english: string;
  tamil: string;
  hindi: string;
  telugu: string;
  grammarNote: string;
  category: 'greeting' | 'daily' | 'polite' | 'wisdom';
}

export const COMMON_PHRASES: SanskritPhrase[] = [
  {
    devanagari: "नमस्ते / नमस्कारः",
    iast: "namaste / namaskāraḥ",
    syllables: "na-mas-te / na-mas-kā-raḥ",
    english: "Greetings / I bow to you",
    tamil: "வணக்கம்",
    hindi: "नमस्ते / प्रणाम",
    telugu: "నమస్కారం",
    grammarNote: "नमः + ते = नमस्ते (Sandhi: Visarga changes to s before t. 'I bow to you').",
    category: "greeting"
  },
  {
    devanagari: "सुप्रभातम्",
    iast: "suprabhātam",
    syllables: "su-pra-bhā-tam",
    english: "Good morning",
    tamil: "காலை வணக்கம்",
    hindi: "सुप्रभात",
    telugu: "శుభోదయం",
    grammarNote: "सु (good/auspicious prefix) + प्रभातम् (morning, neuter noun).",
    category: "greeting"
  },
  {
    devanagari: "भवतः नाम किम्?",
    iast: "bhavataḥ nāma kim?",
    syllables: "bha-va-taḥ nā-ma kim?",
    english: "What is your name? (to a male)",
    tamil: "உங்கள் பெயர் என்ன? (ஆணிடம்)",
    hindi: "आपका नाम क्या है? (पुरुष से)",
    telugu: "మీ పేరు ఏమిటి? (పురుషుడితో)",
    grammarNote: "भवतः is genitive singular (षष्ठी एकवचन) of masculine भवान्. Compare with feminine भsequential.",
    category: "daily"
  },
  {
    devanagari: "भवत्याः नाम किम्?",
    iast: "bhavatyāḥ nāma kim?",
    syllables: "bha-vat-yāḥ nā-ma kim?",
    english: "What is your name? (to a female)",
    tamil: "உங்கள் பெயர் என்ன? (பெண்ணிடம்)",
    hindi: "आपका नाम क्या है? (स्त्री से)",
    telugu: "మీ పేరు ఏమిటి? (స్త్రీతో)",
    grammarNote: "भवत्याः is genitive singular (षष्ठी एकवचन) of feminine भवती (ईकारान्त स्त्रीलिङ्ग). Always distinguish male vs female address!",
    category: "daily"
  },
  {
    devanagari: "मम नाम आनन्दः / मम नाम प्रिया।",
    iast: "mama nāma ānandaḥ / mama nāma priyā.",
    syllables: "ma-ma nā-ma ā-nan-daḥ / pri-yā",
    english: "My name is Anand / My name is Priya.",
    tamil: "என் பெயர் ஆனந்த் / என் பெயர் பிரியா.",
    hindi: "मेरा नाम आनंद है / मेरा नाम प्रिया है।",
    telugu: "నా పేరు ఆనంద్ / నా పేరు ప్రియ.",
    grammarNote: "मम = my (अस्मद् षष्ठी एकवचन). Masculine name gets visarga (आनन्दः); feminine आकारान्त does not (प्रिया).",
    category: "daily"
  },
  {
    devanagari: "भवान् कथम् अस्ति? / भवती कथम् अस्ति?",
    iast: "bhavān katham asti? / bhavatī katham asti?",
    syllables: "bha-vān ka-tham as-ti? / bha-va-tī ka-tham as-ti?",
    english: "How are you? (M / F)",
    tamil: "நீங்கள் எப்படி இருக்கிறீர்கள்? (ஆண் / பெண்)",
    hindi: "आप कैसे हैं? / आप कैसी हैं?",
    telugu: "మీరు ఎలా ఉన్నారు?",
    grammarNote: "भवान् (m. nominative) / भवती (f. nominative) + कथम् (how) + अस्ति (is, अस् धातु लट् लकार).",
    category: "daily"
  },
  {
    devanagari: "अहं कुशली अस्मि (पु) / अहं कुशलिनी अस्मि (स्त्री)।",
    iast: "ahaṃ kuśalī asmi / ahaṃ kuśalinī asmi.",
    syllables: "a-haṃ ku-śa-lī as-mi / ku-śa-li-nī as-mi",
    english: "I am doing well (Male / Female)",
    tamil: "நான் நலமாக இருக்கிறேன் (ஆண் / பெண்)",
    hindi: "मैं सकुशल हूँ।",
    telugu: "నేను బాగున్నాను.",
    grammarNote: "GENDER AGREEMENT: A male speaker says कुशली; a female speaker says कुशलिनी. Gender always applies to adjectives!",
    category: "daily"
  },
  {
    devanagari: "धन्यवादः",
    iast: "dhanyavādaḥ",
    syllables: "dhan-ya-vā-daḥ",
    english: "Thank you",
    tamil: "நன்றி",
    hindi: "धन्यवाद",
    telugu: "ధన్యవాదాలు",
    grammarNote: "धन्य (fortunate/blessed) + वादः (expression/utterance). Masculine nominative singular.",
    category: "polite"
  },
  {
    devanagari: "क्षम्यताम्",
    iast: "kṣamyatām",
    syllables: "kṣam-ya-tām",
    english: "Pardon me / Excuse me / Sorry",
    tamil: "மன்னிக்கவும்",
    hindi: "क्षमा करें",
    telugu: "క్షమించండి",
    grammarNote: "क्षम् धातु (to forgive/pardon), passive imperative (कर्मणि लोट् लकार). Polite request form.",
    category: "polite"
  },
  {
    devanagari: "पुनर्मिलामः",
    iast: "punarmilāmaḥ",
    syllables: "pu-nar-mi-lā-maḥ",
    english: "See you again / Until next time",
    tamil: "மீண்டும் சந்திப்போம்",
    hindi: "फिर मिलेंगे",
    telugu: "మళ్ళీ కలుద్దాం",
    grammarNote: "पुनर् (again) + मिलामः (we meet, मिल् धातु लट् उत्तमपुरुष बहुवचन).",
    category: "polite"
  },
  {
    devanagari: "सत्यमेव जयते नानृतम्।",
    iast: "satyameva jayate nānṛtam.",
    syllables: "sat-yam-e-va ja-ya-te nān-ṛ-tam",
    english: "Truth alone triumphs, not falsehood.",
    tamil: "வாய்மையே வெல்லும், பொய்மை அல்ல.",
    hindi: "सत्य की ही जीत होती है, असत्य की नहीं।",
    telugu: "సత్యమే జయిస్తుంది, అసత్యం కాదు.",
    grammarNote: "सत्यम् (neuter) + एव + जयते (जि धातु आत्मनेपद). न + अनृतम् = नानृतम् (दीर्घ सन्धि).",
    category: "wisdom"
  },
  {
    devanagari: "विद्या ददाति विनयम्।",
    iast: "vidyā dadāti vinayam.",
    syllables: "vid-yā da-dā-ti vi-na-yam",
    english: "Knowledge bestows humility.",
    tamil: "கல்வி பணிவைக் கொடுக்கிறது.",
    hindi: "विद्या विनय देती है।",
    telugu: "విద్య వినయాన్ని ఇస్తుంది.",
    grammarNote: "विद्या (feminine subject आकारान्त) + ददाति (दा धातु verb) + विनयम् (neuter accusative object द्वितीया).",
    category: "wisdom"
  }
];

export interface TrickySoundGroup {
  id: string;
  title: string;
  sanskritLetters: string;
  iastComparison: string;
  differenceExplained: string;
  drillWords: Array<{ word: string; iast: string; meaning: string }>;
  tip: string;
}

export const TRICKY_SOUNDS: TrickySoundGroup[] = [
  {
    id: "dental-retroflex-t",
    title: "Dental (त) vs Retroflex (ट)",
    sanskritLetters: "त / थ  vs  ट / ठ",
    iastComparison: "t / th  vs  ṭ / ṭh",
    differenceExplained: "In त (ta), tongue tip firmly touches the back of upper front teeth (Dantya). In ट (ṭa), tongue tip curls backwards against the hard palate/roof of the mouth (Mūrdhanya). Never use English alveolar 't' for either!",
    drillWords: [
      { word: "तातः", iast: "tātaḥ", meaning: "father (dental t)" },
      { word: "टीका", iast: "ṭīkā", meaning: "commentary (retroflex ṭ)" },
      { word: "तरुः", iast: "taruḥ", meaning: "tree (dental t)" },
      { word: "टङ्कः", iast: "ṭaṅkaḥ", meaning: "chisel / coin (retroflex ṭ)" }
    ],
    tip: "Touch your teeth for त; curl tongue backward to roof for ट."
  },
  {
    id: "dental-retroflex-d",
    title: "Dental (द/ध) vs Retroflex (ड/ढ)",
    sanskritLetters: "द / ध  vs  ड / ढ",
    iastComparison: "d / dh  vs  ḍ / ḍh",
    differenceExplained: "द (da) is dental: tongue presses against upper front teeth. ड (ḍa) is retroflex: tongue curls back to roof of palate. ध and ढ are their aspirated counterparts with a clear burst of air.",
    drillWords: [
      { word: "दानम्", iast: "dānam", meaning: "charity / giving (dental d)" },
      { word: "डमरुः", iast: "ḍamaruḥ", meaning: "Shiva's drum (retroflex ḍ)" },
      { word: "धर्मः", iast: "dharmaḥ", meaning: "duty / righteousness (dental dh)" },
      { word: "ढक्का", iast: "ḍhakkā", meaning: "large drum (retroflex ḍh)" }
    ],
    tip: "Keep dental soft against teeth, don't let it drift back towards English 'd'."
  },
  {
    id: "dental-retroflex-n",
    title: "Dental (न) vs Retroflex (ण)",
    sanskritLetters: "न  vs  ण",
    iastComparison: "n  vs  ṇ",
    differenceExplained: "न (na) is dental. ण (ṇa) is retroflex. In Paninian Sanskrit, the rule 'रषाभ्यां नो णः समानपदे' changes dental n to retroflex ṇ after r or ṣ (e.g., रामेण, not रामेन).",
    drillWords: [
      { word: "नाम", iast: "nāma", meaning: "name (dental n)" },
      { word: "वीणा", iast: "vīṇā", meaning: "veena instrument (retroflex ṇ)" },
      { word: "रामेण", iast: "rāmeṇa", meaning: "by Rama (retroflex ṇ after r)" },
      { word: "बालकेन", iast: "bālakena", meaning: "by boy (dental n, no r or ṣ)" }
    ],
    tip: "Notice how रामेण has ṇ because of 'r', but बालकेन stays n!"
  },
  {
    id: "sibilants-three-s",
    title: "The Three Sibilants: Palatal (श) vs Retroflex (ष) vs Dental (स)",
    sanskritLetters: "श  vs  ष  vs  स",
    iastComparison: "ś  vs  ṣ  vs  s",
    differenceExplained: "Sanskrit has 3 distinct 's' sounds! श (ś) is Palatal (Tālavya) made with tongue flat against middle roof (like German 'ich' or soft 'sh'). ष (ṣ) is Retroflex (Mūrdhanya) with tongue curled back. स (s) is pure Dental (Dantya) like 'sun'.",
    drillWords: [
      { word: "शिवः", iast: "śivaḥ", meaning: "Shiva (Palatal ś)" },
      { word: "कृष्णः", iast: "kṛṣṇaḥ", meaning: "Krishna (Retroflex ṣ)" },
      { word: "सूर्यः", iast: "sūryaḥ", meaning: "Sun (Dental s)" },
      { word: "शास्त्रम्", iast: "śāstram", meaning: "scripture (starts with ś, has s)" }
    ],
    tip: "श is flat & gentle; ष has curled tongue producing deeper resonance; स is sharp on teeth."
  },
  {
    id: "vowel-lengths",
    title: "Short (ह्रस्व) vs Long (दीर्घ) Vowels",
    sanskritLetters: "अ/आ, इ/ई, उ/ऊ",
    iastComparison: "a/ā, i/ī, u/ū",
    differenceExplained: "In Sanskrit, vowel duration (mātrā) changes the entire meaning of a word! Short vowel has 1 mātrā; long vowel has 2 mātrās. Example: वद (vada = speak!) vs वादा (vādā = dispute/discourse).",
    drillWords: [
      { word: "शिव", iast: "śiva", meaning: "auspicious / Shiva (masculine)" },
      { word: "शिवा", iast: "śivā", meaning: "Parvati (feminine with long ā)" },
      { word: "सुता", iast: "sutā", meaning: "daughter (long ā)" },
      { word: "सुतः", iast: "sutaḥ", meaning: "son (short a with visarga)" }
    ],
    tip: "Hold long vowels exactly twice as long as short ones."
  }
];

export interface GenderRuleExample {
  title: string;
  trap: string;
  correction: string;
  explanation: string;
  genderCategory: "पुल्लिङ्गम् (M)" | "स्त्रीलिङ्गम् (F)" | "नपुंसकलिङ्गम् (N)";
}

export const GENDER_CLINIC_EXAMPLES: GenderRuleExample[] = [
  {
    title: "The Classic Sita Trap (सीतः vs सीता)",
    trap: "सीतः वनं गच्छति।",
    correction: "सीता वनं गच्छति।",
    explanation: "सीता is an आकारान्त feminine noun (स्त्रीलिङ्ग). Masculine nouns ending in 'a' like राम take visarga in nominative (रामः), but feminine nouns ending in 'ā' DO NOT take visarga in nominative singular. Writing 'सीतः' is an invalid grammatical form!",
    genderCategory: "स्त्रीलिङ्गम् (F)"
  },
  {
    title: "Adjective-Noun Agreement (सुन्दरः vs सुन्दरी vs सुन्दरम्)",
    trap: "सुन्दरः बालिका पठति।",
    correction: "सुन्दरी बालिका पठति।",
    explanation: "In Sanskrit, adjectives must strictly agree in gender, number, and case with the noun they qualify. Because बालिका is feminine (स्त्रीलिङ्ग), the adjective must be सुन्दरी, not the masculine सुन्दरः.",
    genderCategory: "स्त्रीलिङ्गम् (F)"
  },
  {
    title: "Neuter Nouns: Natural vs Grammatical Gender",
    trap: "फलः पतति।",
    correction: "फलं पतति। (or फलम्)",
    explanation: "फल (fruit) is inherently NEUTER (नपुंसकलिङ्गम्), so its nominative singular is फलम्, never फलः. Similarly मित्रम् (friend) is neuter! Always memorize Sanskrit nouns with their grammatical gender.",
    genderCategory: "नपुंसकलिङ्गम् (N)"
  },
  {
    title: "River (नदी) and Feminine ईकारान्त",
    trap: "नदीः प्रवहति।",
    correction: "नदी प्रवहति।",
    explanation: "नदी (river) in nominative singular is just नदी (no visarga). 'नदीः' is actually the accusative plural (द्वितीया बहुवचन)! Misusing visarga alters the case from subject to direct object.",
    genderCategory: "स्त्रीलिङ्गम् (F)"
  }
];

export const QUICK_PROMPTS = [
  { label: "Translate: I am going to school", query: "I want to say 'I am going to school' in Sanskrit." },
  { label: "Correct: सीतः विद्यालयं गच्छति", query: "Can you correct this sentence: सीतः विद्यालयं गच्छति" },
  { label: "Difference: त (ta) vs ट (ṭa)", query: "Can you explain and coach me on the difference between dental त and retroflex ट with audio?" },
  { label: "Explain: sundaraḥ bālakaḥ vs sundarī bālikā", query: "Explain why सुन्दरः बालकः becomes सुन्दरी बालिका in Sanskrit gender agreement." },
  { label: "Tamil: நான் சமஸ்கிருதம் படிக்கிறேன்", query: "Translate from Tamil to Sanskrit: நான் சமஸ்கிருதம் படிக்கிறேன்" },
  { label: "Hindi: सूर्य पूर्व दिशा में उगता है", query: "Translate from Hindi to Sanskrit: सूर्य पूर्व दिशा में उगता है" },
  { label: "Pronounce: धर्मक्षेत्रे कुरुक्षेत्रे", query: "How do I pronounce 'धर्मक्षेत्रे कुरुक्षेत्रे' correctly? Break down syllables." },
  { label: "Telugu: నేను సంస్కృతం నేర్చుకుంటున్నాను", query: "Translate from Telugu to Sanskrit: నేను సంస్కృతం నేర్చుకుంటున్నాను" }
];
