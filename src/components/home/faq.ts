import type { FaqItem } from "@/lib/faq";

/** Buyer/seller checklist shown on the home page. Each answer cites a Swiss source. */
export const faqItems: Array<FaqItem & { sourceLabel: string; sourceHref: string }> = [
  {
    question: "Wie prüfe ich den Batteriezustand (State of Health) eines gebrauchten Elektroautos?",
    answer:
      "Verlange einen aktuellen SoH-Wert in Prozent und idealerweise ein unabhängiges Batteriezertifikat. Der SoH zeigt, wie viel der ursprünglichen Batteriekapazität noch nutzbar ist; für Schweizer Occasionen bieten etwa TCS-Standorte Batterietests an.",
    sourceLabel: "TCS Batteriecheck",
    sourceHref:
      "https://www.tcs.ch/de/der-tcs/sektionen/zuerich/news/batterietest-elektrofahrzeuge.php",
  },
  {
    question: "Läuft noch Garantie auf die Hochvoltbatterie?",
    answer:
      "Prüfe Erstzulassung, Kilometerstand, Servicehistorie und die Garantiebedingungen des Herstellers. Viele Batteriegarantien sind zeitlich und nach Laufleistung begrenzt und greifen erst unter einer definierten Restkapazität, häufig rund 70 Prozent.",
    sourceLabel: "EnergieSchweiz zu E-Occasionen",
    sourceHref: "https://www.energieschweiz.ch/programme/fahr-mit-dem-strom/e-occasionen/",
  },
  {
    question:
      "Wurde das Auto hauptsächlich zu Hause mit AC oder häufig per Schnellladung mit DC geladen?",
    answer:
      "Ein überwiegender AC-Ladealltag an Wallbox oder öffentlicher Normalladestation ist meist akku-schonender als sehr häufiges Schnellladen auf Langstrecken. Käufer sollten nach Ladeprofil, typischem Ladestand und vorhandenen Ladebelegen fragen.",
    sourceLabel: "EnergieSchweiz Laden & Alltag",
    sourceHref: "https://www.energieschweiz.ch/programme/fahr-mit-dem-strom/e-occasionen/",
  },
  {
    question: "Welche Ladekabel und welches Zubehör gehören zum Verkauf?",
    answer:
      "Kläre vor der Übergabe, ob Typ-2-Kabel, mobiles Notladekabel, Adapter, Tasche, Ladekarten und allfällige Wallbox-Komponenten enthalten sind. Fehlendes Originalzubehör kann in der Schweiz schnell mehrere hundert Franken kosten.",
    sourceLabel: "EnergieSchweiz E-Auto-Ratgeber",
    sourceHref: "https://www.energieschweiz.ch/programme/fahr-mit-dem-strom/e-occasionen/",
  },
  {
    question: "Sind Software-Updates und Rückrufe erledigt?",
    answer:
      "Frag nach dem Softwarestand im Fahrzeug, erledigten Serviceaktionen und Over-the-Air-Updates. Aktualisierte Software kann Batteriemanagement, Ladeplanung, Effizienz und Assistenzsysteme verbessern.",
    sourceLabel: "TCS E-Auto-Occasionen",
    sourceHref:
      "https://www.tcs.ch/de/der-tcs/sektionen/zuerich/news/batterietest-elektrofahrzeuge.php",
  },
  {
    question: "Wann ist der nächste Service fällig?",
    answer:
      "Auch Elektroautos brauchen Wartung: Bremsflüssigkeit, Bremsen, Reifen, Innenraumfilter, Kühlkreisläufe und Hochvolt-Komponenten sollten gemäss Serviceplan dokumentiert sein. Lass dir digitales Serviceheft und Rechnungen zeigen.",
    sourceLabel: "EnergieSchweiz Occasionen",
    sourceHref: "https://www.energieschweiz.ch/programme/fahr-mit-dem-strom/e-occasionen/",
  },
  {
    question: "Welche reale Reichweite ist im Schweizer Winter realistisch?",
    answer:
      "Verlass dich nicht nur auf WLTP. Kälte, Heizung, Winterreifen, Bergstrecken und Autobahntempo reduzieren die Reichweite. EnergieSchweiz weist darauf hin, dass tiefe Temperaturen und Heizung im Winter spürbar zusätzliche Energie benötigen.",
    sourceLabel: "EnergieSchweiz Wintertipps",
    sourceHref:
      "https://www.energieschweiz.ch/programme/fahr-mit-dem-strom/elektroautos-im-winter/",
  },
  {
    question: "Sind Reifen und Felgen für ein Elektroauto passend?",
    answer:
      "Kontrolliere Profiltiefe, DOT-Alter, Traglastindex, gleichmässigen Verschleiss und ob Sommer- sowie Winterräder vorhanden sind. Wegen hohem Gewicht und starkem Drehmoment sind geeignete Reifen für Sicherheit, Verbrauch und Geräuschkomfort wichtig.",
    sourceLabel: "EnergieSchweiz E-Occasionen",
    sourceHref: "https://www.energieschweiz.ch/programme/fahr-mit-dem-strom/e-occasionen/",
  },
  {
    question: "Ist die Batterie im Kaufpreis enthalten oder gemietet?",
    answer:
      "Gerade bei älteren Modellen sollten Käufer ausdrücklich prüfen, ob die Batterie Eigentum ist oder ein Mietvertrag besteht. Schweizer Inserate führen bei Renault Zoe beispielsweise weiterhin Varianten mit Batteriemiete und mit Batterie inklusive.",
    sourceLabel: "Beispiel Renault Zoe Batteriemiete",
    sourceHref: "https://www.autolina.ch/renault/zoe",
  },
  {
    question: "Gibt es Leasing, Code 178 oder andere Einschränkungen beim Halterwechsel?",
    answer:
      "Vor Zahlung und Übergabe muss klar sein, dass das Fahrzeug rechtmässig verkauft werden darf. Bei Leasing ist in der Schweiz oft Code 178 «Halterwechsel verboten» im Fahrzeugausweis eingetragen; die Löschung muss über die Leasinggesellschaft beziehungsweise das Strassenverkehrsamt erfolgen.",
    sourceLabel: "Kanton Zürich zu Code 178",
    sourceHref:
      "https://www.zh.ch/de/mobilitaet/fahrzeuge-kontrollschilder/code-178-halterwechsel-verboten.html",
  },
];
