/* Italian cheat sheet — content data */

const PRONOUNS = ["io", "tu", "lui/lei", "noi", "voi", "loro"];

/* ---------- REGULAR VERBS ---------- */

const REGULAR = [
  {
    inf: "parlare",
    type: "-ARE",
    en: "to speak",
    note: "The biggest group by far. New verbs entering Italian almost always become -are (googlare, chattare).",
    tenses: {
      "Presente": ["parlo", "parli", "parla", "parliamo", "parlate", "parlano"],
      "Passato prossimo": ["ho parlato", "hai parlato", "ha parlato", "abbiamo parlato", "avete parlato", "hanno parlato"],
      "Imperfetto": ["parlavo", "parlavi", "parlava", "parlavamo", "parlavate", "parlavano"],
      "Futuro": ["parlerò", "parlerai", "parlerà", "parleremo", "parlerete", "parleranno"],
      "Condizionale": ["parlerei", "parleresti", "parlerebbe", "parleremmo", "parlereste", "parlerebbero"]
    }
  },
  {
    inf: "credere",
    type: "-ERE",
    en: "to believe",
    note: "The messiest group — most irregular verbs live here, especially in the past participle.",
    tenses: {
      "Presente": ["credo", "credi", "crede", "crediamo", "credete", "credono"],
      "Passato prossimo": ["ho creduto", "hai creduto", "ha creduto", "abbiamo creduto", "avete creduto", "hanno creduto"],
      "Imperfetto": ["credevo", "credevi", "credeva", "credevamo", "credevate", "credevano"],
      "Futuro": ["crederò", "crederai", "crederà", "crederemo", "crederete", "crederanno"],
      "Condizionale": ["crederei", "crederesti", "crederebbe", "crederemmo", "credereste", "crederebbero"]
    }
  },
  {
    inf: "dormire",
    type: "-IRE (plain)",
    en: "to sleep",
    note: "The smaller of the two -ire patterns. Also: aprire, partire, sentire, offrire, seguire.",
    tenses: {
      "Presente": ["dormo", "dormi", "dorme", "dormiamo", "dormite", "dormono"],
      "Passato prossimo": ["ho dormito", "hai dormito", "ha dormito", "abbiamo dormito", "avete dormito", "hanno dormito"],
      "Imperfetto": ["dormivo", "dormivi", "dormiva", "dormivamo", "dormivate", "dormivano"],
      "Futuro": ["dormirò", "dormirai", "dormirà", "dormiremo", "dormirete", "dormiranno"],
      "Condizionale": ["dormirei", "dormiresti", "dormirebbe", "dormiremmo", "dormireste", "dormirebbero"]
    }
  },
  {
    inf: "capire",
    type: "-IRE (-isc-)",
    en: "to understand",
    note: "Most -ire verbs are this type. Insert -isc- in all forms EXCEPT noi and voi. Also: finire, preferire, pulire, spedire, costruire.",
    tenses: {
      "Presente": ["capisco", "capisci", "capisce", "capiamo", "capite", "capiscono"],
      "Passato prossimo": ["ho capito", "hai capito", "ha capito", "abbiamo capito", "avete capito", "hanno capito"],
      "Imperfetto": ["capivo", "capivi", "capiva", "capivamo", "capivate", "capivano"],
      "Futuro": ["capirò", "capirai", "capirà", "capiremo", "capirete", "capiranno"],
      "Condizionale": ["capirei", "capiresti", "capirebbe", "capiremmo", "capireste", "capirebbero"]
    }
  }
];

const VERB_RULES = [
  { t: "Drop the ending, add the person", d: "parl-are → parl- + o/i/a/iamo/ate/ano. Every regular verb works this way. The stem never moves." },
  { t: "noi is always -iamo", d: "Every verb, every group, no exceptions in the present. parliamo, crediamo, dormiamo, capiamo. Free win." },
  { t: "Future and conditional share a stem", d: "Build it once: -are and -ere both become -er- (parlerò, crederò), -ire becomes -ir- (dormirò). Then add future or conditional endings to the same stem." },
  { t: "-are verbs swap the a for an e in the future", d: "parlare → parlerò, NOT parlarò. This trips everyone." },
  { t: "Subject pronouns are usually dropped", d: "The ending already tells you who. Say parlo, not io parlo — io only appears for emphasis or contrast." },
  { t: "Spelling guards: -care / -gare", d: "Add an h before i or e to keep the hard sound: pagare → paghi, pagherò. cercare → cerchi, cercherò." },
  { t: "Spelling guards: -ciare / -giare", d: "Drop the i, never double it: mangiare → mangi, mangeremo. cominciare → cominci." }
];

