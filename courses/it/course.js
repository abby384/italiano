/* Italian course — content only. The engine knows nothing about Italian;
 * swap this file for another language and everything else still works.
 *
 * Item shape:
 *   { id, tier, order, type, cue, sub, a, alt?, rules[], note? }
 *
 * Types:
 *   chunk  fixed expression, produced whole from English
 *   prod   free sentence production, English -> Italian
 *   form   inflect a verb for a given person/tense
 *   trans  transform the given form (singular -> plural, etc.)
 *   cloze  supply the missing word
 */

export const RULES = {
  "frame-vorrei":   "vorrei… (polite request)",
  "frame-posso":    "posso…? (permission)",
  "frame-ce":       "c'è / ci sono (existence)",
  "frame-dove":     "dov'è…? (location)",
  "frame-quanto":   "quanto…? (price / amount)",
  "frame-avete":    "avete…? (availability)",
  "frame-ache":     "a che ora…? (time)",
  "frame-mipuo":    "mi può / mi puoi… (asking help)",
  "frame-social":   "Social fixed phrases",
  "neg-non":        "Negation with non",
  "word-core":      "High-frequency connectors",
  "verb-essere":    "essere",
  "verb-avere":     "avere",
  "verb-fare":      "fare",
  "verb-andare":    "andare",
  "verb-stare":     "stare",
  "verb-potere":    "potere",
  "verb-volere":    "volere",
  "verb-dovere":    "dovere",
  "verb-sapere":    "sapere",
  "verb-are":       "Regular -are",
  "verb-ere":       "Regular -ere",
  "verb-ire":       "Regular -ire",
  "verb-ire-isc":   "-ire with -isc-",
  "art-def":        "Definite articles",
  "art-lo-gli":     "lo / gli triggers",
  "art-indef":      "Indefinite articles",
  "art-prep":       "Preposition + article",
  "plural-basic":   "Regular plurals",
  "plural-odd":     "Irregular plurals"
};

export const TIERS = [
  { n: 0, name: "Survival frames", blurb: "Sentence factories. Learn the frame, swap the contents." },
  { n: 1, name: "Core engine", blurb: "The verbs and connectors that carry most of everyday speech." },
  { n: 2, name: "Structure", blurb: "Regular conjugation, articles, gender, plurals." }
];

const PERSONS = ["io", "tu", "lui/lei", "noi", "voi", "loro"];

/* Expand a verb table into six conjugation items. */
function verbItems(tier, inf, en, rule, forms, tense = "Presente") {
  return forms.map((f, i) => ({
    tier, type: "form",
    cue: inf, sub: `${tense} · ${PERSONS[i]}`, a: f,
    rules: [rule], note: en
  }));
}

