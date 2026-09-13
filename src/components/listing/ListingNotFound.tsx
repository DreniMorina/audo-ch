export function ListingNotFound() {
  return (
    <div className="mx-auto max-w-3xl flex-1 px-6 py-24 text-center">
      <h1 className="font-display text-3xl">Inserat nicht gefunden</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dieses Inserat ist nicht mehr verfügbar oder wurde entfernt.
      </p>
      <a href="/browse" className="mt-4 inline-block text-sm underline">
        Zurück zur Übersicht
      </a>
    </div>
  );
}
