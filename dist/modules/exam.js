/**
 * Mein Deutsch Buddy — Prüfungsmodus
 *
 * Built for the night before an exam. Two principles shape it.
 *
 * First, testing beats rereading. Rereading feels productive because the
 * material looks familiar, but familiarity is not retrieval. Every section
 * here ends in questions.
 *
 * Second, feedback has to explain the distractors. Being told an answer is
 * wrong teaches almost nothing; being told *why the option you picked* was
 * tempting and what it would have been right for is what transfers. So every
 * option carries its own explanation, not just the correct one.
 */
const DRILLS = [
    /* ---------------------------------------------------- Teil 1: Verbformen */
    {
        id: 'v1',
        part: 'Verben',
        prompt: 'Ich ___ jeden Tag Deutsch.',
        options: [
            { t: 'lernen', why: 'Das ist der Infinitiv. Der steht nur nach einem Modalverb (ich will lernen) oder am Satzende.' },
            { t: 'lernt', why: 'Das ist die Form für er, sie, es und für ihr. Bei ich passt sie nicht.' },
            { t: 'lerne', ok: true, why: 'ich + Stamm + e. lernen → lern → lerne.' },
        ],
        rule: 'Präsens: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en',
    },
    {
        id: 'v2',
        part: 'Verben',
        prompt: 'Du ___ heute nicht arbeiten.',
        hint: 'müssen',
        options: [
            { t: 'musst', ok: true, why: 'du + Modalverb = Stamm + st. muss + st = musst, mit einem s.' },
            { t: 'müsst', why: 'Das ist die ihr-Form. Achtung: Modalverben verlieren den Umlaut im Singular. Genau diesen Fehler hattest du in der Probeprüfung.' },
            { t: 'müssen', why: 'Infinitiv, also wir- oder sie-Form.' },
        ],
        rule: 'Modalverben im Singular ohne Umlaut: ich muss, du musst, er muss',
    },
    {
        id: 'v3',
        part: 'Verben',
        prompt: 'Er ___ um 6 Uhr ___ .',
        hint: 'aufstehen',
        options: [
            { t: 'steht … auf', ok: true, why: 'Trennbares Verb: das Präfix geht ans Satzende, das konjugierte Verb bleibt auf Position 2.' },
            { t: 'aufsteht … —', why: 'Im Hauptsatz bleibt ein trennbares Verb nie zusammen. Zusammen bleibt es nur nach einem Modalverb: Er muss aufstehen.' },
            { t: 'auf … steht', why: 'Umgekehrt. Das konjugierte Verb steht auf Position 2, nie das Präfix.' },
        ],
        rule: 'Trennbar: ab-, an-, auf-, aus-, ein-, mit-, vor-, zu-, zurück-',
    },
    {
        id: 'v4',
        part: 'Verben',
        prompt: 'Sie (Plural) ___ sehr gut Deutsch sprechen.',
        hint: 'können',
        options: [
            { t: 'könnt', why: 'Das ist ihr. Ihr könnt, aber sie können.' },
            { t: 'können', ok: true, why: 'sie im Plural und höfliches Sie nehmen immer die Infinitivform.' },
            { t: 'kann', why: 'Das ist ich oder er/sie/es im Singular.' },
        ],
        rule: 'wir, sie, Sie nehmen immer die -en Form',
    },
    {
        id: 'v5',
        part: 'Verben',
        prompt: 'Du ___ sehr schnell.',
        hint: 'sprechen',
        options: [
            { t: 'sprechst', why: 'Der Stamm stimmt nicht. sprechen wechselt bei du und er den Vokal.' },
            { t: 'sprichst', ok: true, why: 'e → i bei du und er/sie/es. Nur dort, sonst bleibt der Vokal.' },
            { t: 'spricht', why: 'Das ist er/sie/es. Bei du fehlt das s.' },
        ],
        rule: 'Vokalwechsel nur bei du und er/sie/es: e→i, e→ie, a→ä',
    },
    /* ------------------------------------------------------ Teil 2: Artikel */
    {
        id: 'a1',
        part: 'Artikel und Fälle',
        prompt: 'Ich kaufe ___ Apfel.',
        options: [
            { t: 'ein', why: 'Das wäre Nominativ. Richtig bei: Das ist ein Apfel.' },
            { t: 'einen', ok: true, why: 'kaufen nimmt Akkusativ, der Apfel ist maskulin, und nur maskulin ändert sich: ein → einen.' },
            { t: 'eine', why: 'eine ist feminin. Der Apfel ist maskulin.' },
        ],
        rule: 'Akkusativ: nur maskulin ändert sich. der→den, ein→einen',
    },
    {
        id: 'a2',
        part: 'Artikel und Fälle',
        prompt: 'Ich helfe ___ Mann.',
        options: [
            { t: 'den', why: 'Akkusativ. Aber helfen gehört zu der kleinen Gruppe, die Dativ verlangt.' },
            { t: 'dem', ok: true, why: 'helfen ist ein Dativverb, wie danken, gehören, gefallen, passen.' },
            { t: 'der', why: 'Nominativ maskulin, oder Dativ feminin. Hier ist der Mann maskulin und braucht dem.' },
        ],
        rule: 'Dativverben: helfen, danken, gehören, gefallen, passen, schmecken, antworten',
    },
    {
        id: 'a3',
        part: 'Artikel und Fälle',
        prompt: 'Das Auto gehört ___ Frau.',
        options: [
            { t: 'die', why: 'Nominativ oder Akkusativ. gehören verlangt Dativ.' },
            { t: 'der', ok: true, why: 'gehören + Dativ, feminin: die → der. Feminin sieht im Dativ aus wie maskulin im Nominativ, das verwirrt oft.' },
            { t: 'dem', why: 'Dativ maskulin oder neutral. Die Frau ist feminin.' },
        ],
        rule: 'Dativ: der→dem (m), die→der (f), das→dem (n), die→den (Pl)',
    },
    {
        id: 'a4',
        part: 'Artikel und Fälle',
        prompt: 'Ich habe ___ Hund. (Verneinung)',
        options: [
            { t: 'nicht einen', why: 'Das sagt man nicht. Bei ein + Nomen wird die Verneinung zu kein.' },
            { t: 'keinen', ok: true, why: 'kein ersetzt ein und nimmt dieselben Endungen. Akkusativ maskulin: keinen.' },
            { t: 'kein', why: 'Das wäre Nominativ oder neutral. haben verlangt Akkusativ, also keinen.' },
        ],
        rule: 'kein bei Nomen mit ein oder ohne Artikel, nicht bei allem anderen',
    },
    /* ------------------------------------------------------ Teil 3: Pronomen */
    {
        id: 'p1',
        part: 'Pronomen',
        prompt: 'Ich sehe den Lehrer. → Ich sehe ___ .',
        options: [
            { t: 'er', why: 'Nominativ. Richtig nur, wenn er das Subjekt ist: Er kommt.' },
            { t: 'ihn', ok: true, why: 'den Lehrer steht im Akkusativ, also wird daraus ihn. Der Fall bleibt beim Ersetzen gleich.' },
            { t: 'ihm', why: 'Dativ. Das bräuchtest du nach helfen: Ich helfe ihm.' },
        ],
        rule: 'er → ihn (Akk) → ihm (Dat)',
    },
    {
        id: 'p2',
        part: 'Pronomen',
        prompt: 'Er hilft ___ .',
        hint: 'ich',
        options: [
            { t: 'mich', why: 'Akkusativ. Richtig bei: Er sieht mich.' },
            { t: 'mir', ok: true, why: 'helfen verlangt Dativ, und ich wird im Dativ zu mir.' },
            { t: 'ich', why: 'Nominativ. Nach einem Verb kann ich nicht als Objekt stehen.' },
        ],
        rule: 'ich → mich (Akk) → mir (Dat)',
    },
    {
        id: 'p3',
        part: 'Pronomen',
        prompt: 'Das T-Shirt gefällt ___ .',
        hint: 'sie, Singular',
        options: [
            { t: 'sie', why: 'Nominativ oder Akkusativ. gefallen verlangt Dativ.' },
            { t: 'ihr', ok: true, why: 'gefallen + Dativ. sie im Singular wird zu ihr. Achtung: das T-Shirt ist das Subjekt, nicht sie.' },
            { t: 'ihnen', why: 'Das ist Dativ Plural, also für mehrere Personen.' },
        ],
        rule: 'gefallen dreht die Logik um: die Sache gefällt der Person',
    },
    {
        id: 'p4',
        part: 'Pronomen',
        prompt: '___ Mutter ist Lehrerin.',
        hint: 'ich',
        options: [
            { t: 'Mein', why: 'Das wäre maskulin oder neutral. Die Mutter ist feminin.' },
            { t: 'Meine', ok: true, why: 'Der Besitzer wählt den Stamm (mein-), das besessene Nomen wählt die Endung. Feminin Nominativ: -e.' },
            { t: 'Meiner', why: 'Das ist Dativ feminin: mit meiner Mutter.' },
        ],
        rule: 'Possessiv: Stamm vom Besitzer, Endung vom Nomen',
    },
    /* ------------------------------------------- Teil 4: Präpositionen */
    {
        id: 'pr1',
        part: 'Präpositionen',
        prompt: 'Ich fahre ___ Bus zur Arbeit.',
        options: [
            { t: 'mit dem', ok: true, why: 'mit verlangt immer Dativ, und für Verkehrsmittel benutzt man mit.' },
            { t: 'mit den', why: 'den wäre Akkusativ maskulin oder Dativ Plural. Der Bus ist maskulin Singular, also dem.' },
            { t: 'in dem', why: 'Grammatisch möglich, aber für Verkehrsmittel sagt man mit dem Bus.' },
        ],
        rule: 'Immer Dativ: aus, bei, mit, nach, seit, von, zu',
    },
    {
        id: 'pr2',
        part: 'Präpositionen',
        prompt: 'Ich lege das Buch ___ Tisch.',
        options: [
            { t: 'auf den', ok: true, why: 'legen ist eine Bewegung. Wohin? → Akkusativ, maskulin den.' },
            { t: 'auf dem', why: 'Das wäre Wo?, also die Position: Das Buch liegt auf dem Tisch.' },
            { t: 'auf der', why: 'Der Tisch ist maskulin, nicht feminin.' },
        ],
        rule: 'Wechselpräposition: Wohin → Akkusativ, Wo → Dativ',
    },
    {
        id: 'pr3',
        part: 'Präpositionen',
        prompt: 'Ich gehe ___ Arzt.',
        options: [
            { t: 'zum', ok: true, why: 'Bei Personen: zu + Dativ. zu dem verschmilzt zu zum.' },
            { t: 'nach dem', why: 'nach benutzt man für Städte und Länder ohne Artikel: nach Berlin.' },
            { t: 'in den', why: 'Das wäre ein Ort, kein Mensch: in den Park.' },
        ],
        rule: 'Wohin? Personen → zu, Orte → in, Städte → nach',
    },
    {
        id: 'pr4',
        part: 'Präpositionen',
        prompt: 'Das Geschenk ist ___ mich.',
        options: [
            { t: 'für', ok: true, why: 'für verlangt immer Akkusativ, deshalb mich und nicht mir.' },
            { t: 'mit', why: 'mit verlangt Dativ, also müsste es mit mir heißen.' },
            { t: 'zu', why: 'zu verlangt Dativ: zu mir.' },
        ],
        rule: 'Immer Akkusativ: durch, für, gegen, ohne, um, bis',
    },
    /* ------------------------------------------------ Teil 5: Wortstellung */
    {
        id: 'w1',
        part: 'Wortstellung',
        prompt: 'am Samstag / Fußball / spielen / wir',
        options: [
            { t: 'Am Samstag spielen wir Fußball.', ok: true, why: 'Position 1 kann eine Zeitangabe sein. Dann rutscht das Subjekt hinter das Verb. Kein Komma.' },
            { t: 'Am Samstag, spielen wir Fußball.', why: 'Fast richtig, aber im Deutschen steht hier kein Komma. Genau das hattest du in der Probeprüfung.' },
            { t: 'Am Samstag wir spielen Fußball.', why: 'Das Verb muss auf Position 2. Hier steht es auf Position 3.' },
        ],
        rule: 'Das konjugierte Verb steht im Hauptsatz immer auf Position 2',
    },
    {
        id: 'w2',
        part: 'Wortstellung',
        prompt: 'Deutsch / kann / gut / er / sprechen',
        options: [
            { t: 'Er kann gut Deutsch sprechen.', ok: true, why: 'Modalverb auf Position 2, Infinitiv ans Satzende. Das ist die Satzklammer.' },
            { t: 'Er kann sprechen gut Deutsch.', why: 'Der Infinitiv muss ganz ans Ende, nach allen anderen Wörtern.' },
            { t: 'Er gut Deutsch sprechen kann.', why: 'Das ist die Wortstellung eines Nebensatzes, nicht eines Hauptsatzes.' },
        ],
        rule: 'Satzklammer: Modalverb Position 2, Infinitiv am Ende',
    },
    {
        id: 'w3',
        part: 'Wortstellung',
        prompt: 'ich / um / stehe / sieben Uhr / auf',
        options: [
            { t: 'Ich stehe um sieben Uhr auf.', ok: true, why: 'Konjugiertes Verb auf 2, Präfix ganz ans Ende.' },
            { t: 'Ich aufstehe um sieben Uhr.', why: 'Trennbare Verben bleiben im Hauptsatz nie zusammen.' },
            { t: 'Ich stehe auf um sieben Uhr.', why: 'Das Präfix gehört hinter die Zeitangabe, ans echte Satzende.' },
        ],
        rule: 'Trennbares Verb: Präfix ans Satzende',
    },
    {
        id: 'w4',
        part: 'Wortstellung',
        prompt: 'Warum lernst du Deutsch?',
        hint: 'weil / arbeiten / ich / in Deutschland / will',
        options: [
            { t: 'Weil ich in Deutschland arbeiten will.', ok: true, why: 'weil schickt das konjugierte Verb ans Ende. Der Infinitiv steht davor.' },
            { t: 'Weil ich will in Deutschland arbeiten.', why: 'Nach weil steht das konjugierte Verb am Ende, nicht auf Position 2.' },
            { t: 'Weil will ich in Deutschland arbeiten.', why: 'Das ist Fragestellung. weil ist keine normale Konjunktion wie und oder aber.' },
        ],
        rule: 'weil, dass, wenn schicken das Verb ans Ende. und, aber, oder, denn nicht',
    },
    /* --------------------------------------------------- Teil 6: Zahlen */
    {
        id: 'z1',
        part: 'Zahlen',
        prompt: '67 = ?',
        options: [
            { t: 'sieben und sechzig', why: 'Richtig gedacht, falsch geschrieben. Zahlen sind im Deutschen ein Wort. Genau das hattest du in der Probeprüfung.' },
            { t: 'siebenundsechzig', ok: true, why: 'Einer + und + Zehner, alles zusammen als ein Wort.' },
            { t: 'sechzigsieben', why: 'Deutsch spricht die Zahl rückwärts: erst der Einer, dann der Zehner.' },
        ],
        rule: 'Einer + und + Zehner, immer ein Wort',
    },
    {
        id: 'z2',
        part: 'Zahlen',
        prompt: 'Der 45. Platz = der ___ Platz',
        options: [
            { t: 'fünf und vierzigster', why: 'Zwei Fehler: es muss ein Wort sein, und nach der heißt die Endung -e, nicht -er. Das hattest du in der Probeprüfung.' },
            { t: 'fünfundvierzigste', ok: true, why: 'Ab 20 hängst du -ste an, und nach der ist die Adjektivendung -e.' },
            { t: 'fünfundvierzigte', why: 'Bis 19 ist es -te, ab 20 ist es -ste. 45 liegt darüber.' },
        ],
        rule: '1 bis 19: -te. Ab 20: -ste',
    },
    {
        id: 'z3',
        part: 'Zahlen',
        prompt: 'Ich habe am 3. März Geburtstag. → am ___ März',
        options: [
            { t: 'dritte', why: 'Nach am steht Dativ, also -en statt -e.' },
            { t: 'dritten', ok: true, why: 'am = an dem = Dativ. Die Ordnungszahl bekommt dann -en. Und dritte ist unregelmäßig, nicht dreite.' },
            { t: 'dreiten', why: 'Der Stamm ist unregelmäßig: 3 → dritt-, nicht dreit-.' },
        ],
        rule: 'am + Ordinalzahl + -en. Unregelmäßig: erste, dritte, siebte, achte',
    },
    {
        id: 'z4',
        part: 'Zahlen',
        prompt: '09:15 Uhr, umgangssprachlich',
        options: [
            { t: 'Viertel nach neun', ok: true, why: '15 Minuten nach der vollen Stunde: Viertel nach.' },
            { t: 'Viertel vor neun', why: 'Das wäre 08:45, also 15 Minuten vor neun.' },
            { t: 'halb neun', why: 'Das wäre 08:30. Achtung: halb neun heißt 8:30, nicht 9:30.' },
        ],
        rule: 'halb drei = 2:30. Deutsch zählt zur nächsten Stunde',
    },
    /* --------------------------------------------------- Teil 7: Perfekt */
    {
        id: 'pf1',
        part: 'Perfekt',
        prompt: 'Gestern ___ ich Pizza ___ .',
        hint: 'essen',
        options: [
            { t: 'habe … gegessen', ok: true, why: 'essen hat ein Akkusativobjekt, also haben. Partizip: gegessen.' },
            { t: 'bin … gegessen', why: 'sein nimmt man nur bei Bewegung von A nach B oder bei Zustandswechsel.' },
            { t: 'habe … geessen', why: 'Der Stamm ist unregelmäßig: essen → gegessen, mit doppeltem g-Laut.' },
        ],
        rule: 'haben bei Objekt, sein bei Bewegung und Zustandswechsel',
    },
    {
        id: 'pf2',
        part: 'Perfekt',
        prompt: 'Ich ___ um sieben Uhr ___ .',
        hint: 'aufwachen',
        options: [
            { t: 'habe … aufgewacht', why: 'aufwachen ist ein Zustandswechsel: von schlafen zu wach. Das nimmt sein.' },
            { t: 'bin … aufgewacht', ok: true, why: 'Zustandswechsel → sein. Und beim trennbaren Verb steht ge- in der Mitte: auf-ge-wacht.' },
            { t: 'bin … geaufwacht', why: 'Bei trennbaren Verben kommt ge- zwischen Präfix und Stamm, nicht davor.' },
        ],
        rule: 'Trennbar im Perfekt: Präfix + ge + Stamm. aufgestanden, eingekauft',
    },
    {
        id: 'pf3',
        part: 'Perfekt',
        prompt: 'Wir ___ nach Berlin ___ .',
        hint: 'fahren',
        options: [
            { t: 'sind … gefahren', ok: true, why: 'Bewegung von A nach B → sein.' },
            { t: 'haben … gefahren', why: 'Nur mit Objekt: Ich habe das Auto gefahren. Ohne Objekt ist es sein.' },
            { t: 'sind … gefahrt', why: 'fahren ist stark: der Vokal bleibt, aber die Endung ist -en, nicht -t.' },
        ],
        rule: 'Starke Verben: ge + Stamm + en. Schwache: ge + Stamm + t',
    },
    {
        id: 'pf4',
        part: 'Perfekt',
        prompt: 'Ich ___ meine Familie ___ .',
        hint: 'besuchen',
        options: [
            { t: 'habe … besucht', ok: true, why: 'be- ist nicht trennbar, deshalb kein ge-. Und es gibt ein Objekt, also haben.' },
            { t: 'habe … gebesucht', why: 'Verben mit be-, ge-, er-, ver-, ent-, miss- bekommen nie ein ge-.' },
            { t: 'bin … besucht', why: 'besuchen hat ein Akkusativobjekt, also haben.' },
        ],
        rule: 'Kein ge- bei be-, er-, ver-, ent-, miss- und bei -ieren',
    },
    /* ------------------------------------------------- Teil 8: Wortschatz */
    {
        id: 'ws1',
        part: 'Wortschatz',
        prompt: 'Was trinkt man?',
        options: [
            { t: 'Brot', why: 'Brot isst man. trinken braucht etwas Flüssiges.' },
            { t: 'Milch', ok: true, why: 'Milch ist eine Flüssigkeit, also trinkt man sie.' },
            { t: 'Reis', why: 'Reis isst man.' },
        ],
        rule: 'essen für Festes, trinken für Flüssiges',
    },
    {
        id: 'ws2',
        part: 'Wortschatz',
        prompt: 'Welcher Monat kommt nach Juni?',
        options: [
            { t: 'August', why: 'August kommt nach Juli, also zwei Monate später.' },
            { t: 'Juli', ok: true, why: 'Die Reihenfolge ist Mai, Juni, Juli, August.' },
            { t: 'Mai', why: 'Mai kommt vor Juni, nicht danach.' },
        ],
        rule: 'Januar bis Dezember, alle maskulin: der Januar',
    },
    {
        id: 'ws3',
        part: 'Wortschatz',
        prompt: 'Meine Mutter ist die Frau von meinem ___ .',
        options: [
            { t: 'Bruder', why: 'Die Frau deines Bruders wäre deine Schwägerin, nicht deine Mutter.' },
            { t: 'Vater', ok: true, why: 'Mutter und Vater sind zusammen die Eltern.' },
            { t: 'Sohn', why: 'Dein Sohn ist eine Generation unter dir.' },
        ],
        rule: 'die Eltern: der Vater und die Mutter. die Geschwister: Bruder und Schwester',
    },
    {
        id: 'ws4',
        part: 'Wortschatz',
        prompt: 'Was tut dir weh? → Mein Kopf ___ mir weh.',
        options: [
            { t: 'tut', ok: true, why: 'Ein Körperteil im Singular: tut. wehtun ist trennbar, deshalb steht weh am Ende.' },
            { t: 'tun', why: 'Das wäre Plural: Meine Zähne tun mir weh.' },
            { t: 'tuen', why: 'Diese Form gibt es nicht. Der Infinitiv ist tun.' },
        ],
        rule: 'wehtun + Dativ: Der Kopf tut mir weh',
    },
    {
        id: 'ws5',
        part: 'Wortschatz',
        prompt: 'Ich arbeite ___ Ingenieur ___ Qestit.',
        options: [
            { t: 'als … bei', ok: true, why: 'als für die Rolle, bei für die Firma. Nach als steht kein Artikel.' },
            { t: 'wie … in', why: 'wie vergleicht (so groß wie), als benennt die Rolle.' },
            { t: 'als ein … bei', why: 'Nach Ich bin oder Ich arbeite als steht der Beruf ohne Artikel.' },
        ],
        rule: 'Ich bin Ingenieur. Ich arbeite als Ingenieur bei X in Y',
    },
    {
        id: 'ws6',
        part: 'Wortschatz',
        prompt: 'Der Tisch ist ___ Holz.',
        options: [
            { t: 'aus', ok: true, why: 'Material immer mit aus + Dativ.' },
            { t: 'von', why: 'von zeigt Herkunft oder Besitz, nicht Material.' },
            { t: 'mit', why: 'mit heißt zusammen mit, nicht bestehend aus.' },
        ],
        rule: 'Material: aus Holz, aus Metall, aus Plastik',
    },
];
/* --------------------------------------------------------------------- ui */
export function initExam() {
    const host = document.querySelector('[data-drills]');
    if (!host)
        return;
    const parts = Array.from(new Set(DRILLS.map((d) => d.part)));
    let filter = 'alle';
    const answered = new Map();
    const bar = document.createElement('div');
    bar.className = 'dr-filter';
    bar.innerHTML =
        `<button class="chip" data-f="alle" aria-pressed="true">Alle ${DRILLS.length}</button>` +
            parts
                .map((p) => {
                const n = DRILLS.filter((d) => d.part === p).length;
                return `<button class="chip" data-f="${p}" aria-pressed="false">${p} ${n}</button>`;
            })
                .join('');
    const score = document.createElement('div');
    score.className = 'dr-score';
    const list = document.createElement('div');
    list.className = 'dr-list';
    host.append(bar, score, list);
    function card(d) {
        return (`<article class="dr" data-id="${d.id}" data-part="${d.part}">` +
            `<div class="dr-part">${d.part}</div>` +
            `<h4 class="dr-q">${d.prompt}</h4>` +
            (d.hint ? `<div class="dr-hint">${d.hint}</div>` : '') +
            `<div class="dr-opts">` +
            d.options
                .map((o, i) => `<button class="dr-o" data-i="${i}" data-ok="${!!o.ok}">` +
                `<span class="dr-letter">${'abc'[i]}</span><span class="dr-t">${o.t}</span></button>`)
                .join('') +
            `</div>` +
            `<div class="dr-fb" hidden></div>` +
            `</article>`);
    }
    function render() {
        const shown = filter === 'alle' ? DRILLS : DRILLS.filter((d) => d.part === filter);
        list.innerHTML = shown.map(card).join('');
        updateScore();
    }
    function updateScore() {
        const done = answered.size;
        const right = Array.from(answered.values()).filter(Boolean).length;
        if (!done) {
            score.innerHTML = `<span class="dr-progress">Noch keine Aufgabe beantwortet</span>`;
            return;
        }
        const pct = Math.round((right / done) * 100);
        score.innerHTML =
            `<span class="dr-progress">${done} von ${DRILLS.length} beantwortet · ` +
                `${right} richtig (${pct}%)</span>` +
                `<button class="chip dr-reset" type="button">Zurücksetzen</button>`;
    }
    list.addEventListener('click', (ev) => {
        const btn = ev.target.closest('.dr-o');
        if (!btn)
            return;
        const art = btn.closest('.dr');
        if (art.classList.contains('done'))
            return;
        const drill = DRILLS.find((d) => d.id === art.dataset.id);
        const chosen = Number(btn.dataset.i);
        const correct = !!drill.options[chosen].ok;
        answered.set(drill.id, correct);
        art.classList.add('done');
        /* Every option gets its explanation, not just the chosen one. Seeing why
           the other two were wrong is where the learning is. */
        art.querySelectorAll('.dr-o').forEach((b, i) => {
            const o = drill.options[i];
            b.classList.add(o.ok ? 'right' : 'wrong');
            if (i === chosen)
                b.classList.add('chosen');
            b.insertAdjacentHTML('beforeend', `<span class="dr-why">${o.why}</span>`);
        });
        const fb = art.querySelector('.dr-fb');
        fb.hidden = false;
        fb.innerHTML =
            `<div class="dr-verdict ${correct ? 'ok' : 'no'}">` +
                (correct ? 'Richtig' : 'Noch nicht') +
                `</div><div class="dr-rule">${drill.rule}</div>`;
        updateScore();
    });
    bar.addEventListener('click', (ev) => {
        const btn = ev.target.closest('[data-f]');
        if (!btn)
            return;
        filter = btn.dataset.f;
        bar.querySelectorAll('[data-f]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === filter)));
        render();
    });
    score.addEventListener('click', (ev) => {
        if (!ev.target.closest('.dr-reset'))
            return;
        answered.clear();
        render();
    });
    render();
}
/* Self-check drill: reveal a model answer for the spoken exam. */
export function initSpeak() {
    document.querySelectorAll('.sp').forEach((row) => {
        const btn = row.querySelector('.sp-show');
        const ans = row.querySelector('.sp-a');
        if (!btn || !ans)
            return;
        btn.addEventListener('click', () => {
            const open = row.classList.toggle('open');
            btn.textContent = open ? 'Verbergen' : 'Antwort';
            ans.hidden = !open;
        });
    });
}
//# sourceMappingURL=exam.js.map