const T0 = [
  ["I'd like a coffee, please", "vorrei un caffè, per favore", "frame-vorrei"],
  ["I'd like a table for two", "vorrei un tavolo per due", "frame-vorrei"],
  ["I'd like to book", "vorrei prenotare", "frame-vorrei"],
  ["I'd like to pay", "vorrei pagare", "frame-vorrei"],
  ["I'd like this one", "vorrei questo", "frame-vorrei"],
  ["Can I pay by card?", "posso pagare con la carta?", "frame-posso"],
  ["Can I see the menu?", "posso vedere il menù?", "frame-posso"],
  ["May I come in?", "posso entrare?", "frame-posso"],
  ["Can I try it?", "posso provarlo?", "frame-posso"],
  ["Is there a bathroom?", "c'è un bagno?", "frame-ce"],
  ["Is there a table free?", "c'è un tavolo libero?", "frame-ce"],
  ["Are there any tables?", "ci sono tavoli?", "frame-ce"],
  ["There's a problem", "c'è un problema", "frame-ce"],
  ["Where is the station?", "dov'è la stazione?", "frame-dove"],
  ["Where is the bathroom?", "dov'è il bagno?", "frame-dove"],
  ["Where is the exit?", "dov'è l'uscita?", "frame-dove"],
  ["Where are we?", "dove siamo?", "frame-dove"],
  ["How much is it?", "quanto costa?", "frame-quanto"],
  ["How much is the total?", "quant'è?", "frame-quanto"],
  ["How long does it take?", "quanto tempo ci vuole?", "frame-quanto"],
  ["Do you have a table for two?", "avete un tavolo per due?", "frame-avete"],
  ["Do you have wifi?", "avete il wifi?", "frame-avete"],
  ["Do you have it in black?", "avete questo in nero?", "frame-avete"],
  ["What time does it open?", "a che ora apre?", "frame-ache"],
  ["What time does it close?", "a che ora chiude?", "frame-ache"],
  ["What time is the train?", "a che ora è il treno?", "frame-ache"],
  ["Can you help me?", "mi può aiutare?", "frame-mipuo"],
  ["Can you tell me where it is?", "mi può dire dov'è?", "frame-mipuo"],
  ["Can you repeat that?", "può ripetere?", "frame-mipuo"],
  ["The bill, please", "il conto, per favore", "frame-social"],
  ["I don't understand", "non capisco", "frame-social"],
  ["Slower, please", "più piano, per favore", "frame-social"],
  ["Do you speak English?", "parla inglese?", "frame-social"],
  ["To take away", "da portare via", "frame-social"],
  ["Without ice", "senza ghiaccio", "frame-social"],
  ["That's fine / keep the change", "va bene così", "frame-social"],
  ["Excuse me, a question", "scusi, una domanda", "frame-social"],
  ["I have a reservation", "ho una prenotazione", "frame-social"],
  ["What do you recommend?", "che cosa mi consiglia?", "frame-social"],
  ["I'll take it", "lo prendo", "frame-social"],
  ["How do you say…?", "come si dice…?", "frame-social"],
  ["What does it mean?", "che significa?", "frame-social"],
  ["I'm looking for…", "sto cercando…", "frame-social"],
  ["It's too expensive", "è troppo caro", "frame-social"],
  ["Is it far?", "è lontano?", "frame-social"],
  ["I'll be right there", "arrivo subito", "frame-social"]
].map(([en, it, rule]) => ({
  tier: 0, type: "chunk", cue: en, sub: "Say it in Italian", a: it, rules: [rule]
}));

const T1_VERBS = [
  ...verbItems(1, "essere", "to be", "verb-essere", ["sono", "sei", "è", "siamo", "siete", "sono"]),
  ...verbItems(1, "avere", "to have", "verb-avere", ["ho", "hai", "ha", "abbiamo", "avete", "hanno"]),
  ...verbItems(1, "fare", "to do / make", "verb-fare", ["faccio", "fai", "fa", "facciamo", "fate", "fanno"]),
  ...verbItems(1, "andare", "to go", "verb-andare", ["vado", "vai", "va", "andiamo", "andate", "vanno"]),
  ...verbItems(1, "stare", "to stay / be", "verb-stare", ["sto", "stai", "sta", "stiamo", "state", "stanno"]),
  ...verbItems(1, "potere", "can", "verb-potere", ["posso", "puoi", "può", "possiamo", "potete", "possono"]),
  ...verbItems(1, "volere", "to want", "verb-volere", ["voglio", "vuoi", "vuole", "vogliamo", "volete", "vogliono"]),
  ...verbItems(1, "dovere", "must", "verb-dovere", ["devo", "devi", "deve", "dobbiamo", "dovete", "devono"]),
  ...verbItems(1, "sapere", "to know", "verb-sapere", ["so", "sai", "sa", "sappiamo", "sapete", "sanno"])
];

