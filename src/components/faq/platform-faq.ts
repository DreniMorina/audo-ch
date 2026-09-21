import type { FaqItem } from "@/lib/faq";

/**
 * Q&A about the platform itself, rendered on `/faq`.
 *
 * Written for answer engines as much as for readers: every answer names Audo.ch
 * instead of relying on "we" or "the platform", and stays true on its own once it
 * is lifted out of the page. Keep the facts in sync with the AGB, the sell form
 * and the browse filters — a wrong answer here gets quoted verbatim elsewhere.
 */
export type PlatformFaqItem = FaqItem & {
  /** Stable anchor, so a single answer can be linked and cited directly. */
  id: string;
};

export type PlatformFaqGroup = {
  id: string;
  title: string;
  items: PlatformFaqItem[];
};

export const platformFaqGroups: PlatformFaqGroup[] = [
  {
    id: "ueber-audo",
    title: "Über Audo.ch",
    items: [
      {
        id: "was-ist-audo",
        question: "Was ist Audo.ch?",
        answer:
          "Audo.ch ist ein Schweizer Online-Marktplatz, der sich ausschliesslich auf den Kauf und Verkauf von Elektroautos spezialisiert hat. Inseriert werden Neuwagen ebenso wie Occasionen, von Privatpersonen wie von Händlern. Käufer nehmen direkt mit den Verkäufern Kontakt auf, Verkäufer veröffentlichen ihre Inserate selbst.",
      },
      {
        id: "nur-elektroautos",
        question: "Warum gibt es auf Audo.ch nur Elektroautos?",
        answer:
          "Auf Audo.ch dürfen ausschliesslich vollelektrische Fahrzeuge inseriert werden, also keine Benziner, Diesel, Hybride oder Plug-in-Hybride. Dadurch sind Batteriekapazität, Reichweite und Ladeleistung bei jedem Inserat Pflichtangaben, statt in einer allgemeinen Fahrzeugsuche als Randnotiz unterzugehen.",
      },
      {
        id: "verkauft-audo-selbst",
        question: "Verkauft Audo.ch selbst Fahrzeuge?",
        answer:
          "Nein. Audo.ch stellt ausschliesslich die technische Plattform bereit und tritt zu keinem Zeitpunkt als Käufer, Verkäufer, Vermittler oder Vertreter einer Vertragspartei auf. Kaufverträge kommen ausschliesslich zwischen Käufer und Verkäufer zustande, ebenso Zahlung und Fahrzeugübergabe.",
      },
    ],
  },
  {
    id: "fuer-kaeufer",
    title: "Für Käufer",
    items: [
      {
        id: "konto-fuer-kaeufer",
        question: "Brauche ich ein Konto, um auf Audo.ch Elektroautos zu suchen?",
        answer:
          "Nein. Suchen, Filtern, Inserate ansehen und Verkäufer kontaktieren funktionieren auf Audo.ch ohne Registrierung. Ein Konto brauchst du erst, wenn du selbst ein Elektroauto inserieren möchtest.",
      },
      {
        id: "kosten-fuer-kaeufer",
        question: "Kostet die Nutzung für Käufer etwas?",
        answer:
          "Nein, für Käufer ist Audo.ch kostenlos. Es fallen weder Such- noch Kontakt- oder Vermittlungsgebühren an, und Audo.ch verdient nichts am Kaufpreis.",
      },
      {
        id: "verkaeufer-kontaktieren",
        question: "Wie nehme ich Kontakt mit einem Verkäufer auf?",
        answer:
          "Auf jeder Inseratsseite stehen die Kontaktmöglichkeiten des Verkäufers, je nach Angabe E-Mail-Adresse und Telefonnummer. Die Telefonnummer wird erst nach einem Klick eingeblendet. Danach läuft die Kommunikation direkt zwischen dir und dem Verkäufer, ohne Audo.ch als Zwischenstation.",
      },
      {
        id: "filter",
        question: "Nach welchen Kriterien kann ich Elektroautos filtern?",
        answer:
          "Die Fahrzeugsuche von Audo.ch filtert nach Suchbegriff, Marke, maximalem Preis, minimaler Reichweite, Verkäufertyp (privat oder Händler) und Garantie. Zusätzlich lässt sich auf Fahrzeuge mit Schnellladefunktion oder mit hinterlegtem Batteriezertifikat einschränken.",
      },
      {
        id: "batteriedaten",
        question: "Welche Batterie- und Ladedaten zeigt ein Inserat?",
        answer:
          "Jedes Inserat auf Audo.ch enthält Batteriekapazität in kWh, WLTP-Reichweite in km, DC-Ladeleistung in kW und die Angabe, ob Schnellladen möglich ist. Freiwillig ergänzen Verkäufer den Batteriezustand in Prozent (State of Health), Prüfanbieter und Datum der Prüfung sowie ein Batteriezertifikat als PDF.",
      },
      {
        id: "angaben-geprueft",
        question: "Prüft Audo.ch die Angaben in den Inseraten?",
        answer:
          "Die Angaben stammen von den Verkäufern, und Audo.ch übernimmt keine Gewähr für deren Richtigkeit, Vollständigkeit oder Aktualität. Angaben zum Batteriezustand und hochgeladene Zertifikate sind freiwillig und müssen vor dem Kauf unabhängig überprüft werden.",
      },
      {
        id: "preise",
        question: "Sind die angezeigten Preise inklusive Mehrwertsteuer?",
        answer:
          "Preise werden auf Audo.ch in Schweizer Franken angegeben und verstehen sich inklusive MwSt., soweit diese anwendbar ist. Bei Händlerfahrzeugen lohnt sich vor dem Kauf die Rückfrage, ob die Mehrwertsteuer separat ausgewiesen wird.",
      },
    ],
  },
  {
    id: "fuer-verkaeufer",
    title: "Für Verkäufer",
    items: [
      {
        id: "inserat-erstellen",
        question: "Wie inseriere ich mein Elektroauto auf Audo.ch?",
        answer:
          "Du meldest dich mit deiner E-Mail-Adresse an, füllst das Inseratsformular mit Fahrzeug-, Batterie- und Kontaktdaten aus und lädst Fotos hoch. Nach dem Absenden wird das Inserat auf Audo.ch direkt veröffentlicht und ist sofort in der Fahrzeugsuche auffindbar.",
      },
      {
        id: "kosten-fuer-verkaeufer",
        question: "Was kostet ein Inserat auf Audo.ch?",
        answer:
          "Inserieren ist auf Audo.ch im Early Access kostenlos, es gibt weder Einstell- noch Erfolgsgebühren. Sollten künftig kostenpflichtige Leistungen eingeführt werden, werden sie mindestens zwei Monate im Voraus angekündigt; für Leistungen, die zum Zeitpunkt der Nutzung kostenlos waren, entstehen keine nachträglichen Gebühren.",
      },
      {
        id: "anmeldung-ohne-passwort",
        question: "Wie funktioniert die Anmeldung ohne Passwort?",
        answer:
          "Audo.ch verwendet einen Magic Link: Du gibst deine E-Mail-Adresse ein und erhältst einen einmaligen Anmeldelink per Mail. Es gibt kein Passwort, das verloren gehen oder gestohlen werden kann. Kommt der Link nicht an, lässt sich nach rund einer Minute Wartezeit ein neuer anfordern.",
      },
      {
        id: "fotos-und-zertifikat",
        question: "Wie viele Fotos kann ich pro Inserat hochladen?",
        answer:
          "Pro Inserat sind auf Audo.ch bis zu vier Bilder mit je maximal 5 MB möglich. Zusätzlich lässt sich ein offizielles Batteriezertifikat als PDF mit maximal 15 MB anhängen; das macht dein Inserat über den Zertifikatsfilter auffindbar und erhöht das Vertrauen der Käufer.",
      },
      {
        id: "inserat-bearbeiten",
        question: "Kann ich mein Inserat später bearbeiten oder löschen?",
        answer:
          "Ja. Unter «Mein Profil» siehst du alle deine Inserate auf Audo.ch und kannst Angaben, Preis und Fotos jederzeit anpassen oder das Inserat nach dem Verkauf löschen. Einsehen und bearbeiten kannst du ausschliesslich deine eigenen Inserate.",
      },
      {
        id: "laufzeit",
        question: "Wie lange bleibt mein Inserat online?",
        answer:
          "Ein Inserat auf Audo.ch bleibt veröffentlicht, bis du es selbst löschst; es gibt keine automatische Laufzeitbegrenzung und keine Verlängerung, die du bezahlen müsstest. Nach dem Verkauf solltest du das Inserat entfernen, damit dich keine Anfragen zu einem nicht mehr verfügbaren Fahrzeug erreichen.",
      },
      {
        id: "privat-oder-haendler",
        question: "Kann ich als Händler auf Audo.ch inserieren?",
        answer:
          "Ja. Beim Erstellen eines Inserats wählst du zwischen «Privat» und «Händler». Der Verkäufertyp wird im Inserat angezeigt und kann von Käufern als Suchfilter genutzt werden. Für beide Typen gelten dieselben Regeln und aktuell dieselben kostenlosen Konditionen.",
      },
    ],
  },
  {
    id: "sicherheit-und-recht",
    title: "Sicherheit, Daten und Recht",
    items: [
      {
        id: "fake-inserate",
        question: "Was unternimmt Audo.ch gegen Fake-Inserate und Missbrauch?",
        answer:
          "Falsche oder irreführende Angaben, manipulierte Fahrzeugdaten, Fake-Inserate und nicht vollelektrische Fahrzeuge sind auf Audo.ch unzulässig. Bei Anhaltspunkten für Missbrauch, Betrug, Spam oder Gesetzesverstösse kann Audo.ch Inserate bearbeiten, ausblenden, sperren oder löschen und Benutzerkonten einschränken.",
      },
      {
        id: "verdaechtiges-inserat-melden",
        question: "Wie melde ich ein verdächtiges Inserat?",
        answer:
          "Schicke den Link zum Angebot und eine kurze Begründung an hallo@audo.ch.",
      },
      {
        id: "datenschutz",
        question: "Was passiert mit meinen Daten auf Audo.ch?",
        answer:
          "Personenbezogene Daten werden gemäss der Datenschutzerklärung von Audo.ch bearbeitet, es gilt ausschliesslich Schweizer Recht. Die Kontaktdaten, die du in einem Inserat hinterlegst, sind für Kaufinteressenten sichtbar, denn sie sind der Weg, auf dem dich Käufer erreichen.",
      },
    ],
  },
];

/** Flattened for the `FAQPage` graph, which has no notion of groups. */
export const platformFaqItems = platformFaqGroups.flatMap((group) => group.items);
