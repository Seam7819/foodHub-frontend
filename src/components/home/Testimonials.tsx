const testimonials = [
  {
    name: "Mina R.",
    role: "Fashion provider",
    quote: "Cartora helped me launch a polished storefront quickly and attract customers who already match my niche.",
  },
  {
    name: "Awais K.",
    role: "Home goods seller",
    quote: "The marketplace experience feels modern, trustworthy, and simple for both buyers and sellers.",
  },
  {
    name: "Sara T.",
    role: "Shoppers community",
    quote: "I love how easy it is to discover new stores and compare products without friction.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-600">Trusted by growing teams</p>
          <h2 className="mt-2 text-2xl font-bold text-app-fg md:text-3xl">
            The kind of marketplace experience people remember
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.name} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">“{item.quote}”</p>
              <div className="mt-5">
                <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-orange-600">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
