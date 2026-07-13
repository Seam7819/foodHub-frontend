const steps = [
  {
    title: "Create your storefront",
    description: "Open a provider account, add your brand, and publish your first catalog in minutes.",
  },
  {
    title: "Showcase your products",
    description: "Upload images, set prices, describe features, and highlight what makes your offers unique.",
  },
  {
    title: "Start earning online",
    description: "Customers discover your products, place orders, and your business grows through the marketplace.",
  },
];

const trustPoints = [
  "Direct provider payouts",
  "Verified storefronts",
  "Secure checkout flow",
  "Responsive shopping experience",
];

const MarketplaceStory = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-10 text-white shadow-sm sm:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-400">For merchants and shoppers</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                A marketplace that puts trust and growth first
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Buyers discover dependable products from real providers, while sellers can launch a polished storefront and reach the right audience faster.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/register" className="rounded-full bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-400">
                  Open your store
                </a>
                <a href="/products" className="rounded-full border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10">
                  Explore marketplace
                </a>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <div key={point} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-200">
                    {point}
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {steps.map((step, index) => (
                  <div key={step.title} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm text-slate-300">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceStory;
