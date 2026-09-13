import { ArrowRight, Battery, BadgeCheck, Search, Zap } from "lucide-react";

export type SeoLandingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  primaryTo: "/browse" | "/elektroauto-verkaufen-schweiz";
  secondaryCta: string;
  secondaryTo: "/browse" | "/elektroauto-verkaufen-schweiz";
  sections: Array<{ title: string; body: string }>;
};

const icons = [Search, Battery, Zap, BadgeCheck];

export function SeoLandingPage({
  eyebrow,
  title,
  description,
  primaryCta,
  primaryTo,
  secondaryCta,
  secondaryTo,
  sections,
}: SeoLandingPageProps) {
  return (
    <main className="flex-1">
      <section className="bg-gradient-hero">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={primaryTo}
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              {primaryCta}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={secondaryTo}
              className="inline-flex h-12 items-center rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground transition-all hover:border-foreground/40"
            >
              {secondaryCta}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 py-16 md:grid-cols-2">
        {sections.map((section, index) => {
          const Icon = icons[index % icons.length];
          return (
            <article
              key={section.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-card"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/20 text-graphite">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{section.body}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