const T1_PROD = [
  ["I'm American", "sono americano", "verb-essere"],
  ["Where are you from?", "di dove sei?", "verb-essere"],
  ["It's late", "è tardi", "verb-essere"],
  ["We're ready", "siamo pronti", "verb-essere"],
  ["I have two brothers", "ho due fratelli", "verb-avere"],
  ["How old are you?", "quanti anni hai?", "verb-avere"],
  ["I'm hungry", "ho fame", "verb-avere"],
  ["I'm thirsty", "ho sete", "verb-avere"],
  ["What do you do for work?", "che lavoro fai?", "verb-fare"],
  ["It's cold", "fa freddo", "verb-fare"],
  ["It's hot today", "oggi fa caldo", "verb-fare"],
  ["I'm going home", "vado a casa", "verb-andare"],
  ["We're going to eat", "andiamo a mangiare", "verb-andare"],
  ["How are you?", "come stai?", "verb-stare"],
  ["I'm well, thanks", "sto bene, grazie", "verb-stare"],
  ["I want to go", "voglio andare", "verb-volere"],
  ["I have to go", "devo andare", "verb-dovere"],
  ["Do you know where it is?", "sai dov'è?", "verb-sapere"],
  ["I don't know", "non lo so", "neg-non"],
  ["I'm not Italian", "non sono italiano", "neg-non"],
  ["I don't have time", "non ho tempo", "neg-non"],
  ["I can't", "non posso", "neg-non"],
  ["We're not going", "non andiamo", "neg-non"]
].map(([en, it, rule]) => ({
  tier: 1, type: "prod", cue: en, sub: "Say it in Italian", a: it, rules: [rule]
}));

const T1_WORDS = [
  ["so / well then (the universal opener)", "allora"],
  ["therefore / so", "quindi"],
  ["but / though (conversational)", "però"],
  ["maybe / if only!", "magari"],
  ["actually / on the contrary", "anzi"],
  ["I mean / that is", "cioè"],
  ["dunno (a verbal shrug)", "boh"],
  ["come on", "dai"],
  ["not at all (negative emphasis)", "mica"],
  ["anyway / however", "comunque"],
  ["indeed / exactly right", "infatti"],
  ["unfortunately", "purtroppo"],
  ["precisely / that's my point", "appunto"],
  ["well… / sort of", "insomma"],
  ["instead / whereas", "invece"],
  ["already", "già"],
  ["still / yet / again", "ancora"],
  ["just / as soon as", "appena"],
  ["almost", "quasi"],
  ["enough / fairly", "abbastanza"],
  ["me too", "anch'io"],
  ["gladly", "volentieri"],
  ["don't mention it", "figurati"]
].map(([en, it]) => ({
  tier: 1, type: "chunk", cue: en, sub: "One word", a: it, rules: ["word-core"]
}));

const T2_VERBS = [
  ...verbItems(2, "parlare", "to speak", "verb-are", ["parlo", "parli", "parla", "parliamo", "parlate", "parlano"]),
  ...verbItems(2, "mangiare", "to eat", "verb-are", ["mangio", "mangi", "mangia", "mangiamo", "mangiate", "mangiano"]),
  ...verbItems(2, "abitare", "to live / reside", "verb-are", ["abito", "abiti", "abita", "abitiamo", "abitate", "abitano"]),
  ...verbItems(2, "credere", "to believe", "verb-ere", ["credo", "credi", "crede", "crediamo", "credete", "credono"]),
  ...verbItems(2, "prendere", "to take", "verb-ere", ["prendo", "prendi", "prende", "prendiamo", "prendete", "prendono"]),
  ...verbItems(2, "dormire", "to sleep", "verb-ire", ["dormo", "dormi", "dorme", "dormiamo", "dormite", "dormono"]),
  ...verbItems(2, "aprire", "to open", "verb-ire", ["apro", "apri", "apre", "apriamo", "aprite", "aprono"]),
  ...verbItems(2, "capire", "to understand", "verb-ire-isc", ["capisco", "capisci", "capisce", "capiamo", "capite", "capiscono"]),
  ...verbItems(2, "finire", "to finish", "verb-ire-isc", ["finisco", "finisci", "finisce", "finiamo", "finite", "finiscono"])
];

