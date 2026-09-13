import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Pencil, Trash2 } from "lucide-react";
import { QueryProvider } from "@/components/site/QueryProvider";
import { deleteListing, fetchMyListings } from "@/data/listings";
import { formatCHF, formatKm } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { sendLoginLink, useLoginLinkCooldown, useSupabaseUser } from "@/hooks/useSupabaseUser";
import { germanErrorMessage } from "@/lib/german-error";

export function AccountPage() {
  return (
    <QueryProvider>
      <AccountListings />
    </QueryProvider>
  );
}

function AccountListings() {
  const { user, loading } = useSupabaseUser();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginCooldownSeconds = useLoginLinkCooldown(email);
  const queryClient = useQueryClient();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: () => fetchMyListings(user!.id),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (listingId: string) => deleteListing(listingId, user?.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-listings", user?.id] }),
    onError: (err) => setError(germanErrorMessage(err, "Inserat konnte nicht gelöscht werden")),
  });

  function confirmDelete(listingId: string, label: string) {
    setError(null);
    const confirmed = window.confirm(
      `Möchtest du das Inserat „${label}“ wirklich löschen? Bilder und Batteriezertifikat werden ebenfalls entfernt.`,
    );
    if (confirmed) deleteMutation.mutate(listingId);
  }

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      await sendLoginLink(email);
      setSent(true);
    } catch (err) {
      setError(germanErrorMessage(err, "Login-Link konnte nicht gesendet werden"));
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Konto
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold">Mein Profil</h1>
        </div>
        {user && (
          <button
            onClick={() => supabase.auth.signOut()}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Abmelden
          </button>
        )}
      </div>

      {!loading && !user ? (
        <form
          onSubmit={login}
          className="mt-10 max-w-xl space-y-4 rounded-3xl border border-border bg-card p-8 shadow-card"
        >
          <h2 className="font-display text-xl font-semibold">Per Link anmelden</h2>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.ch"
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-foreground/40 focus:ring-4 focus:ring-electric/20"
          />
          {sent && (
            <p className="text-sm text-muted-foreground">
              Link gesendet. Falls er nicht ankommt, kannst du nach kurzer Wartezeit einen neuen
              Link anfordern.
            </p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loginCooldownSeconds > 0}
            className="h-11 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {loginCooldownSeconds > 0
              ? `Erneut senden in ${loginCooldownSeconds}s`
              : sent
                ? "Link erneut senden"
                : "Link senden"}
          </button>
        </form>
      ) : null}

      {user ? (
        <div className="mt-10 space-y-4">
          <a
            href="/elektroauto-verkaufen-schweiz"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Neues Inserat erstellen
          </a>
          {isLoading ? <p className="text-muted-foreground">Wird geladen…</p> : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {!isLoading && listings.length === 0 ? (
            <p className="text-muted-foreground">Noch keine Inserate.</p>
          ) : null}
          {listings.map((listing) => (
            <article
              key={listing.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div>
                <h2 className="font-display text-xl font-semibold">
                  {listing.brand} {listing.model}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {listing.year} · {formatKm(listing.mileage)} · {formatCHF(listing.price)} ·{" "}
                  {listing.location}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/listings/${listing.id}`}
                  className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
                >
                  Ansehen
                </a>
                <a
                  href={`/account/listings/${listing.id}/edit`}
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                >
                  <Pencil className="h-4 w-4" /> Bearbeiten
                </a>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => confirmDelete(listing.id, `${listing.brand} ${listing.model}`)}
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" /> Löschen
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </main>
  );
}