/* ---------- IRREGULAR VERBS ---------- */

const IRREGULAR = [
  { inf: "essere", en: "to be", aux: "essere", pp: "stato", forms: ["sono", "sei", "è", "siamo", "siete", "sono"], imperfetto: ["ero", "eri", "era", "eravamo", "eravate", "erano"], futuro: "sarò", note: "io sono and loro sono are identical — context decides. Imperfect is wildly irregular, learn ero/era by ear." },
  { inf: "avere", en: "to have", aux: "avere", pp: "avuto", forms: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"], imperfetto: ["avevo", "avevi", "aveva", "avevamo", "avevate", "avevano"], futuro: "avrò", note: "The h is silent and purely written — ho, hai, ha, hanno. It exists to separate them from o, ai, a, anno." },
  { inf: "fare", en: "to do / make", aux: "avere", pp: "fatto", forms: ["faccio", "fai", "fa", "facciamo", "fate", "fanno"], imperfetto: ["facevo", "facevi", "faceva", "facevamo", "facevate", "facevano"], futuro: "farò", note: "Hidden Latin stem fac- shows up everywhere: facciamo, facevo, fatto. Used for weather: fa freddo, fa caldo." },
  { inf: "andare", en: "to go", aux: "essere", pp: "andato", forms: ["vado", "vai", "va", "andiamo", "andate", "vanno"], imperfetto: ["andavo", "andavi", "andava", "andavamo", "andavate", "andavano"], futuro: "andrò", note: "Two stems: v- for singular + loro, and- for noi/voi. Takes essere, so the ending agrees: sono andato / sono andata." },
  { inf: "stare", en: "to stay / to be (state)", aux: "essere", pp: "stato", forms: ["sto", "stai", "sta", "stiamo", "state", "stanno"], imperfetto: ["stavo", "stavi", "stava", "stavamo", "stavate", "stavano"], futuro: "starò", note: "How are you = come stai. Also builds the progressive: sto mangiando = I'm eating right now." },
  { inf: "dare", en: "to give", aux: "avere", pp: "dato", forms: ["do", "dai", "dà", "diamo", "date", "danno"], imperfetto: ["davo", "davi", "dava", "davamo", "davate", "davano"], futuro: "darò", note: "dà takes an accent to distinguish it from da (from). Mirrors stare almost exactly." },
  { inf: "potere", en: "can / to be able", aux: "avere", pp: "potuto", forms: ["posso", "puoi", "può", "possiamo", "potete", "possono"], imperfetto: ["potevo", "potevi", "poteva", "potevamo", "potevate", "potevano"], futuro: "potrò", note: "One of the three modals. Followed directly by an infinitive: posso entrare?" },
  { inf: "volere", en: "to want", aux: "avere", pp: "voluto", forms: ["voglio", "vuoi", "vuole", "vogliamo", "volete", "vogliono"], imperfetto: ["volevo", "volevi", "voleva", "volevamo", "volevate", "volevano"], futuro: "vorrò", note: "vorrei (I would like) is the polite form you'll actually use ordering food. Use it constantly." },
  { inf: "dovere", en: "must / to have to", aux: "avere", pp: "dovuto", forms: ["devo", "devi", "deve", "dobbiamo", "dovete", "devono"], imperfetto: ["dovevo", "dovevi", "doveva", "dovevamo", "dovevate", "dovevano"], futuro: "dovrò", note: "Third modal. devo andare = I have to go." },
  { inf: "sapere", en: "to know (facts)", aux: "avere", pp: "saputo", forms: ["so", "sai", "sa", "sappiamo", "sapete", "sanno"], imperfetto: ["sapevo", "sapevi", "sapeva", "sapevamo", "sapevate", "sapevano"], futuro: "saprò", note: "Facts and skills. For knowing people or places use conoscere. non lo so = I don't know." },
  { inf: "venire", en: "to come", aux: "essere", pp: "venuto", forms: ["vengo", "vieni", "viene", "veniamo", "venite", "vengono"], imperfetto: ["venivo", "venivi", "veniva", "venivamo", "venivate", "venivano"], futuro: "verrò", note: "The -ng- in vengo/vengono is a pattern: tenere and rimanere do the same thing." },
  { inf: "dire", en: "to say / tell", aux: "avere", pp: "detto", forms: ["dico", "dici", "dice", "diciamo", "dite", "dicono"], imperfetto: ["dicevo", "dicevi", "diceva", "dicevamo", "dicevate", "dicevano"], futuro: "dirò", note: "Latin stem dic- surfaces throughout. voi is dite, not dicete." },
  { inf: "uscire", en: "to go out / exit", aux: "essere", pp: "uscito", forms: ["esco", "esci", "esce", "usciamo", "uscite", "escono"], imperfetto: ["uscivo", "uscivi", "usciva", "uscivamo", "uscivate", "uscivano"], futuro: "uscirò", note: "u becomes e except in noi/voi. The exit sign in Italy says USCITA." },
  { inf: "bere", en: "to drink", aux: "avere", pp: "bevuto", forms: ["bevo", "bevi", "beve", "beviamo", "bevete", "bevono"], imperfetto: ["bevevo", "bevevi", "beveva", "bevevamo", "bevevate", "bevevano"], futuro: "berrò", note: "Was bevere in older Italian — that's why the v reappears in every form but the infinitive." },
  { inf: "rimanere", en: "to stay / remain", aux: "essere", pp: "rimasto", forms: ["rimango", "rimani", "rimane", "rimaniamo", "rimanete", "rimangono"], imperfetto: ["rimanevo", "rimanevi", "rimaneva", "rimanevamo", "rimanevate", "rimanevano"], futuro: "rimarrò", note: "Same -ng- trick as venire. Past participle rimasto is worth memorising separately." },
  { inf: "tenere", en: "to hold / keep", aux: "avere", pp: "tenuto", forms: ["tengo", "tieni", "tiene", "teniamo", "tenete", "tengono"], imperfetto: ["tenevo", "tenevi", "teneva", "tenevamo", "tenevate", "tenevano"], futuro: "terrò", note: "Conjugates like venire. Compounds inherit it: ottenere, mantenere." },
  { inf: "piacere", en: "to please / to like", aux: "essere", pp: "piaciuto", forms: ["piaccio", "piaci", "piace", "piacciamo", "piacete", "piacciono"], imperfetto: ["piacevo", "piacevi", "piaceva", "piacevamo", "piacevate", "piacevano"], futuro: "piacerò", note: "Backwards verb. The thing liked is the subject: mi piace il caffè = coffee pleases me. Plural thing → mi piacciono." }
];

const IRREG_PP = [
  ["fare", "fatto"], ["dire", "detto"], ["leggere", "letto"], ["scrivere", "scritto"],
  ["vedere", "visto"], ["prendere", "preso"], ["mettere", "messo"], ["aprire", "aperto"],
  ["chiudere", "chiuso"], ["venire", "venuto"], ["essere", "stato"], ["bere", "bevuto"],
  ["chiedere", "chiesto"], ["rispondere", "risposto"], ["rimanere", "rimasto"], ["vivere", "vissuto"],
  ["offrire", "offerto"], ["scegliere", "scelto"], ["perdere", "perso"], ["rompere", "rotto"],
  ["nascere", "nato"], ["morire", "morto"], ["succedere", "successo"], ["spegnere", "spento"]
];

const PAST_RULES = [
  { t: "Passato prossimo is the everyday past", d: "Italians use it in speech for almost anything finished. ho mangiato = I ate / I have eaten. Learn this before any other past tense." },
  { t: "avere vs essere", d: "Most verbs take avere. Verbs of movement and change of state take essere: andare, venire, arrivare, partire, entrare, uscire, nascere, morire, restare, essere, stare, diventare. All reflexives take essere." },
  { t: "With essere, the ending agrees", d: "sono andato (m) / sono andata (f) / siamo andati (m or mixed) / siamo andate (all f). With avere the participle just sits there: ho mangiato, always." },
  { t: "Imperfetto is for background", d: "Ongoing, repeated, or scene-setting: mangiavo = I was eating / I used to eat. Descriptions, age, weather, time of day all take imperfetto." },
  { t: "The pairing that makes it click", d: "mentre mangiavo, è arrivato Marco — while I was eating (imperfetto = backdrop), Marco arrived (passato prossimo = the event)." }
];

/* ---------- GENDER & NUMBER ---------- */

const GENDER_RULES = [
  { t: "There is no neuter", d: "Italian has masculine and feminine only. Every noun is one or the other, including objects and abstractions." },
  { t: "The -o / -a default", d: "-o is usually masculine, -a usually feminine. Plural: -o → -i, -a → -e. libro → libri, casa → case." },
  { t: "-e nouns go either way", d: "Could be either gender, and both pluralise to -i. il ristorante → i ristoranti, la notte → le notti. You just memorise the gender with the word." },
  { t: "-ione is feminine", d: "la stazione, la colazione, la prenotazione, la televisione. Very reliable rule." },
  { t: "-tà and -tù are feminine and never change", d: "la città → le città, la novità → le novità. The accent blocks the plural, so only the article moves." },
  { t: "Greek -ma words are masculine", d: "il problema, il sistema, il tema, il programma, il clima. Plural in -i: i problemi. They look feminine and aren't." },
  { t: "-ista covers both genders", d: "il turista / la turista. Plural splits: i turisti / le turiste. Same for artista, barista." },
  { t: "Foreign and shortened words don't inflect", d: "il bar → i bar, il film → i film, lo sport → gli sport. And la foto → le foto (short for fotografia, hence feminine), la moto, l'auto." }
];

const ODD_PLURALS = [
  ["il braccio", "le braccia", "arm(s)"],
  ["l'uovo", "le uova", "egg(s)"],
  ["il dito", "le dita", "finger(s)"],
  ["il ginocchio", "le ginocchia", "knee(s)"],
  ["il labbro", "le labbra", "lip(s)"],
  ["il paio", "le paia", "pair(s)"],
  ["l'uomo", "gli uomini", "man / men"],
  ["la mano", "le mani", "hand(s) — feminine despite the -o"],
  ["il dio", "gli dei", "god(s)"],
  ["l'ala", "le ali", "wing(s)"]
];

/* ---------- ARTICLES ---------- */

const DEF_ARTICLES = [
  { art: "il", plural: "i", when: "Masculine, before most consonants", ex: "il libro → i libri · il cane → i cani" },
  { art: "lo", plural: "gli", when: "Masculine, before s+consonant, z, gn, ps, pn, x, y", ex: "lo studente → gli studenti · lo zaino → gli zaini · lo gnocco → gli gnocchi" },
  { art: "l'", plural: "gli", when: "Masculine, before a vowel", ex: "l'amico → gli amici · l'orario → gli orari" },
  { art: "la", plural: "le", when: "Feminine, before any consonant", ex: "la casa → le case · la strada → le strade" },
  { art: "l'", plural: "le", when: "Feminine, before a vowel", ex: "l'amica → le amiche · l'ora → le ore" }
];

const INDEF_ARTICLES = [
  { art: "un", when: "Masculine default — consonants AND vowels", ex: "un libro · un amico" },
  { art: "uno", when: "Masculine, same triggers as lo", ex: "uno studente · uno zio · uno psicologo" },
  { art: "una", when: "Feminine, before a consonant", ex: "una casa · una birra" },
  { art: "un'", when: "Feminine, before a vowel (note the apostrophe)", ex: "un'amica · un'ora" }
];

const ARTICLE_RULES = [
  { t: "lo/gli is pure sound, not meaning", d: "It exists because il studente is physically awkward to say. The trigger list: s+consonant, z, gn, ps, pn, x, y. That's it." },
  { t: "The apostrophe tells you the gender is hidden", d: "l' works for both genders in the singular. The plural reveals it: gli amici (m) vs le amiche (f)." },
  { t: "un takes no apostrophe, un' does", d: "un amico (masculine, no apostrophe) vs un'amica (feminine, apostrophe). This one distinction carries the whole gender." },
  { t: "Italian uses articles where English drops them", d: "Mi piace il caffè = I like coffee. Parlo l'italiano. Body parts and possessions too: mi lavo le mani." }
];

const PREP_ARTICLES = {
  headers: ["", "il", "lo", "l'", "la", "i", "gli", "le"],
  rows: [
    ["di (of)", "del", "dello", "dell'", "della", "dei", "degli", "delle"],
    ["a (to/at)", "al", "allo", "all'", "alla", "ai", "agli", "alle"],
    ["da (from/by)", "dal", "dallo", "dall'", "dalla", "dai", "dagli", "dalle"],
    ["in (in)", "nel", "nello", "nell'", "nella", "nei", "negli", "nelle"],
    ["su (on)", "sul", "sullo", "sull'", "sulla", "sui", "sugli", "sulle"]
  ]
};

/* ---------- WORDS ---------- */

const WORD_GROUPS = [
  {
    group: "The glue words Italians actually say",
    sub: "Learn these first — they buy you more fluency than any verb tense.",
    items: [
      ["allora", "so / well then", "The universal opener and stall. allora, andiamo. Starts sentences, buys thinking time, signals a decision."],
      ["quindi", "so / therefore", "Consequence. Cleaner and more logical than allora."],
      ["però", "but / though", "Can start a sentence or get tacked on the end: buono, però! Softer than ma."],
      ["magari", "maybe / if only!", "Two lives. As a maybe: magari vengo. As a wish, said alone with feeling: Magari! = I wish!"],
      ["anzi", "actually / on the contrary", "Corrects or upgrades what you just said. non è buono, anzi, è ottimo."],
      ["cioè", "I mean / that is", "Pronounced cho-EH. The Italian filler for restating yourself."],
      ["boh", "dunno", "A shrug in word form. Completely normal in speech."],
      ["dai", "come on", "Encouragement, disbelief, or let's go. dai, andiamo!"],
      ["mica", "not at all", "Adds punch to a negative. non è mica facile = it's not easy at all."],
      ["insomma", "well / sort of", "Lukewarm. Asked how the meal was, insomma means it was fine, not great."],
      ["comunque", "anyway / however", "Changes the subject or concedes a point. Extremely common."],
      ["infatti", "indeed / exactly", "Agreeing with something just said. Not in fact — it means you're right."],
      ["appunto", "precisely", "Emphatic agreement. That's exactly my point."],
      ["addirittura", "even / seriously?!", "Marks something surprising or extreme."],
      ["proprio", "really / exactly", "Intensifier. è proprio buono = it's really good."],
      ["purtroppo", "unfortunately", "Softens bad news. purtroppo no."],
      ["figurati", "don't mention it", "Reply to thanks, or waving off a fuss. Formal version: si figuri."]
    ]
  },
  {
    group: "Everyday courtesy",
    sub: "Small words, enormous mileage.",
    items: [
      ["grazie", "thank you", "grazie mille = thanks a lot."],
      ["prego", "you're welcome / please / go ahead", "Does four jobs: answering grazie, inviting you to sit, handing something over, or asking what you'd like."],
      ["anch'io", "me too", "Note the apostrophe — anche + io contracts. Same pattern: anche tu, anche lui."],
      ["scusa / scusi", "sorry / excuse me", "scusa is informal, scusi is formal. Use scusi with strangers and staff."],
      ["permesso", "may I pass / may I come in", "Said squeezing through a crowd or entering someone's home."],
      ["volentieri", "gladly", "Warm yes to an offer."],
      ["certo", "of course", "Also certamente. Confident agreement."],
      ["va bene", "okay / that works", "The everyday yes. Often shortened to just va bene, va bene."],
      ["senti / senta", "listen / excuse me", "Opens a request. senta, scusi... to a waiter is perfect."],
      ["piano", "slowly / quietly", "più piano, per favore = slower, please. Your most useful phrase as a learner."],
      ["buongiorno / buonasera", "good day / good evening", "Switch to buonasera around late afternoon. Greeting shopkeepers when you enter is expected, not optional."]
    ]
  },
  {
    group: "Connectors & conjunctions",
    sub: "Sentence architecture.",
    items: [
      ["e / ed", "and", "ed before a word starting with e: ed ecco."],
      ["ma", "but", "The plain one. però is the conversational cousin."],
      ["o / oppure", "or", "oppure is a stronger or else."],
      ["perché", "because / why", "Same word for both. perché? = why? · perché sì = because yes."],
      ["siccome", "since / given that", "Starts a sentence where perché can't."],
      ["anche se", "even though", "anche se piove, usciamo."],
      ["mentre", "while", "The imperfetto's natural partner."],
      ["quando", "when", "Also the question word."],
      ["se", "if", "se posso, vengo."],
      ["finché", "until / as long as", "Also fino a quando."],
      ["invece", "instead / whereas", "Marks a contrast between two things."],
      ["poi", "then / afterwards", "Sequencing. prima... poi... alla fine."],
      ["ancora", "still / yet / again", "Three meanings, context decides. ancora un caffè = another coffee."],
      ["già", "already", "Also a dry yeah, right in conversation."],
      ["appena", "just / as soon as", "sono appena arrivato = I just arrived."],
      ["quasi", "almost", "quasi quasi = I'm half tempted to..."],
      ["abbastanza", "enough / fairly", "è abbastanza buono = it's pretty good."],
      ["troppo", "too much", "Also just too as an intensifier: troppo bello."]
    ]
  },
  {
    group: "Survival phrases",
    sub: "Ordering, hotels, directions.",
    items: [
      ["vorrei...", "I would like...", "The polite order. vorrei un caffè, per favore. Never say voglio in a shop — it's blunt."],
      ["un caffè, per favore", "an espresso, please", "In Italy caffè means espresso. Ask for a latte and you'll get a glass of milk — say caffellatte."],
      ["il conto, per favore", "the bill, please", "You have to ask. They won't bring it unprompted."],
      ["quanto costa?", "how much is it?", "quant'è? works too."],
      ["dov'è...?", "where is...?", "dov'è il bagno? · dov'è la stazione?"],
      ["c'è / ci sono", "there is / there are", "c'è un tavolo? = is there a table?"],
      ["posso...?", "may I...?", "posso pagare con la carta? = can I pay by card?"],
      ["avete...?", "do you have...?", "avete un tavolo per due?"],
      ["non capisco", "I don't understand", "Pair it with più piano, per favore."],
      ["parla inglese?", "do you speak English?", "Formal. Ask it after trying a little Italian first — it lands much better."],
      ["da portare via", "to take away", "Otherwise they assume you're staying."],
      ["senza / con", "without / with", "senza ghiaccio, con latte."],
      ["il prossimo", "the next one", "Useful for trains and queues."],
      ["a che ora...?", "at what time...?", "a che ora apre? = what time does it open?"]
    ]
  }
];

/* ---------- QUIZ POOLS ---------- */

const QUIZ_ARTICLES = [
  ["studente", "lo"], ["libro", "il"], ["amico", "l'"], ["casa", "la"], ["zaino", "lo"],
  ["ora", "l'"], ["cane", "il"], ["psicologo", "lo"], ["amica", "l'"], ["strada", "la"],
  ["gnocco", "lo"], ["ristorante", "il"], ["stazione", "la"], ["yogurt", "lo"], ["problema", "il"],
  ["uomo", "l'"], ["sport", "lo"], ["treno", "il"], ["birra", "la"], ["albergo", "l'"],
  ["specchio", "lo"], ["città", "la"], ["orario", "l'"], ["zio", "lo"], ["notte", "la"]
];

const QUIZ_PLURALS = [
  ["il libro", "i libri"], ["la casa", "le case"], ["lo studente", "gli studenti"],
  ["l'amico", "gli amici"], ["la notte", "le notti"], ["il ristorante", "i ristoranti"],
  ["la città", "le città"], ["il problema", "i problemi"], ["il braccio", "le braccia"],
  ["l'uovo", "le uova"], ["l'uomo", "gli uomini"], ["la mano", "le mani"],
  ["il bar", "i bar"], ["la foto", "le foto"], ["il dito", "le dita"],
  ["l'amica", "le amiche"], ["lo zaino", "gli zaini"], ["la stazione", "le stazioni"]
];