const T2_ART = [
  ["studente", "lo", "art-lo-gli"], ["zaino", "lo", "art-lo-gli"],
  ["psicologo", "lo", "art-lo-gli"], ["gnocco", "lo", "art-lo-gli"],
  ["yogurt", "lo", "art-lo-gli"], ["specchio", "lo", "art-lo-gli"],
  ["zio", "lo", "art-lo-gli"], ["sport", "lo", "art-lo-gli"],
  ["libro", "il", "art-def"], ["cane", "il", "art-def"],
  ["treno", "il", "art-def"], ["problema", "il", "art-def"],
  ["ristorante", "il", "art-def"], ["amico", "l'", "art-def"],
  ["albergo", "l'", "art-def"], ["ora", "l'", "art-def"],
  ["amica", "l'", "art-def"], ["casa", "la", "art-def"],
  ["stazione", "la", "art-def"], ["città", "la", "art-def"],
  ["birra", "la", "art-def"], ["notte", "la", "art-def"]
].map(([noun, a, rule]) => ({
  tier: 2, type: "cloze", cue: `___ ${noun}`, sub: "Definite article", a, rules: [rule]
}));

const T2_INDEF = [
  ["studente", "uno"], ["zaino", "uno"], ["libro", "un"], ["amico", "un"],
  ["casa", "una"], ["birra", "una"], ["amica", "un'"], ["ora", "un'"]
].map(([noun, a]) => ({
  tier: 2, type: "cloze", cue: `___ ${noun}`, sub: "Indefinite article (a / an)", a, rules: ["art-indef"]
}));

const T2_PLURAL = [
  ["il libro", "i libri", "plural-basic"], ["la casa", "le case", "plural-basic"],
  ["lo studente", "gli studenti", "plural-basic"], ["l'amico", "gli amici", "plural-basic"],
  ["la notte", "le notti", "plural-basic"], ["il ristorante", "i ristoranti", "plural-basic"],
  ["l'amica", "le amiche", "plural-basic"], ["lo zaino", "gli zaini", "plural-basic"],
  ["la stazione", "le stazioni", "plural-basic"], ["il problema", "i problemi", "plural-odd"],
  ["la città", "le città", "plural-odd"], ["il bar", "i bar", "plural-odd"],
  ["la foto", "le foto", "plural-odd"], ["il braccio", "le braccia", "plural-odd"],
  ["l'uovo", "le uova", "plural-odd"], ["l'uomo", "gli uomini", "plural-odd"],
  ["la mano", "le mani", "plural-odd"], ["il dito", "le dita", "plural-odd"]
].map(([s, p, rule]) => ({
  tier: 2, type: "trans", cue: s, sub: "Make it plural (article + noun)", a: p, rules: [rule]
}));

const T2_PREP = [
  ["a + il", "al"], ["a + lo", "allo"], ["a + la", "alla"], ["a + gli", "agli"],
  ["di + il", "del"], ["di + la", "della"], ["di + gli", "degli"],
  ["da + il", "dal"], ["da + la", "dalla"],
  ["in + il", "nel"], ["in + la", "nella"], ["in + gli", "negli"],
  ["su + il", "sul"], ["su + la", "sulla"]
].map(([cue, a]) => ({
  tier: 2, type: "cloze", cue, sub: "Fuse the preposition and article", a, rules: ["art-prep"]
}));

const ALL = [...T0, ...T1_VERBS, ...T1_PROD, ...T1_WORDS, ...T2_VERBS, ...T2_ART, ...T2_INDEF, ...T2_PLURAL, ...T2_PREP];

export const COURSE = {
  id: "it",
  name: "Italian",
  rules: RULES,
  tiers: TIERS,
  items: ALL.map((it, i) => ({
    ...it,
    order: i,
    id: `${it.tier}-${it.type}-${i}`,
    alt: it.alt || []
  }))
};
