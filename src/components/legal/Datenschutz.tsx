export function Datenschutz() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-display text-4xl font-semibold">Datenschutzerklärung</h1>
        <p className="mt-4 text-sm text-muted-foreground">Stand: Juli 2026</p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-foreground">
          <section>
            <h2 className="font-display text-lg font-semibold">1. Verantwortliche</h2>
            <p className="mt-2 text-muted-foreground">
              Verantwortlich für die Bearbeitung personenbezogener Daten auf{" "}
              <strong>Audo.ch</strong> ist:
            </p>
            <div className="mt-4 space-y-1 text-muted-foreground">
              <p>
                <strong>yulci GmbH</strong>
                <br />
                Neuhausen am Rheinfall
                <br />
                Schweiz
              </p>
              <p>
                Handelsregister-Nr.: <strong>CHE-223.944.232</strong>
              </p>
              <p>
                Vertretungsberechtigte Person: <strong>Dreni Morina</strong>
              </p>
              <p>
                E-Mail:{" "}
                <a href="mailto:hallo@audo.ch" className="underline hover:text-foreground">
                  hallo@audo.ch
                </a>
              </p>
            </div>
            <p className="mt-4 text-muted-foreground">
              Der Schutz deiner Privatsphäre ist uns wichtig. Wir bearbeiten personenbezogene
              Daten sorgfältig, zweckgebunden und im Einklang mit dem anwendbaren Schweizer
              Datenschutzrecht.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">2. Welche Daten wir bearbeiten</h2>
            <p className="mt-2 text-muted-foreground">
              Je nach Nutzung unserer Plattform bearbeiten wir insbesondere folgende
              personenbezogene Daten:
            </p>

            <h3 className="mt-4 font-semibold">Registrierungsdaten</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>E-Mail-Adresse</li>
            </ul>

            <h3 className="mt-4 font-semibold">Profildaten</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Name (sofern angegeben)</li>
              <li>Benutzerrolle</li>
              <li>freiwillig angegebene Informationen</li>
            </ul>

            <h3 className="mt-4 font-semibold">Inseratsdaten</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Fahrzeugdaten</li>
              <li>Beschreibung</li>
              <li>Bilder</li>
              <li>Standort</li>
              <li>Preis</li>
              <li>weitere freiwillig angegebene Informationen</li>
            </ul>

            <h3 className="mt-4 font-semibold">Kontaktanfragen</h3>
            <p className="mt-2 text-muted-foreground">
              Wenn du über Audo.ch Kontakt mit einem Verkäufer aufnimmst, bearbeiten wir
              insbesondere:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Name</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer (falls angegeben)</li>
              <li>Nachricht</li>
            </ul>

            <h3 className="mt-4 font-semibold">Technische Daten</h3>
            <p className="mt-2 text-muted-foreground">
              Beim Besuch unserer Website können automatisch technische Informationen verarbeitet
              werden, beispielsweise:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>IP-Adresse</li>
              <li>Browsertyp</li>
              <li>Betriebssystem</li>
              <li>Datum und Uhrzeit</li>
              <li>aufgerufene Seiten</li>
              <li>Referrer-URL</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Diese Informationen dienen dem sicheren Betrieb sowie der technischen Bereitstellung
              der Plattform.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">3. Zweck der Datenbearbeitung</h2>
            <p className="mt-2 text-muted-foreground">
              Wir bearbeiten personenbezogene Daten ausschliesslich zur:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Bereitstellung und zum Betrieb der Plattform,</li>
              <li>Verwaltung von Benutzerkonten,</li>
              <li>Veröffentlichung und Verwaltung von Inseraten,</li>
              <li>Kontaktvermittlung zwischen Käufern und Verkäufern,</li>
              <li>Bearbeitung von Supportanfragen,</li>
              <li>Verbesserung unserer Plattform,</li>
              <li>Erkennung und Verhinderung von Missbrauch,</li>
              <li>Erfüllung gesetzlicher Verpflichtungen.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">4. Cookies</h2>
            <p className="mt-2 text-muted-foreground">
              Audo.ch verwendet notwendige lokale Speichertechnologien, um die Funktionalität,
              Sicherheit und Benutzerfreundlichkeit der Website sicherzustellen. Dazu gehören
              beispielsweise Session-Informationen für Verkäuferkonten und deine gespeicherte
              Datenschutz-Auswahl.
            </p>
            <p className="mt-4 text-muted-foreground">
              Darüber hinaus verwenden wir nur Google Analytics für unpersonalisierte statistische
              Auswertungen, sofern du dem zustimmst. Wir setzen keine zusätzlichen Marketing- oder
              Werbe-Cookies ein.
            </p>
            <p className="mt-4 text-muted-foreground">
              Du kannst Cookies und lokale Speichertechnologien jederzeit über die Einstellungen
              deines Browsers einschränken oder deaktivieren. Dadurch können einzelne Funktionen
              der Website eingeschränkt sein.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">5. Google Analytics</h2>
            <p className="mt-2 text-muted-foreground">
              Zur Verbesserung unseres Angebots verwenden wir <strong>Google Analytics</strong>.
            </p>
            <p className="mt-4 text-muted-foreground">
              Google Analytics unterstützt uns dabei zu verstehen,
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>welche Seiten besucht werden,</li>
              <li>wie unsere Plattform genutzt wird,</li>
              <li>welche Inhalte verbessert werden können.</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Google Analytics wird erst geladen, wenn du der Statistik-Nutzung zustimmst. Die
              Analyse erfolgt ausschliesslich für unpersonalisierte Statistiken und in
              datenschutzfreundlicher Konfiguration: Google-Signale, Werbe-Personalisierung und
              Ads-Speicherung sind deaktiviert. Die erhobenen Daten werden von uns nicht dazu
              verwendet, einzelne Personen direkt zu identifizieren.
            </p>
            <p className="mt-4 text-muted-foreground">Weitere Informationen findest du unter:</p>
            <p className="mt-2 text-muted-foreground">
              <a
                href="https://policies.google.com/privacy"
                className="underline hover:text-foreground"
                rel="noreferrer"
                target="_blank"
              >
                https://policies.google.com/privacy
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">
              6. Weitergabe personenbezogener Daten
            </h2>
            <p className="mt-2 text-muted-foreground">
              Die yulci GmbH verkauft keine personenbezogenen Daten an Dritte und gibt diese nicht
              zu Werbe- oder Marketingzwecken weiter.
            </p>
            <p className="mt-4 text-muted-foreground">
              Eine Weitergabe personenbezogener Daten erfolgt ausschliesslich,
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>soweit dies für den Betrieb der Plattform erforderlich ist,</li>
              <li>wenn wir gesetzlich dazu verpflichtet sind,</li>
              <li>oder wenn du ausdrücklich eingewilligt hast.</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Zur Bereitstellung unserer Dienstleistungen arbeiten wir mit sorgfältig ausgewählten
              Dienstleistern zusammen, welche personenbezogene Daten in unserem Auftrag bearbeiten
              können, insbesondere für:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Hosting,</li>
              <li>Datenbank,</li>
              <li>Authentifizierung,</li>
              <li>Dateispeicherung,</li>
              <li>E-Mail-Versand,</li>
              <li>Webanalyse.</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Diese Dienstleister sind vertraglich verpflichtet, personenbezogene Daten
              vertraulich und im Einklang mit den geltenden Datenschutzbestimmungen zu bearbeiten.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">7. Datensicherheit</h2>
            <p className="mt-2 text-muted-foreground">
              Der Schutz deiner personenbezogenen Daten ist uns wichtig.
            </p>
            <p className="mt-4 text-muted-foreground">
              Wir setzen angemessene technische und organisatorische Sicherheitsmassnahmen ein, um
              personenbezogene Daten vor unbefugtem Zugriff, Verlust, Missbrauch oder Veränderung
              zu schützen. Dazu gehören Massnahmen zur Abwehr und Eindämmung von
              Distributed-Denial-of-Service-Angriffen (DDoS), insbesondere automatisierte
              Traffic-Filterung, Ratenbegrenzungen und Überwachung auffälliger Zugriffsmuster.
              Unsere Systeme werden regelmässig überprüft und nach Möglichkeit an aktuelle
              Sicherheitsstandards angepasst.
            </p>
            <p className="mt-4 text-muted-foreground">
              Trotz grösstmöglicher Sorgfalt kann jedoch keine Datenübertragung über das Internet
              oder elektronische Speicherung vollständig vor allen Risiken geschützt werden. Eine
              absolute Sicherheit kann daher nicht gewährleistet werden.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">8. Speicherdauer</h2>
            <p className="mt-2 text-muted-foreground">
              Wir speichern personenbezogene Daten nur so lange, wie dies
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>für den Betrieb der Plattform erforderlich ist,</li>
              <li>gesetzliche Aufbewahrungspflichten bestehen,</li>
              <li>oder berechtigte Interessen dies erfordern.</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Benutzerkonten und Inserate können nach Löschung des Kontos oder des Inserats im
              Rahmen gesetzlicher Pflichten oder berechtigter Interessen für eine angemessene
              Dauer gespeichert bleiben.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">9. Deine Rechte</h2>
            <p className="mt-2 text-muted-foreground">
              Im Rahmen des anwendbaren Schweizer Datenschutzrechts hast du insbesondere das
              Recht,
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Auskunft über deine gespeicherten personenbezogenen Daten zu verlangen,</li>
              <li>unrichtige Daten berichtigen zu lassen,</li>
              <li>
                die Löschung deiner personenbezogenen Daten zu verlangen, soweit keine
                gesetzlichen Aufbewahrungspflichten entgegenstehen,
              </li>
              <li>
                eine Einschränkung der Bearbeitung zu verlangen, soweit gesetzlich vorgesehen.
              </li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Die Löschung eines Benutzerkontos kann jederzeit per E-Mail an{" "}
              <a href="mailto:hallo@audo.ch" className="underline hover:text-foreground">
                hallo@audo.ch
              </a>{" "}
              beantragt werden.
            </p>
            <p className="mt-4 text-muted-foreground">
              Wir bearbeiten entsprechende Anfragen schnellstmöglich. Gesetzliche
              Aufbewahrungspflichten oder überwiegende berechtigte Interessen bleiben vorbehalten.
            </p>
            <p className="mt-4 text-muted-foreground">
              Anfragen zum Datenschutz können jederzeit an{" "}
              <a href="mailto:hallo@audo.ch" className="underline hover:text-foreground">
                hallo@audo.ch
              </a>{" "}
              gerichtet werden.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">10. Links zu externen Websites</h2>
            <p className="mt-2 text-muted-foreground">
              Unsere Website kann Links zu externen Websites enthalten.
            </p>
            <p className="mt-4 text-muted-foreground">
              Für deren Inhalte sowie deren Datenschutzpraktiken übernimmt die yulci GmbH keine
              Verantwortung. Es gelten die jeweiligen Datenschutzerklärungen der entsprechenden
              Anbieter.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">
              11. Änderungen dieser Datenschutzerklärung
            </h2>
            <p className="mt-2 text-muted-foreground">
              Die yulci GmbH behält sich das Recht vor, diese Datenschutzerklärung jederzeit
              anzupassen.
            </p>
            <p className="mt-4 text-muted-foreground">
              Es gilt jeweils die auf Audo.ch veröffentlichte Version.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold">Kontakt</h2>
            <div className="mt-2 space-y-1 text-muted-foreground">
              <p>
                <strong>Audo.ch</strong>
              </p>
              <p>betrieben durch</p>
              <p>
                <strong>yulci GmbH</strong>
              </p>
              <p>
                Neuhausen am Rheinfall
                <br />
                Schweiz
              </p>
              <p>
                Handelsregister: <strong>CHE-223.944.232</strong>
              </p>
              <p>
                Vertretungsberechtigte Person: <strong>Dreni Morina</strong>
              </p>
              <p>
                E-Mail:{" "}
                <a href="mailto:hallo@audo.ch" className="underline hover:text-foreground">
                  hallo@audo.ch
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
