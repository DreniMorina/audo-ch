/**
 * Shared FAQ primitives. Two FAQ datasets exist side by side: the buyer checklist on
 * the home page (`components/home/faq.ts`) and the platform Q&A on `/faq`
 * (`components/faq/platform-faq.ts`). Both feed the same JSON-LD builder.
 */
export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * schema.org `FAQPage` graph. Search engines use it for rich results, AI answer
 * engines to lift a single question/answer pair out of the page, so every answer
 * has to read correctly on its own.
 */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
