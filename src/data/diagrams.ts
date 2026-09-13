export interface DiagramPart {
  conceptId: string;
  point: [number, number];
  marker: [number, number];
  hint: string;
}

export interface Diagram {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  alt: string;
  source: { title: string; url: string };
  parts: DiagramPart[];
}

// Coordinates refer to a 1000 × 720 drawing. Labels live in the concept files.
const part = (
  conceptId: string,
  point: [number, number],
  marker: [number, number],
  hint: string,
): DiagramPart => ({ conceptId, point, marker, hint });
export const diagrams: Diagram[] = [
  {
    id: "bicycle",
    title: "Hele sykkelen",
    subtitle: "Start med det du ser",
    description:
      "En sykkel med rett styre, stiv gaffel, skivebremser og ett fremre kjededrev. Velg en del, eller gå tettere på i en detaljtegning.",
    alt: "Sykkel sett fra drivsiden, med bakhjul til venstre og forhjul til høyre. Åtte nummererte pekere kobler delene til ordlisten.",
    source: {
      title: "Park Tool · Repair Help",
      url: "https://www.parktool.com/en-us/blog/repair-help",
    },
    parts: [
      part("saddle", [350, 170], [80, 90], "Setet øverst på setepinnen."),
      part(
        "frame",
        [500, 259],
        [80, 270],
        "Rammen mellom hjulene. Detaljtegningen viser de enkelte rørene.",
      ),
      part(
        "tire",
        [97, 465],
        [80, 450],
        "Den ytterste delen av hjulet, som møter bakken.",
      ),
      part(
        "chain",
        [365, 535],
        [80, 630],
        "Kjedet mellom bakhjulets tannhjul og kjededrevet ved kranken.",
      ),
      part(
        "handle-bar",
        [710, 175],
        [920, 90],
        "Styret ved sykkelens fremre ende.",
      ),
      part(
        "fork",
        [708, 345],
        [920, 270],
        "Gaffelen mellom styrerøret og forhjulsnavet.",
      ),
      part("hub", [750, 465], [920, 450], "Navet i sentrum av forhjulet."),
      part("pedal", [540, 540], [920, 630], "Pedalen ytterst på krankarmen."),
    ],
  },
  {
    id: "frame",
    title: "Rammen",
    subtitle: "Rør, fester og overganger",
    description:
      "En forenklet diamantramme uten hjul og utstyr. Se forskjellen på styrerør, seterør og rørene i bakrammen.",
    alt: "Diamantramme sett fra siden, med åtte pekere til rør, krankhus og bakre hjulfeste.",
    source: {
      title: "Wikimedia Commons · Bicycle diagram-no (referanse)",
      url: "https://commons.wikimedia.org/wiki/File:Bicycle_diagram-no.svg",
    },
    parts: [
      part(
        "top-tube",
        [500, 220],
        [80, 90],
        "Det øvre røret mellom seterøret og styrerøret.",
      ),
      part(
        "seat-stay",
        [265, 362],
        [80, 270],
        "Det skrå røret fra øvre del av seterøret til bakre hjulfeste.",
      ),
      part(
        "dropout",
        [170, 510],
        [80, 450],
        "Festet for bakhjulsakselen, her vist med en åpen spalte.",
      ),
      part(
        "chain-stay",
        [310, 522],
        [80, 630],
        "Det nedre røret fra krankhuset til bakre hjulfeste.",
      ),
      part(
        "head-tube",
        [715, 253],
        [920, 90],
        "Rammens korte fremre rør. Gaffelens kronerør går gjennom dette.",
      ),
      part(
        "down-tube",
        [580, 413],
        [920, 270],
        "Det skrå røret fra styrerøret til krankhuset.",
      ),
      part(
        "seat-tube",
        [407, 395],
        [920, 450],
        "Røret fra krankhuset opp mot setepinnen.",
      ),
      part(
        "bottom-bracket-shell",
        [445, 530],
        [920, 630],
        "Rammens hus rundt kranklageret, vist som en åpen ring.",
      ),
    ],
  },
  {
    id: "drivetrain",
    title: "Drivverket",
    subtitle: "Fra kjededrev til trinsehjul",
    description:
      "Et mekanisk bakgir og et drivverk med ett fremre kjededrev, sett fra drivsiden. Delene er forstørret og forenklet for å vise forskjellene.",
    alt: "Kassett og bakgir til venstre, kjededrev og krankarm til høyre, koblet sammen av kjedet. Føringstrinsen er over strekktrinsen.",
    source: {
      title: "Park Tool · How a Rear Derailleur Works",
      url: "https://www.parktool.com/en-us/blog/repair-help/how-a-rear-derailleur-works",
    },
    parts: [
      part(
        "cassette",
        [280, 260],
        [80, 90],
        "Samlingen av tannhjul på bakhjulet.",
      ),
      part(
        "barrel-adjuster",
        [372, 318],
        [80, 270],
        "Den gjengede justeringen der girvaieren kommer inn i dette mekaniske bakgiret.",
      ),
      part(
        "g-pulley",
        [320, 410],
        [80, 450],
        "Det øvre trinsehjulet, nærmest kassetten.",
      ),
      part(
        "t-pulley",
        [260, 540],
        [80, 630],
        "Det nedre trinsehjulet i bakgirets bur.",
      ),
      part(
        "chain",
        [525, 205],
        [920, 90],
        "Kjedet går rundt kjededrev, kassett og begge trinsehjulene.",
      ),
      part(
        "chainring",
        [809, 307],
        [920, 270],
        "Det fremre tannhjulet som kjedet griper i.",
      ),
      part(
        "crank",
        [740, 440],
        [920, 450],
        "Krankarmen mellom pedal og krankaksel.",
      ),
      part(
        "rear-derailleur",
        [375, 370],
        [920, 630],
        "Bakgiret fører kjedet mellom kassettens tannhjul og tar opp kjedeslakk.",
      ),
    ],
  },
  {
    id: "headset",
    title: "Styrelageret",
    subtitle: "Se delene som ligger skjult",
    description:
      "Sprengskisse av et gjengeløst styrelager med stjernemutter. Delene er trukket fra hverandre; dette er en begrepsskisse, ikke en monteringsanvisning.",
    alt: "Vertikal sprengskisse med topplokk, styrefremspring, avstandsringer, lager, styrerør og kronering. Et sideutsnitt viser stjernemutter inne i kronerøret.",
    source: {
      title: "Park Tool · Threadless Headset Service",
      url: "https://www.parktool.com/en-us/blog/repair-help/threadless-headset-service",
    },
    parts: [
      part(
        "top-cap",
        [465, 90],
        [80, 90],
        "Lokket øverst i den gjengeløse styrelagerenheten.",
      ),
      part(
        "spacer",
        [460, 257],
        [80, 270],
        "Avstandsringene rundt kronerøret, her vist under styrefremspringet.",
      ),
      part(
        "head-set",
        [460, 350],
        [80, 450],
        "Lagerenheten rundt kronerøret. Øvre og nedre lager er vist på hver sin side av rammens styrerør.",
      ),
      part(
        "crown-race",
        [460, 586],
        [80, 630],
        "Ringen ved gaffelkronen, under det nedre lageret.",
      ),
      part(
        "stem",
        [548, 173],
        [920, 90],
        "Styrefremspringet forbinder styret med gaffelens kronerør.",
      ),
      part(
        "star-nut",
        [760, 314],
        [920, 330],
        "Stjernemutteren er vist inne i et utsnitt av et metallkronerør.",
      ),
      part(
        "steerer-tube",
        [460, 623],
        [920, 630],
        "Gaffelens kronerør går gjennom rammens styrerør og styrelageret.",
      ),
    ],
  },
  {
    id: "wheel",
    title: "Hjul og brems",
    subtitle: "Fra dekk til nav",
    description:
      "Et forhjul med skivebrems sett fra bremsesiden. Nav, bremseskive og ventil er forstørret i forhold til hjulet for å gjøre dem lettere å finne.",
    alt: "Hjul sett fra bremsesiden, med dekk, felg, eiker, nav, ventil, bremseskive og bremsekaliper.",
    source: {
      title: "Park Tool · Repair Help",
      url: "https://www.parktool.com/en-us/blog/repair-help",
    },
    parts: [
      part("tire", [303, 166], [80, 90], "Dekket er den ytterste ringen."),
      part(
        "rim",
        [280, 240],
        [80, 270],
        "Felgen ligger innenfor dekket og holder det på plass.",
      ),
      part(
        "spoke",
        [374, 439],
        [80, 450],
        "Eikene forbinder navet med felgen.",
      ),
      part(
        "valve",
        [500, 588],
        [80, 630],
        "Ventilen stikker innover fra felgen, her nederst i hjulet.",
      ),
      part(
        "brake-caliper",
        [560, 267],
        [920, 90],
        "Bremsekaliperen griper rundt bremseskiven.",
      ),
      part(
        "brake-rotor",
        [589, 388],
        [920, 330],
        "Bremseskiven er festet ved navet.",
      ),
      part(
        "hub",
        [500, 360],
        [920, 630],
        "Navet er midt i hjulet, der eikene møtes.",
      ),
    ],
  },
];

export const diagramHref = (id: string) =>
  id === "bicycle" ? "/explore/" : `/explore/${id}/`;
export const diagramsForConcept = (id: string) =>
  diagrams.filter((diagram) =>
    diagram.parts.some((part) => part.conceptId === id),
  );
