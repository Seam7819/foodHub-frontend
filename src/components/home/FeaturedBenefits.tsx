const features = [
  {
    title: "Smart discovery",
    description: "Customers can quickly find products with search, filtering, and category navigation.",
  },
  {
    title: "Provider controls",
    description: "Vendors can publish listings, adjust pricing, and manage their catalog efficiently.",
  },
  {
    title: "Reliable checkout",
    description: "Cart, wishlist, and order flow are built to support a smooth buying experience.",
  },
  {
    title: "Growth analytics",
    description: "Built-in insights help you understand what customers want and when they buy.",
  },
];

const FeaturedBenefits = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">Why it stands out</p>
          <h2 className="mt-2 text-2xl font-bold text-app-fg md:text-3xl">
            Built for modern commerce from day one
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBenefits;
