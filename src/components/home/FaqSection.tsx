import { faqItems } from "./faq";

export function FaqSection() {
  return (
    <section id="faq" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            FAQ für die Schweiz
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl text-balance">
            10 Fragen, die Käufer und Verkäufer vor dem E-Auto-Deal klären sollten.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Diese Checkliste hilft bei Schweizer Privat- und Händlerverkäufen, damit Batterie,
            Reichweite, Zubehör und Administration vor der Übergabe transparent sind.
          </p>
        </div>

        <div className="mt-10 divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          {faqItems.map((item, index) => (
            <article key={item.question} className="p-6 md:p-8">
              <div className="flex gap-4">
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-electric/20 text-sm font-semibold text-graphite">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold md:text-xl">{item.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
                  <a
                    href={item.sourceHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm font-semibold text-foreground underline decoration-electric decoration-2 underline-offset-4 hover:text-foreground/70"
                  >
                    Quelle: {item.sourceLabel}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
