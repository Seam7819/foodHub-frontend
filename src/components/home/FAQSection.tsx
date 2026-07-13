const faqs = [
  {
    question: "How does Cartora help shoppers discover better products?",
    answer: "Customers can browse curated categories, compare listings, and explore trusted providers without leaving a smooth shopping experience.",
  },
  {
    question: "Can providers launch their own storefront quickly?",
    answer: "Yes. Providers can create a profile, add products, and start selling through the marketplace with a simple onboarding flow.",
  },
  {
    question: "Is the platform built for growth?",
    answer: "Absolutely. The experience is designed to support more products, more providers, and stronger repeat customer engagement over time.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">Frequently asked questions</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
            Clear answers for buyers and sellers
          </h2>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-2xl border border-app bg-surface p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <summary className="cursor-pointer font-semibold text-app-fg dark:text-white">{faq.question}</summary>
              <p className="mt-3 text-sm leading-7 text-muted dark:text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
