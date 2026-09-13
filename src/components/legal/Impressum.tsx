export function Impressum() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-semibold">Impressum</h1>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="font-display text-lg font-semibold">Kontakt</h2>
            <p className="mt-2 text-muted-foreground">
              Audo.ch
              <br />
              betrieben durch
              <br />
              yulci GmbH
              <br />
              Neuhausen am Rheinfall
              <br />
              Schweiz
            </p>
            <p className="mt-2 text-muted-foreground">
              E-Mail:{" "}
              <a href="mailto:hallo@audo.ch" className="underline hover:text-foreground">
                hallo@audo.ch
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">Verantwortlich für den Inhalt</h2>
            <p className="mt-2 text-muted-foreground">yulci GmbH, Neuhausen am Rheinfall</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">Handelsregistereintrag</h2>
            <p className="mt-2 text-muted-foreground">
              Eingetragene Firma: yulci GmbH
              <br />
              Sitz: Neuhausen am Rheinfall, Schweiz
              <br />
              Handelsregister-Nr.: CHE-223.944.232
              <br />
              Vertretungsberechtigte Person: Dreni Morina
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">Haftungsausschluss</h2>
            <p className="mt-2 text-muted-foreground">
              Die Inhalte dieser Website wurden mit grösstmöglicher Sorgfalt erstellt. Die yulci
              GmbH übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und
              Aktualität der veröffentlichten Inhalte. Audo.ch stellt ausschliesslich die
              technische Plattform zur Verfügung und verkauft selbst keine Fahrzeuge. Für
              Inserate, Fahrzeugangaben, Kaufverträge, Zahlungen und Fahrzeugübergaben sind
              ausschliesslich die jeweiligen Nutzerinnen und Nutzer beziehungsweise
              Vertragsparteien verantwortlich.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
